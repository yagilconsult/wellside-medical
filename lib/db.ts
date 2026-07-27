import postgres from "postgres";

/**
 * Real Postgres data layer (e.g. Neon, Supabase, Vercel Postgres, or any
 * standard Postgres connection string in DATABASE_URL).
 *
 * All functions here are async — every caller must `await` them. Column
 * names are snake_case in SQL and automatically mapped to camelCase in TS
 * via `transform: postgres.camel`, so the shapes below match what the rest
 * of the app already expects.
 */

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Add your Postgres connection string to .env (see README for setup with Neon)."
  );
}

const sql = postgres(connectionString, {
  transform: postgres.camel,
  ssl: "require",
});

export type Role = "PATIENT" | "PROVIDER";
export type AppointmentStatus = "REQUESTED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type PaymentMethod = "INSURANCE" | "SELF_PAY";
export type InsuranceStatus = "PENDING" | "VERIFIED" | "REJECTED" | "MANUAL_REVIEW";
export type ConsentType = "HIPAA" | "TELEHEALTH" | "FINANCIAL";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: Role;
  name: string;
  phone?: string;
  dob?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  type: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  paymentMethod: PaymentMethod;
  videoRoomName?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  threadUserId: string;
  fromRole: Role;
  authorId: string;
  text: string;
  createdAt: string;
}

export interface InsuranceInfo {
  id: string;
  patientId: string;
  company: string;
  plan?: string;
  memberId?: string;
  groupNumber?: string;
  status: InsuranceStatus;
  cardFrontUrl?: string;
  cardBackUrl?: string;
  updatedAt: string;
}

export interface IntakeForm {
  id: string;
  patientId: string;
  medicalHistory?: string;
  behavioralHistory?: string;
  currentMedications?: string;
  previousTreatment?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  submittedAt?: string;
}

export interface ConsentForm {
  id: string;
  patientId: string;
  type: ConsentType;
  signedName: string;
  signedAt: string;
}

function id() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ---------- Users ----------

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const rows = await sql<User[]>`
    SELECT * FROM users WHERE email = ${email.toLowerCase().trim()}
  `;
  return rows[0];
}

export async function findUserById(userId: string): Promise<User | undefined> {
  const rows = await sql<User[]>`SELECT * FROM users WHERE id = ${userId}`;
  return rows[0];
}

export async function createUser(input: Omit<User, "id" | "createdAt">): Promise<User> {
  const rows = await sql<User[]>`
    INSERT INTO users (id, email, password_hash, role, name, phone, dob)
    VALUES (${id()}, ${input.email.toLowerCase().trim()}, ${input.passwordHash}, ${input.role}, ${input.name}, ${input.phone ?? null}, ${input.dob ?? null})
    RETURNING *
  `;
  return rows[0];
}

export async function updateUser(userId: string, patch: Partial<User>): Promise<User | undefined> {
  const rows = await sql<User[]>`
    UPDATE users SET
      name = COALESCE(${patch.name ?? null}, name),
      email = COALESCE(${patch.email?.toLowerCase().trim() ?? null}, email),
      phone = COALESCE(${patch.phone ?? null}, phone)
    WHERE id = ${userId}
    RETURNING *
  `;
  return rows[0];
}

export async function listPatients(): Promise<User[]> {
  return sql<User[]>`SELECT * FROM users WHERE role = 'PATIENT' ORDER BY created_at DESC`;
}

// ---------- Appointments ----------

export async function listAppointmentsForPatient(patientId: string): Promise<Appointment[]> {
  return sql<Appointment[]>`
    SELECT * FROM appointments WHERE patient_id = ${patientId}
    ORDER BY date DESC, time DESC
  `;
}

export async function listAllAppointments(): Promise<Appointment[]> {
  return sql<Appointment[]>`SELECT * FROM appointments ORDER BY date DESC, time DESC`;
}

