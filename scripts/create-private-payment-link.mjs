import process from 'node:process';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { createPrivatePaymentLink, formatAmount } from '../server/privatePaymentLinks.mjs';

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printUsage();
  process.exit(0);
}

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is required.');
  process.exit(1);
}

const rl = readline.createInterface({ input, output });

try {
  const quoteNumber = args.quote || await promptRequired(rl, 'Quote / invoice number');
  const customerEmail = args.email || await promptRequired(rl, 'Customer email');
  const amount = args.amount || await promptRequired(rl, 'Approved amount', '2214.00');
  const currency = (args.currency || await promptOptional(rl, 'Currency', 'CAD')).toLowerCase();
  const description = args.description || await promptRequired(rl, 'Order description');
  const customerName = args.name || await promptOptional(rl, 'Customer name');
  const company = args.company || await promptOptional(rl, 'Company');
  const expiresAt = args.expiresAt || await promptOptional(rl, 'Expiration date/time (optional, ISO or local format)');

  const { record, emailTemplate } = await createPrivatePaymentLink({
    quoteNumber,
    customerEmail,
    amount,
    currency,
    description,
    customerName,
    company,
    expiresAt
  }, {
    secretKey: process.env.STRIPE_SECRET_KEY,
    siteUrl: process.env.SITE_URL
  });

  console.log('');
  console.log('Secure payment link created.');
  console.log(`Payment request ID: ${record.paymentRequestId}`);
  console.log(`Quote / invoice: ${record.quoteNumber}`);
  console.log(`Amount: ${formatAmount(record.amountCents, record.currency)}`);
  console.log(`Checkout URL: ${record.checkoutUrl}`);
  if (record.expiresAt) console.log(`Expires at: ${record.expiresAt}`);
  console.log('');
  console.log('Copy-ready customer email:');
  console.log('---');
  console.log(emailTemplate);
  console.log('---');
} catch (error) {
  console.error(error.message || error);
  process.exitCode = 1;
} finally {
  rl.close();
}

function parseArgs(argv) {
  const result = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith('--')) continue;

    const [rawKey, inlineValue] = arg.slice(2).split('=');
    const value = inlineValue ?? argv[index + 1];
    const key = normalizeArgKey(rawKey);

    if (inlineValue == null && value && !value.startsWith('--')) index += 1;
    result[key] = inlineValue ?? (value && !value.startsWith('--') ? value : true);
  }

  return result;
}

function normalizeArgKey(key) {
  return key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

async function promptRequired(rl, label, placeholder = '') {
  while (true) {
    const value = (await promptOptional(rl, label, placeholder)).trim();
    if (value) return value;
    console.log(`${label} is required.`);
  }
}

async function promptOptional(rl, label, placeholder = '') {
  const suffix = placeholder ? ` [${placeholder}]` : '';
  const value = await rl.question(`${label}${suffix}: `);
  return value.trim() || placeholder;
}

function printUsage() {
  console.log(`Usage:

  npm run payment:create-link -- \\
    --quote APS-2026-0048 \\
    --email buyer@example.com \\
    --amount 2214.00 \\
    --currency CAD \\
    --description "Approved quote for soap boxes"

Optional flags:
  --name "Alex Buyer"
  --company "Example Co"
  --expires-at "2026-08-25T17:00:00-04:00"
  --help
`);
}
