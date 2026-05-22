/**
 * Run once to create the devadmin user:
 *   npx ts-node scripts/seed-admin.ts
 */
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  const username = process.env.ADMIN_USERNAME ?? "devadmin";
  const password = process.env.ADMIN_SEED_PASSWORD ?? "ChangeMe123!";
  const hash = await bcrypt.hash(password, 12);

  await pool.query(
    `INSERT INTO admin_users (username, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
    [username, hash]
  );

  console.log(`Admin user "${username}" seeded.`);
  await pool.end();
}

seed().catch((err) => { console.error(err); process.exit(1); });