export async function createAppointment(
  input: Omit<Appointment, "id" | "createdAt">
): Promise<Appointment> {
  const rows = await sql<Appointment[]>`
    INSERT INTO appointments (id, patient_id, type, date, time, status, payment_method)
    VALUES (${id()}, ${input.patientId}, ${input.type}, ${input.date}, ${input.time}, ${input.status}, ${input.paymentMethod})
    RETURNING *
  `;
  return rows[0];
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus
): Promise<Appointment | undefined> {
  const rows = await sql<Appointment[]>`
    UPDATE appointments SET status = ${status} WHERE id = ${appointmentId} RETURNING *
  `;
  return rows[0];
}

export async function findAppointmentById(appointmentId: string): Promise<Appointment | undefined> {
  const rows = await sql<Appointment[]>`SELECT * FROM appointments WHERE id = ${appointmentId}`;
  return rows[0];
}

export async function setAppointmentVideoRoom(
  appointmentId: string,
  roomName: string
): Promise<Appointment | undefined> {
  const rows = await sql<Appointment[]>`
    UPDATE appointments SET video_room_name = ${roomName} WHERE id = ${appointmentId} RETURNING *
  `;
  return rows[0];
}

// ---------- Messages ----------

export async function listMessagesForThread(threadUserId: string): Promise<Message[]> {
  return sql<Message[]>`
    SELECT * FROM messages WHERE thread_user_id = ${threadUserId} ORDER BY created_at ASC
  `;
}

export async function listThreadSummaries(): Promise<Record<string, Message[]>> {
  const rows = await sql<Message[]>`SELECT * FROM messages ORDER BY created_at ASC`;
  const byThread: Record<string, Message[]> = {};
  for (const m of rows) {
    if (!byThread[m.threadUserId]) byThread[m.threadUserId] = [];
    byThread[m.threadUserId].push(m);
  }
  return byThread;
}

export async function createMessage(input: Omit<Message, "id" | "createdAt">): Promise<Message> {
  const rows = await sql<Message[]>`
    INSERT INTO messages (id, thread_user_id, from_role, author_id, text)
    VALUES (${id()}, ${input.threadUserId}, ${input.fromRole}, ${input.authorId}, ${input.text})
    RETURNING *
  `;
  return rows[0];
}

// ---------- Insurance ----------

export async function getInsuranceForPatient(patientId: string): Promise<InsuranceInfo | undefined> {
  const rows = await sql<InsuranceInfo[]>`
    SELECT * FROM insurance_info WHERE patient_id = ${patientId}
  `;
  return rows[0];
}

export async function listAllInsurance(): Promise<InsuranceInfo[]> {
  return sql<InsuranceInfo[]>`SELECT * FROM insurance_info`;
}

export async function upsertInsurance(
  patientId: string,
  patch: Partial<Omit<InsuranceInfo, "id" | "patientId">>
): Promise<InsuranceInfo> {
  const existing = await getInsuranceForPatient(patientId);
  if (!existing) {
    const rows = await sql<InsuranceInfo[]>`
      INSERT INTO insurance_info (id, patient_id, company, plan, member_id, group_number, status, card_front_url, card_back_url)
      VALUES (${id()}, ${patientId}, ${patch.company ?? ""}, ${patch.plan ?? null}, ${patch.memberId ?? null}, ${patch.groupNumber ?? null}, ${patch.status ?? "PENDING"}, ${patch.cardFrontUrl ?? null}, ${patch.cardBackUrl ?? null})
      RETURNING *
    `;
    return rows[0];
  }
  const rows = await sql<InsuranceInfo[]>`
    UPDATE insurance_info SET
      company = COALESCE(${patch.company ?? null}, company),
      plan = COALESCE(${patch.plan ?? null}, plan),
      member_id = COALESCE(${patch.memberId ?? null}, member_id),
      group_number = COALESCE(${patch.groupNumber ?? null}, group_number),
      status = COALESCE(${patch.status ?? null}, status),
      card_front_url = COALESCE(${patch.cardFrontUrl ?? null}, card_front_url),
      card_back_url = COALESCE(${patch.cardBackUrl ?? null}, card_back_url),
      updated_at = now()
    WHERE patient_id = ${patientId}
    RETURNING *
  `;
  return rows[0];
}

// ---------- Intake ----------

