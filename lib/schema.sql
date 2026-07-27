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
  video_room_name TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE appointments ADD COLUMN IF NOT EXISTS video_room_name TEXT;

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
  card_front_url TEXT,
  card_back_url  TEXT,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE insurance_info ADD COLUMN IF NOT EXISTS card_front_url TEXT;
ALTER TABLE insurance_info ADD COLUMN IF NOT EXISTS card_back_url TEXT;

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

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id),
  token      TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One row per day of week (0 = Sunday ... 6 = Saturday). Represents
-- Wulaimot's real, enforced weekly office hours.
CREATE TABLE IF NOT EXISTS availability_rules (
  id           TEXT PRIMARY KEY,
  day_of_week  INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time   TEXT NOT NULL,
  end_time     TEXT NOT NULL,
  enabled      BOOLEAN NOT NULL DEFAULT true,
  UNIQUE (day_of_week)
);

-- One-off blocked time ranges (vacation, a personal appointment, a
-- conference, etc.) that override the normal weekly hours for a
-- specific date, independent of any patient appointment.
CREATE TABLE IF NOT EXISTS schedule_blocks (
  id         TEXT PRIMARY KEY,
  date       TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time   TEXT NOT NULL,
  reason     TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_schedule_blocks_date ON schedule_blocks(date);

CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_messages_thread ON messages(thread_user_id);
CREATE INDEX IF NOT EXISTS idx_reset_tokens_token ON password_reset_tokens(token);
