/**
 * Run once to create the devadmin user:
 *   ADMIN_SEED_PASSWORD=YourPassword123 node scripts/seed-admin.mjs
 */
import pkg from "pg";
import bcrypt from "bcryptjs";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? "postgresql://devadmin:devadmin_local_2025@localhost:5432/devs_creatives",
});

const username = process.env.ADMIN_USERNAME ?? "devadmin";
const password = process.env.ADMIN_SEED_PASSWORD ?? "ChangeMe123!";

const hash = await bcrypt.hash(password, 12);

await pool.query(
  `INSERT INTO admin_users (username, password_hash)
   VALUES ($1, $2)
   ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
  [username, hash]
);

console.log(`✓ Admin user "${username}" seeded successfully.`);
await pool.end();
