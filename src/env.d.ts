/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly SITE_URL?: string;
  readonly STRIPE_SECRET_KEY?: string;
  readonly STRIPE_WEBHOOK_SECRET?: string;
  readonly PRIVATE_PAYMENT_RECORDS_DIR?: string;
  readonly SMTP_HOST?: string;
  readonly SMTP_PORT?: string;
  readonly SMTP_USER?: string;
  readonly SMTP_PASS?: string;
  readonly SMTP_FROM?: string;
  readonly QUOTE_FROM_EMAIL?: string;
  readonly RESEND_API_KEY?: string;
  readonly RESEND_FROM?: string;
  readonly PUBLIC_TAWK_TO_WIDGET_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
