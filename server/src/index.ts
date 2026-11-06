import { app } from './app.js'
import { env } from './config/env.js'
import { pool } from './db/pool.js'

const server = app.listen(env.PORT, () => {
  console.info(`SIGMA API listening on http://localhost:${env.PORT}`)
})

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    server.close((error) => {
      if (error) {
        console.error('API server shutdown failed.', error)
        process.exitCode = 1
      }

      void pool.end()
    })
  })
}
