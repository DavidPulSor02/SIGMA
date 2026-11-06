import { createHash, randomBytes, randomUUID } from 'node:crypto'
import type { Response } from 'express'
import { env } from '../config/env.js'

export const SESSION_COOKIE = 'sigma_session'
export const SESSION_DURATION_MS = 8 * 60 * 60 * 1000

export function createSessionToken(): string {
  return randomBytes(32).toString('base64url')
}

export function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export function createSessionId(): string {
  return randomUUID()
}

export function setSessionCookie(response: Response, token: string): void {
  response.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_MS,
  })
}

export function clearSessionCookie(response: Response): void {
  response.clearCookie(SESSION_COOKIE, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
}
