import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pool } from './pool.js'

try {
  const migration = await readFile(
    resolve(process.cwd(), 'server/migrations/001_auth.sql'),
    'utf8',
  )
  await pool.query(migration)
  console.info('Database migration completed.')
} catch (error) {
  console.error('Database migration failed.', error)
  process.exitCode = 1
} finally {
  await pool.end()
}
