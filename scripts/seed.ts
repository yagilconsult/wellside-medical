import "dotenv/config";
import bcrypt from "bcryptjs";
import {
  createUser,
  findUserByEmail,
  createAppointment,
  upsertInsurance,
  createMessage,
} from "../lib/db";

async function main() {
  const password = await bcrypt.hash("password123", 10);

  let wulaimot = await findUserByEmail("provider@wellsidebh.com");
  if (!wulaimot) {
    wulaimot = await createUser({
      email: "provider@wellsidebh.com",
      passwordHash: password,
      role: "PROVIDER",
      name: "Wulaimot Akindele",
      phone: "(555) 010-0199",
    });
  }

  let jordan = await findUserByEmail("jordan@example.com");
  if (!jordan) {
    jordan = await createUser({
      email: "jordan@example.com",
      passwordHash: password,
      role: "PATIENT",
      name: "Jordan Rivera",
      phone: "(555) 555-0132",
      dob: "1994-03-14",
    });
  }

  let maya = await findUserByEmail("maya@example.com");
  if (!maya) {
    maya = await createUser({
      email: "maya@example.com",
      passwordHash: password,
      role: "PATIENT",
      name: "Maya Chen",
      phone: "(555) 555-0177",
      dob: "1990-09-02",
    });
  }

  let sam = await findUserByEmail("sam@example.com");
  if (!sam) {
    sam = await createUser({
      email: "sam@example.com",
      passwordHash: password,
      role: "PATIENT",
      name: "Sam Okafor",
      phone: "(555) 555-0144",
      dob: "1988-11-21",
    });
  }

  await createAppointment({
    patientId: jordan.id,
    type: "Follow-up (30 min)",
    date: "2026-08-04",
    time: "14:00",
    status: "CONFIRMED",
    paymentMethod: "INSURANCE",
  });
  await createAppointment({
    patientId: jordan.id,
    type: "Initial evaluation (60 min)",
    date: "2026-07-07",
    time: "10:00",
    status: "COMPLETED",
    paymentMethod: "INSURANCE",
  });
  await createAppointment({
    patientId: maya.id,
    type: "Initial evaluation (60 min)",
    date: "2026-07-21",
    time: "15:30",
    status: "REQUESTED",
    paymentMethod: "INSURANCE",
  });

  await upsertInsurance(jordan.id, {
    company: "Blue Cross Blue Shield",
    plan: "PPO 500",
    memberId: "XYZ123456789",
    groupNumber: "00123",
    status: "VERIFIED",
  });
  await upsertInsurance(maya.id, { company: "Aetna", plan: "HMO", status: "PENDING" });
  await upsertInsurance(sam.id, {
    company: "United Healthcare",
    plan: "PPO",
    status: "MANUAL_REVIEW",
  });

  await createMessage({
    threadUserId: jordan.id,
    fromRole: "PROVIDER",
    authorId: wulaimot.id,
    text: "Hi Jordan, just confirming your next appointment for Aug 4 at 2:00pm. Let me know if that still works.",
  });
  await createMessage({
    threadUserId: jordan.id,
    fromRole: "PATIENT",
    authorId: jordan.id,
    text: "That works great, thank you!",
  });
  await createMessage({
    threadUserId: maya.id,
    fromRole: "PATIENT",
    authorId: maya.id,
    text: "Hi, I just uploaded my new insurance card — can you confirm it went through?",
  });

  console.log("Seed complete.");
  console.log("Provider login: provider@wellsidebh.com / password123");
  console.log("Patient login:  jordan@example.com / password123");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
