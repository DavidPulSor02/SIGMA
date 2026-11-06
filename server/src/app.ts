import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { type ErrorRequestHandler } from 'express'
import helmet from 'helmet'
import { env } from './config/env.js'
import { authRouter } from './auth/routes.js'
import { pool } from './db/pool.js'

export const app = express()

app.disable('x-powered-by')
app.use(helmet())
app.use(cors({
  origin: env.APP_ORIGIN,
  credentials: true,
}))
app.use(express.json({ limit: '16kb' }))
app.use(cookieParser())

app.get('/api/health', async (_request, response) => {
  await pool.query('SELECT 1')
  response.status(200).json({ status: 'ok' })
})

app.use('/api/auth', authRouter)

app.use('/api', (_request, response) => {
  response.status(404).json({
    error: 'NOT_FOUND',
    message: 'No se encontró el recurso solicitado.',
  })
})

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  console.error('Unhandled API error', error)
  const isInvalidJson =
    error instanceof SyntaxError &&
    'status' in error &&
    error.status === 400

  if (isInvalidJson) {
    response.status(400).json({
      error: 'INVALID_JSON',
      message: 'El cuerpo de la solicitud debe ser JSON válido.',
    })
    return
  }

  response.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'Ocurrió un error interno. Inténtalo más tarde.',
  })
}

app.use(errorHandler)
