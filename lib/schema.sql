-- WellSide Behavioral Health — database schema
-- Run this once against your Postgres database before first use.
-- (scripts/migrate.ts runs this automatically.)

CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('PATIENT', 'PROVIDER')),
  name          TEXT NOT NULL,
  phone         TEXT,
  dob           TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appointments (
  id             TEXT PRIMARY KEY,
  patient_id     TEXT NOT NULL REFERENCES users(id),
  type           TEXT NOT NULL,
  date           TEXT NOT NULL,
  time           TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'REQUESTED'
                   CHECK (status IN ('REQUESTED','CONFIRMED','COMPLETED','CANCELLED')),
  payment_method TEXT NOT NULL DEFAULT 'SELF_PAY'
                   CHECK (payment_method IN ('INSURANCE','SELF_PAY')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id             TEXT PRIMARY KEY,
  thread_user_id TEXT NOT NULL REFERENCES users(id),
  from_role      TEXT NOT NULL CHECK (from_role IN ('PATIENT','PROVIDER')),
  author_id      TEXT NOT NULL REFERENCES users(id),
  text           TEXT NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS insurance_info (
  id           TEXT PRIMARY KEY,
  patient_id   TEXT UNIQUE NOT NULL REFERENCES users(id),
  company      TEXT NOT NULL,
  plan         TEXT,
  member_id    TEXT,
  group_number TEXT,
  status       TEXT NOT NULL DEFAULT 'PENDING'
                 CHECK (status IN ('PENDING','VERIFIED','REJECTED','MANUAL_REVIEW')),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS intake_forms (
  id                       TEXT PRIMARY KEY,
  patient_id               TEXT UNIQUE NOT NULL REFERENCES users(id),
  medical_history          TEXT,
  behavioral_history       TEXT,
  current_medications      TEXT,
  previous_treatment       TEXT,
  emergency_contact_name   TEXT,
  emergency_contact_phone  TEXT,
  submitted_at             TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS consent_forms (
  id          TEXT PRIMARY KEY,
  patient_id  TEXT NOT NULL REFERENCES users(id),
  type        TEXT NOT NULL CHECK (type IN ('HIPAA','TELEHEALTH','FINANCIAL')),
  signed_name TEXT NOT NULL,
  signed_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (patient_id, type)
);

CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_messages_thread ON messages(thread_user_id);