export async function getIntakeForPatient(patientId: string): Promise<IntakeForm | undefined> {
  const rows = await sql<IntakeForm[]>`
    SELECT * FROM intake_forms WHERE patient_id = ${patientId}
  `;
  return rows[0];
}

export async function upsertIntake(
  patientId: string,
  patch: Partial<Omit<IntakeForm, "id" | "patientId">>
): Promise<IntakeForm> {
  const existing = await getIntakeForPatient(patientId);
  if (!existing) {
    const rows = await sql<IntakeForm[]>`
      INSERT INTO intake_forms (
        id, patient_id, medical_history, behavioral_history, current_medications,
        previous_treatment, emergency_contact_name, emergency_contact_phone, submitted_at
      )
      VALUES (
        ${id()}, ${patientId}, ${patch.medicalHistory ?? null}, ${patch.behavioralHistory ?? null},
        ${patch.currentMedications ?? null}, ${patch.previousTreatment ?? null},
        ${patch.emergencyContactName ?? null}, ${patch.emergencyContactPhone ?? null},
        ${patch.submittedAt ?? null}
      )
      RETURNING *
    `;
    return rows[0];
  }
  const rows = await sql<IntakeForm[]>`
    UPDATE intake_forms SET
      medical_history = COALESCE(${patch.medicalHistory ?? null}, medical_history),
      behavioral_history = COALESCE(${patch.behavioralHistory ?? null}, behavioral_history),
      current_medications = COALESCE(${patch.currentMedications ?? null}, current_medications),
      previous_treatment = COALESCE(${patch.previousTreatment ?? null}, previous_treatment),
      emergency_contact_name = COALESCE(${patch.emergencyContactName ?? null}, emergency_contact_name),
      emergency_contact_phone = COALESCE(${patch.emergencyContactPhone ?? null}, emergency_contact_phone),
      submitted_at = COALESCE(${patch.submittedAt ?? null}, submitted_at)
    WHERE patient_id = ${patientId}
    RETURNING *
  `;
  return rows[0];
}

// ---------- Consent ----------

export async function listConsentsForPatient(patientId: string): Promise<ConsentForm[]> {
  return sql<ConsentForm[]>`SELECT * FROM consent_forms WHERE patient_id = ${patientId}`;
}

export async function upsertConsent(
  patientId: string,
  type: ConsentType,
  signedName: string
): Promise<ConsentForm> {
  const rows = await sql<ConsentForm[]>`
    INSERT INTO consent_forms (id, patient_id, type, signed_name)
    VALUES (${id()}, ${patientId}, ${type}, ${signedName})
    ON CONFLICT (patient_id, type)
    DO UPDATE SET signed_name = ${signedName}, signed_at = now()
    RETURNING *
  `;
  return rows[0];
}

// ---------- Password reset ----------

export interface PasswordResetToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  usedAt: string | null;
  createdAt: string;
}

function randomToken() {
  const bytes = Array.from({ length: 32 }, () => Math.floor(Math.random() * 256));
  return Buffer.from(bytes).toString("base64url");
}

export async function createPasswordResetToken(userId: string): Promise<PasswordResetToken> {
  const token = randomToken();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30).toISOString(); // 30 minutes
  const rows = await sql<PasswordResetToken[]>`
    INSERT INTO password_reset_tokens (id, user_id, token, expires_at)
    VALUES (${id()}, ${userId}, ${token}, ${expiresAt})
    RETURNING *
  `;
  return rows[0];
}

export async function findValidPasswordResetToken(
  token: string
): Promise<PasswordResetToken | undefined> {
  const rows = await sql<PasswordResetToken[]>`
    SELECT * FROM password_reset_tokens
    WHERE token = ${token} AND used_at IS NULL AND expires_at > now()
  `;
  return rows[0];
}

export async function markPasswordResetTokenUsed(tokenId: string): Promise<void> {
  await sql`UPDATE password_reset_tokens SET used_at = now() WHERE id = ${tokenId}`;
}

