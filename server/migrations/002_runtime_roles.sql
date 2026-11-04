DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'apex_web_runtime') THEN
    CREATE ROLE apex_web_runtime NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'apex_worker_runtime') THEN
    CREATE ROLE apex_worker_runtime NOLOGIN;
  END IF;
END
$$;

REVOKE CREATE ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO apex_web_runtime, apex_worker_runtime;

GRANT SELECT ON schema_migrations TO apex_web_runtime, apex_worker_runtime;

GRANT SELECT, INSERT, UPDATE ON enquiries TO apex_web_runtime;
GRANT SELECT, INSERT, UPDATE ON delivery_jobs TO apex_web_runtime;
GRANT SELECT, INSERT ON delivery_attempts TO apex_web_runtime;

GRANT SELECT, UPDATE ON enquiries TO apex_worker_runtime;
GRANT SELECT, UPDATE ON delivery_jobs TO apex_worker_runtime;
GRANT SELECT, INSERT ON delivery_attempts TO apex_worker_runtime;
