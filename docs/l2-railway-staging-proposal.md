# L2 Railway staging proposal

This document is a proposal only. It does not provision Railway resources or authorize production changes.

## Isolation

- Create a separate Railway environment named `l2-staging` from the reviewed L2 branch.
- Use a separate application service, one worker service and one PostgreSQL service.
- Do not attach the production domain, production volumes, production database or customer data.
- Use one replica per service.
- Keep the Security Batch 2A Node 22 branch and staging environment separate.
- Use the current production-compatible Node runtime for L2 staging until the framework/runtime migration is independently approved.

## Services

1. **Web application**
   - Build: `npm ci && npm run build`
   - Start: `npm run start`
   - `ENQUIRY_STORAGE_MODE=outbox`
   - Private `DATABASE_URL` for a login that is a member of `apex_web_runtime` only.
   - Startup verifies that the reviewed schema is present. It does not run migrations.
2. **Delivery worker**
   - Same reviewed source revision.
   - Start: `npm run enquiry:worker`
   - One replica only for the first observation period.
   - Private `DATABASE_URL` for a separate login that is a member of `apex_worker_runtime` only.
   - Startup verifies that the reviewed schema is present. It does not run migrations.
   - Create this service only after a staging-scoped SMTP or Resend credential and safe test recipient are approved. The worker exits before polling when neither provider is configured.
3. **PostgreSQL**
   - Private networking only; do not add a public TCP proxy.
   - Scheduled backups enabled before validation.
   - PITR evaluated for production after owner RPO/RTO decisions.
4. **One-shot migration job**
   - Start command: `npm run db:migrate`.
   - Uses a migration-only database login that owns the staging schema.
   - Run explicitly before the web or worker service is enabled and again only for reviewed migrations.
   - Stop the job after a successful exit; never put its credential on the web or worker services.

The reviewed migration creates two `NOLOGIN` group roles. During staging provisioning, create distinct random login roles, grant one group role to each, and place each private connection string only on its corresponding service. Native PostgreSQL tests confirm both runtime roles can perform their intended DML and receive PostgreSQL `42501` for `CREATE TABLE`, `ALTER TABLE` and `DROP TABLE`.

## Environment-variable boundary

Set only staging-scoped values. Use three different private URLs rather than a shared administrative URL:

- Web `DATABASE_URL`: staging web runtime login
- Worker `DATABASE_URL`: staging worker runtime login
- Migration job `DATABASE_URL`: staging migration owner login
- `ENQUIRY_STORAGE_MODE=outbox`
- `DATABASE_POOL_MAX=5`
- `ENQUIRY_WORKER_POLL_MS=1000`
- `QUOTE_PROVIDER_TIMEOUT_MS=5000`
- `STRIPE_CHECKOUT_ENABLED=false`
- `STAGING_NOINDEX=true` on the web service only
- A staging-only email-provider key and a provider-supplied safe test recipient, if approved.

Do not copy production SMTP, Resend, Stripe, webhook, payment-record or customer-data values. With no staging email-provider key, run only the web and PostgreSQL services: enquiries can be recorded and inspected, while the worker remains absent and delivery stays disabled.

## Index and traffic protection

- Use the generated Railway domain only.
- The reviewed app emits `X-Robots-Tag: noindex, nofollow` on every response only when `STAGING_NOINDEX=true`; production behavior is unchanged when the variable is absent.
- Add private or authenticated access as a separate control. `noindex` is not access control.
- Never change production `robots.txt` or canonical URLs for this purpose.

### Proposed staging access list — owner confirmation required

- **Workspace/environment administrator:** the Apex owner account, protected with MFA.
- **Deployment operator:** one named technical maintainer, limited to `l2-staging` if the Railway plan supports environment RBAC.
- **Read-only reviewer (optional):** one named reviewer who needs logs/metrics but cannot edit variables or deploy.
- **Application access:** only the owner and named reviewer through an approved authentication layer; do not share a public staging URL.
- **Database access:** no routine human database users and no public TCP proxy. Emergency access uses Railway's authenticated SSH tunnel and the migration/operations role for a time-bounded session.
- **Excluded:** sales inbox users, customers, anonymous visitors, production services and general automation tokens.

The owner must confirm the named people, whether the workspace plan supports environment-level RBAC, and the authentication method for the generated web URL before provisioning.

## Region decision

- **US option:** place web, worker and PostgreSQL in Railway US West to match the current application and minimize network complexity.
- **Canadian-data option:** Railway currently does not list a Canadian deployment region. Evaluate a Canadian managed PostgreSQL provider and its private-connectivity, backup, DPA and latency implications before provisioning.

Do not split the web service and database across countries without measuring latency and documenting cross-border processing.

## Validation plan

1. Apply migrations to the empty staging database.
2. Submit only synthetic, non-personal test records.
3. Confirm one enquiry and one outbox job commit atomically.
4. Simulate provider rejection, timeout and service restart.
5. Confirm SMTP-style interrupted leases become `uncertain` rather than being resent.
6. Confirm idempotent-provider leases are safely reclaimed with the same idempotency key.
7. Confirm no artwork bytes appear in PostgreSQL.
8. Confirm duplicate browser submissions return the original correlation ID.
9. Verify privacy-safe logs and the restricted operations report.
10. Test backup restoration into an isolated staging service.
11. Run the complete application regression suite and compare routes, sitemap, metadata and forms.

Local pre-staging evidence uses PostgreSQL 17 and synthetic `.invalid` identities. Provider outcomes are injected as test functions only; there is no runtime environment variable or production endpoint that enables a mock email provider.

## Cost, observation and cleanup

Railway publishes usage rates of **$10/GB-month RAM**, **$20/vCPU-month**, **$0.15/GB-month volume storage**, and **$0.05/GB egress**. Service builds are currently free. Backups are incremental and billed at the volume-storage rate for their exclusive changed data. These are usage rates, not a fixed quote; the existing workspace plan and included usage still apply.

Proposed caps and conservative full-allocation ceilings:

- Web: 0.5 GB RAM / 0.5 vCPU — up to about **$15/month** if fully allocated continuously.
- PostgreSQL: 1 GB RAM / 0.5 vCPU plus 1 GB volume — up to about **$20.15/month** continuously, excluding backup deltas.
- Worker: initially disabled. When approved, 0.25 GB RAM / 0.25 vCPU — up to about **$7.50/month** continuously.
- Builds: **$0** under the published build pricing.
- Backup storage: **$0.15/GB-month of incremental data**; a synthetic staging database should be only a small fraction of a GB, but the actual snapshot delta must be measured.

For a **72-hour web + database observation** at the full caps, the theoretical ceiling is approximately **$3.52**, plus negligible synthetic storage/backup and egress. Four worker-hours at its cap add approximately **$0.04**. Real usage is metered and should be read from Railway after the observation; idle services may still consume RAM and CPU.

Observation plan:

1. Keep the worker disabled while migrations, web recording, restart recovery and backup restoration are verified.
2. Observe web + database for 24 hours, inspect CPU/RAM/connections and error logs, then obtain owner approval for the provider sandbox.
3. If approved, enable one worker for a bounded 4-hour synthetic-delivery window.
4. Complete the total staging window within 72 hours unless a defect requires an explicitly approved extension.

Cleanup: export the non-sensitive verification report, stop web/worker, delete the staging environment and its synthetic database/volume/backups, revoke staging provider credentials, and confirm no generated domain, TCP proxy, variable reference or service remains. Do not delete or alter the independent Security Batch 2A staging resources.