export async function updateUserPassword(userId: string, passwordHash: string): Promise<void> {
  await sql`UPDATE users SET password_hash = ${passwordHash} WHERE id = ${userId}`;
}

// ---------- Account deletion (used for retiring demo/test accounts) ----------

/**
 * Permanently deletes a patient and every record that references them
 * (messages, appointments, insurance, intake, consents, reset tokens).
 * Deletes child records first to satisfy foreign key constraints.
 * Only ever deletes users with role = 'PATIENT' — will not touch a
 * provider account, even if called with one by mistake.
 */
export async function deletePatientCompletely(patientId: string): Promise<{ deleted: boolean; name?: string }> {
  const user = await findUserById(patientId);
  if (!user || user.role !== "PATIENT") {
    return { deleted: false };
  }

  await sql`DELETE FROM messages WHERE thread_user_id = ${patientId} OR author_id = ${patientId}`;
  await sql`DELETE FROM appointments WHERE patient_id = ${patientId}`;
  await sql`DELETE FROM insurance_info WHERE patient_id = ${patientId}`;
  await sql`DELETE FROM intake_forms WHERE patient_id = ${patientId}`;
  await sql`DELETE FROM consent_forms WHERE patient_id = ${patientId}`;
  await sql`DELETE FROM password_reset_tokens WHERE user_id = ${patientId}`;
  await sql`DELETE FROM users WHERE id = ${patientId}`;

  return { deleted: true, name: user.name };
}

// ---------- Availability (real, enforced weekly office hours) ----------

export interface AvailabilityRule {
  id: string;
  dayOfWeek: number; // 0 = Sunday ... 6 = Saturday
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  enabled: boolean;
}

export async function getAvailabilityRules(): Promise<AvailabilityRule[]> {
  const rows = await sql<AvailabilityRule[]>`
    SELECT * FROM availability_rules ORDER BY day_of_week ASC
  `;
  return rows;
}

export async function setAvailabilityRule(
  dayOfWeek: number,
  patch: { startTime: string; endTime: string; enabled: boolean }
): Promise<AvailabilityRule> {
  const rows = await sql<AvailabilityRule[]>`
    INSERT INTO availability_rules (id, day_of_week, start_time, end_time, enabled)
    VALUES (${id()}, ${dayOfWeek}, ${patch.startTime}, ${patch.endTime}, ${patch.enabled})
    ON CONFLICT (day_of_week)
    DO UPDATE SET start_time = ${patch.startTime}, end_time = ${patch.endTime}, enabled = ${patch.enabled}
    RETURNING *
  `;
  return rows[0];
}

export async function listAppointmentsForDate(date: string): Promise<Appointment[]> {
  return sql<Appointment[]>`
    SELECT * FROM appointments
    WHERE date = ${date} AND status IN ('REQUESTED', 'CONFIRMED')
  `;
}

// ---------- Schedule blocks (one-off blocked time, e.g. vacation) ----------

export interface ScheduleBlock {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string | null;
  createdAt: string;
}

export async function listScheduleBlocksForDate(date: string): Promise<ScheduleBlock[]> {
  return sql<ScheduleBlock[]>`SELECT * FROM schedule_blocks WHERE date = ${date}`;
}

export async function listUpcomingScheduleBlocks(): Promise<ScheduleBlock[]> {
  const today = new Date().toISOString().slice(0, 10);
  return sql<ScheduleBlock[]>`
    SELECT * FROM schedule_blocks WHERE date >= ${today} ORDER BY date ASC, start_time ASC
  `;
}

export async function createScheduleBlock(input: {
  date: string;
  startTime: string;
  endTime: string;
  reason?: string;
}): Promise<ScheduleBlock> {
  const rows = await sql<ScheduleBlock[]>`
    INSERT INTO schedule_blocks (id, date, start_time, end_time, reason)
    VALUES (${id()}, ${input.date}, ${input.startTime}, ${input.endTime}, ${input.reason ?? null})
    RETURNING *
  `;
  return rows[0];
}

export async function deleteScheduleBlock(blockId: string): Promise<void> {
  await sql`DELETE FROM schedule_blocks WHERE id = ${blockId}`;
}
