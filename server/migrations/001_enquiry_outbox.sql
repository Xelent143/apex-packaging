CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY,
  submission_key text UNIQUE,
  source text NOT NULL,
  status text NOT NULL DEFAULT 'recorded'
    CHECK (status IN (
      'recorded', 'delivery_pending', 'provider_accepted', 'delivery_uncertain',
      'delivery_failed', 'delivered', 'delivery_delayed', 'bounced', 'resolved', 'deleted'
    )),
  fields jsonb NOT NULL,
  file_metadata jsonb NOT NULL DEFAULT '[]'::jsonb,
  artwork_status text NOT NULL DEFAULT 'none'
    CHECK (artwork_status IN ('none', 'omitted', 'received_ephemeral', 'provider_accepted', 'delivery_unconfirmed')),
  retention_due_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS delivery_jobs (
  id uuid PRIMARY KEY,
  enquiry_id uuid NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
  purpose text NOT NULL DEFAULT 'sales_notification',
  provider text NOT NULL,
  state text NOT NULL DEFAULT 'pending'
    CHECK (state IN ('pending', 'leased', 'retry', 'provider_accepted', 'uncertain', 'failed', 'cancelled')),
  email_payload jsonb,
  idempotency_key text NOT NULL UNIQUE,
  payload_version integer NOT NULL DEFAULT 1,
  attempt_count integer NOT NULL DEFAULT 0,
  max_attempts integer NOT NULL DEFAULT 5,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  lease_owner text,
  lease_until timestamptz,
  last_error_class text,
  last_error_code text,
  provider_message_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (enquiry_id, purpose)
);

CREATE INDEX IF NOT EXISTS delivery_jobs_available_idx
  ON delivery_jobs (next_attempt_at, created_at)
  WHERE state IN ('pending', 'retry', 'leased');

CREATE TABLE IF NOT EXISTS delivery_attempts (
  id uuid PRIMARY KEY,
  delivery_job_id uuid NOT NULL REFERENCES delivery_jobs(id) ON DELETE CASCADE,
  attempt_number integer NOT NULL,
  provider text NOT NULL,
  outcome text NOT NULL,
  error_class text,
  error_code text,
  provider_message_id text,
  started_at timestamptz NOT NULL,
  finished_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (delivery_job_id, attempt_number)
);

CREATE TABLE IF NOT EXISTS provider_events (
  id uuid PRIMARY KEY,
  provider text NOT NULL,
  provider_event_id text NOT NULL UNIQUE,
  provider_message_id text,
  event_type text NOT NULL,
  occurred_at timestamptz,
  received_at timestamptz NOT NULL DEFAULT now(),
  payload_hash text
);
