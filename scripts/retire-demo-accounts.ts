import "dotenv/config";
import { findUserByEmail, deletePatientCompletely } from "../lib/db";

/**
 * Removes the three demo PATIENT accounts and all their data
 * (appointments, messages, insurance, intake, consents) from the
 * database. Does NOT touch the provider account (provider@wellsidebh.com)
 * — that's Wulaimot's real account, not a demo one. Use the "Forgot
 * password" flow to give it a real, private password if you haven't
 * already.
 *
 * Safe to run once you no longer need the seeded demo patients for
 * testing — e.g. right before real patients start using the app.
 */

const DEMO_PATIENT_EMAILS = ["jordan@example.com", "maya@example.com", "sam@example.com"];

async function main() {
  console.log("Retiring demo patient accounts...\n");

  for (const email of DEMO_PATIENT_EMAILS) {
    const user = await findUserByEmail(email);
    if (!user) {
      console.log(`skip: ${email} (no account found — already removed?)`);
      continue;
    }
    const result = await deletePatientCompletely(user.id);
    if (result.deleted) {
      console.log(`removed: ${email} (${result.name}) — and all their appointments, messages, insurance, and intake records`);
    } else {
      console.log(`skipped: ${email} (not a patient account — left untouched for safety)`);
    }
  }

  console.log("\nDone. Demo patient accounts are removed.");
  console.log("Note: provider@wellsidebh.com was NOT touched — that's the real provider account.");
  console.log("If it still uses the demo password, use 'Forgot password' on the login page to set a real one.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
