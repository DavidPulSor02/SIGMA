import { randomBytes } from 'node:crypto'
import { compare, hash } from 'bcryptjs'
import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { env } from '../config/env.js'
import { pool } from '../db/pool.js'
import {
  clearSessionCookie,
  createSessionId,
  createSessionToken,
  hashSessionToken,
  SESSION_COOKIE,
  SESSION_DURATION_MS,
  setSessionCookie,
} from './session.js'

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128).refine(
    (password) => Buffer.byteLength(password, 'utf8') <= 72,
  ),
})

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error: 'TOO_MANY_ATTEMPTS',
    message: 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.',
  },
})

const dummyPasswordHash = await hash(randomBytes(32).toString('hex'), 12)

export const authRouter = Router()

function requireSameOrigin(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const origin = request.get('origin')

  if (origin && origin !== env.APP_ORIGIN) {
    response.status(403).json({
      error: 'INVALID_ORIGIN',
      message: 'La solicitud proviene de un origen no permitido.',
    })
    return
  }

  next()
}

authRouter.post('/login', requireSameOrigin, loginLimiter, async (request, response) => {
  const parsedBody = loginSchema.safeParse(request.body)

  if (!parsedBody.success) {
    response.status(400).json({
      error: 'INVALID_REQUEST',
      message: 'Ingresa un correo y una contraseña válidos.',
    })
    return
  }

  const email = parsedBody.data.email.toLowerCase()
  const userResult = await pool.query<{
    id: string
    full_name: string
    email: string
    role: 'admin' | 'operator' | 'viewer'
    password_hash: string
    is_active: boolean
  }>(
    `SELECT id, full_name, email, role, password_hash, is_active
     FROM users
     WHERE LOWER(email) = $1
     LIMIT 1`,
    [email],
  )
  const user = userResult.rows[0]

  const passwordMatches = await compare(
    parsedBody.data.password,
    user?.password_hash ?? dummyPasswordHash,
  )

  if (!user || !user.is_active || !passwordMatches) {
    response.status(401).json({
      error: 'INVALID_CREDENTIALS',
      message: 'Correo o contraseña incorrectos.',
    })
    return
  }

  const token = createSessionToken()
  const tokenHash = hashSessionToken(token)
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)

  await pool.query('DELETE FROM auth_sessions WHERE expires_at <= NOW()')
  await pool.query(
    `INSERT INTO auth_sessions (id, user_id, token_hash, expires_at)
     VALUES ($1, $2, $3, $4)`,
    [createSessionId(), user.id, tokenHash, expiresAt],
  )

  setSessionCookie(response, token)
  response.status(200).json({
    user: {
      id: user.id,
      name: user.full_name,
      email: user.email,
      role: user.role,
    },
  })
})

authRouter.get('/me', async (request, response) => {
  const cookie = request.cookies[SESSION_COOKIE]
  const token = typeof cookie === 'string' ? cookie : undefined

  if (!token) {
    response.status(401).json({
      error: 'UNAUTHENTICATED',
      message: 'Inicia sesión para continuar.',
    })
    return
  }

  const sessionResult = await pool.query<{
    id: string
    full_name: string
    email: string
    role: 'admin' | 'operator' | 'viewer'
  }>(
    `SELECT users.id, users.full_name, users.email, users.role
     FROM auth_sessions
     JOIN users ON users.id = auth_sessions.user_id
     WHERE auth_sessions.token_hash = $1
       AND auth_sessions.expires_at > NOW()
       AND users.is_active = TRUE
     LIMIT 1`,
    [hashSessionToken(token)],
  )
  const user = sessionResult.rows[0]

  if (!user) {
    clearSessionCookie(response)
    response.status(401).json({
      error: 'UNAUTHENTICATED',
      message: 'La sesión expiró. Inicia sesión nuevamente.',
    })
    return
  }

  response.status(200).json({
    user: {
      id: user.id,
      name: user.full_name,
      email: user.email,
      role: user.role,
    },
  })
})

authRouter.post('/logout', requireSameOrigin, async (request, response) => {
  const cookie = request.cookies[SESSION_COOKIE]
  const token = typeof cookie === 'string' ? cookie : undefined

  if (token) {
    await pool.query('DELETE FROM auth_sessions WHERE token_hash = $1', [
      hashSessionToken(token),
    ])
  }

  clearSessionCookie(response)
  response.status(204).end()
})
