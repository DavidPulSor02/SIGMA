import { hash } from 'bcryptjs'
import { z } from 'zod'
import { pool } from '../db/pool.js'

const adminSchema = z.object({
  email: z.string().trim().email().max(254),
  name: z.string().trim().min(2).max(120),
  password: z.string().min(12).max(128).refine(
    (password) => Buffer.byteLength(password, 'utf8') <= 72,
    'Password must be at most 72 bytes.',
  ),
})

try {
  const admin = adminSchema.safeParse({
    email: process.env.SIGMA_ADMIN_EMAIL,
    name: process.env.SIGMA_ADMIN_NAME,
    password: process.env.SIGMA_ADMIN_PASSWORD,
  })

  if (!admin.success) {
    throw new Error(
      'Set SIGMA_ADMIN_EMAIL, SIGMA_ADMIN_NAME, and a SIGMA_ADMIN_PASSWORD of at least 12 characters in your local .env file.',
    )
  }

  const existingUser = await pool.query('SELECT 1 FROM users LIMIT 1')

  if (existingUser.rowCount) {
    throw new Error('An account already exists. Bootstrap is only allowed on an empty users table.')
  }

  const passwordHash = await hash(admin.data.password, 12)
  await pool.query(
    `INSERT INTO users (id, email, full_name, password_hash, role)
     VALUES (gen_random_uuid(), $1, $2, $3, 'admin')`,
    [admin.data.email.toLowerCase(), admin.data.name, passwordHash],
  )
  console.info(`Initial administrator created for ${admin.data.email.toLowerCase()}.`)
} catch (error) {
  console.error('Could not create the initial administrator.', error)
  process.exitCode = 1
} finally {
  await pool.end()
}
