import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const COURSE_TELEGRAM_LINK = "https://t.me/+SMTclxHBnv5jYWNk";
const EXPECTED_AMOUNT_KOBO = 700000; // 7,000 NGN in kobo

// Store verified transactions in-memory to prevent duplicate processing
interface VerifiedRecord {
  reference: string;
  email: string;
  name: string;
  phone?: string;
  amount: number;
  paidAt: string;
  isTestMode?: boolean;
}

const verifiedTransactions = new Map<string, VerifiedRecord>();

// Parse JSON bodies with rawBody capture for webhook verification
app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

// Paystack config route (public key check)
app.get('/api/paystack/config', (_req: Request, res: Response) => {
  const secretKey = process.env.PAYSTACK_SECRET_KEY || '';
  const publicKey = process.env.VITE_PAYSTACK_PUBLIC_KEY || process.env.PAYSTACK_PUBLIC_KEY || '';
  res.json({
    hasSecretKey: Boolean(secretKey && secretKey.trim().length > 0),
    publicKey: publicKey.trim(),
    mode: secretKey.startsWith('sk_live_') ? 'live' : 'test',
  });
});

// Initialize Paystack transaction
app.post('/api/paystack/initialize', async (req: Request, res: Response) => {
  try {
    const { email, name, phone, callbackUrl } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Full name is required.' });
    }

    const reference = `MVC-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    // Real Paystack integration if secret key is present
    if (secretKey && secretKey.trim().length > 0) {
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secretKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          amount: EXPECTED_AMOUNT_KOBO,
          currency: 'NGN',
          reference,
          callback_url: callbackUrl || undefined,
          metadata: {
            custom_fields: [
              { display_name: 'Full Name', variable_name: 'full_name', value: name.trim() },
              { display_name: 'Phone Number', variable_name: 'phone_number', value: phone || 'N/A' },
              { display_name: 'Product', variable_name: 'product', value: 'Mobile Vibe Coding Masterclass' },
            ],
            name: name.trim(),
            phone: phone || '',
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.status) {
        return res.status(400).json({
          success: false,
          error: data.message || 'Failed to initialize Paystack transaction.',
        });
      }

      return res.json({
        success: true,
        reference,
        data: data.data,
      });
    }

    // Fallback sandbox mode when secret key is not yet set in environment
    return res.json({
      success: true,
      sandbox: true,
      reference,
      data: {
        authorization_url: null,
        reference,
      },
      message: 'Running in sandbox readiness mode. Set PAYSTACK_SECRET_KEY in environment to enable live Paystack gateway.',
    });
  } catch (error: any) {
    console.error('Paystack initialization error:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred while initializing payment.',
    });
  }
});

// Verify Paystack transaction (Server-Side)
app.get('/api/paystack/verify/:reference', async (req: Request, res: Response) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({ success: false, error: 'Payment reference is required.' });
    }

    // 1. Check if already verified and cached in memory
    if (verifiedTransactions.has(reference)) {
      const existing = verifiedTransactions.get(reference)!;
      return res.json({
        success: true,
        verified: true,
        reference: existing.reference,
        amount: existing.amount,
        customer: {
          name: existing.name,
          email: existing.email,
        },
        paidAt: existing.paidAt,
        telegramUrl: COURSE_TELEGRAM_LINK,
        isTestMode: existing.isTestMode || false,
      });
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    // 2. Real server-side Paystack verification
    if (secretKey && secretKey.trim().length > 0) {
      const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${secretKey.trim()}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.status) {
        return res.status(400).json({
          success: false,
          verified: false,
          error: result.message || 'Payment verification failed.',
        });
      }

      const txData = result.data;

      // Strict validation: status must be 'success'
      if (txData.status !== 'success') {
        return res.status(400).json({
          success: false,
          verified: false,
          status: txData.status,
          error: `Transaction status is '${txData.status}'. Payment not completed.`,
        });
      }

      // Strict validation: amount must equal ₦7,000 (700,000 kobo)
      if (txData.amount !== EXPECTED_AMOUNT_KOBO) {
        return res.status(400).json({
          success: false,
          verified: false,
          error: `Payment amount (${txData.amount / 100} NGN) does not match required fee of ₦7,000 NGN.`,
        });
      }

      // Strict validation: currency must be NGN
      if (txData.currency !== 'NGN') {
        return res.status(400).json({
          success: false,
          verified: false,
          error: `Invalid currency: expected NGN, received ${txData.currency}.`,
        });
      }

      // Prevent duplicate processing & store record
      const verifiedRecord: VerifiedRecord = {
        reference,
        email: txData.customer?.email || 'Customer',
        name: txData.metadata?.name || txData.customer?.first_name || 'Customer',
        phone: txData.metadata?.phone || txData.customer?.phone || '',
        amount: txData.amount / 100,
        paidAt: txData.paid_at || new Date().toISOString(),
        isTestMode: secretKey.startsWith('sk_test_'),
      };

      verifiedTransactions.set(reference, verifiedRecord);

      return res.json({
        success: true,
        verified: true,
        reference,
        amount: verifiedRecord.amount,
        customer: {
          name: verifiedRecord.name,
          email: verifiedRecord.email,
        },
        paidAt: verifiedRecord.paidAt,
        telegramUrl: COURSE_TELEGRAM_LINK,
        isTestMode: verifiedRecord.isTestMode,
      });
    }

    // 3. Sandbox test verification handler (when environment has no secret key configured yet)
    // Allows testing checkout flow seamlessly during development / testing
    if (reference.startsWith('MVC-SANDBOX-') || reference.startsWith('MVC-')) {
      const testRecord: VerifiedRecord = {
        reference,
        email: (req.query.email as string) || 'student@example.com',
        name: (req.query.name as string) || 'Student',
        amount: 7000,
        paidAt: new Date().toISOString(),
        isTestMode: true,
      };
      verifiedTransactions.set(reference, testRecord);

      return res.json({
        success: true,
        verified: true,
        reference,
        amount: 7000,
        customer: {
          name: testRecord.name,
          email: testRecord.email,
        },
        paidAt: testRecord.paidAt,
        telegramUrl: COURSE_TELEGRAM_LINK,
        isTestMode: true,
        note: 'Verified in developer test sandbox mode.',
      });
    }

    return res.status(404).json({
      success: false,
      verified: false,
      error: 'Transaction reference not found or unverified.',
    });
  } catch (error: any) {
    console.error('Paystack verification error:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred while verifying payment.',
    });
  }
});

// Webhook endpoint with HMAC SHA512 signature verification
app.post('/api/paystack/webhook', (req: any, res: Response) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return res.status(400).send('Webhook secret not configured.');
  }

  const signature = req.headers['x-paystack-signature'];
  if (!signature) {
    return res.status(401).send('Missing signature header.');
  }

  // Validate HMAC SHA512
  const hash = crypto
    .createHmac('sha512', secret)
    .update(req.rawBody || JSON.stringify(req.body))
    .digest('hex');

  if (hash !== signature) {
    return res.status(401).send('Invalid signature.');
  }

  const event = req.body;
  if (event.event === 'charge.success') {
    const data = event.data;
    if (data.amount === EXPECTED_AMOUNT_KOBO && data.currency === 'NGN') {
      verifiedTransactions.set(data.reference, {
        reference: data.reference,
        email: data.customer?.email,
        name: data.metadata?.name || data.customer?.first_name || 'Student',
        phone: data.metadata?.phone,
        amount: data.amount / 100,
        paidAt: data.paid_at || new Date().toISOString(),
      });
    }
  }

  return res.sendStatus(200);
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mobile Vibe Coding server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
