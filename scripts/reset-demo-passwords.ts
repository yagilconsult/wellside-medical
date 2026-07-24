import "dotenv/config";
import bcrypt from "bcryptjs";
import { findUserByEmail, updateUserPassword } from "../lib/db";

const DEMO_PASSWORD = "password123";

const DEMO_EMAILS = [
  "jordan@example.com",
  "maya@example.com",
  "sam@example.com",
  "provider@wellsidebh.com",
];

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  for (const email of DEMO_EMAILS) {
    const user = await findUserByEmail(email);
    if (!user) {
      console.log(`skip: ${email} (no account found)`);
      continue;
    }
    await updateUserPassword(user.id, passwordHash);
    console.log(`reset: ${email} -> password123`);
  }

  console.log("\nDone. All demo accounts now use: password123");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
