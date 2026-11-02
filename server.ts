import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  initializePayment,
  verifyPayment,
  getPaymentStatus,
  handlePaystackWebhook,
  getPaystackPublicKey,
  getPaystackSecretKey,
} from './api/_lib/paystack.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Parse JSON bodies with rawBody capture for webhook verification
app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

// Payment configuration endpoint
const handleConfig = (_req: Request, res: Response) => {
  const publicKey = getPaystackPublicKey();
  const hasSecretKey = Boolean(getPaystackSecretKey());
  res.json({
    success: true,
    hasSecretKey,
    publicKey,
    mode: publicKey.startsWith('pk_live_') ? 'live' : 'test',
  });
};
app.get('/api/payments/config', handleConfig);
app.get('/api/paystack/config', handleConfig);

// Initialize payment endpoint
const handleInitialize = async (req: Request, res: Response) => {
  try {
    const { email, name, fullName, phone, callbackUrl } = req.body || {};
    const result = await initializePayment({
      email,
      name: name || fullName,
      phone,
      callbackUrl,
    });
    return res.status(result.status).json(result.body);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Server error initializing payment.',
    });
  }
};
app.post('/api/payments/initialize', handleInitialize);
app.post('/api/paystack/initialize', handleInitialize);

// Verify payment endpoint (supports /:reference path param or ?reference= query param)
const handleVerify = async (req: Request, res: Response) => {
  try {
    const reference = (req.params.reference || req.query.reference || req.query.trxref) as string;
    if (!reference) {
      return res.status(400).json({
        success: false,
        error: 'Missing payment reference for verification.',
      });
    }
    const result = await verifyPayment(reference);
    return res.status(result.status).json(result.body);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Server error verifying payment.',
    });
  }
};
app.get('/api/payments/verify/:reference', handleVerify);
app.get('/api/payments/verify', handleVerify);
app.get('/api/paystack/verify/:reference', handleVerify);
app.get('/api/paystack/verify', handleVerify);

// Payment status endpoint
const handleStatus = async (req: Request, res: Response) => {
  try {
    const reference = (req.params.reference || req.query.reference || req.query.trxref) as string;
    if (!reference) {
      return res.status(400).json({
        success: false,
        error: 'Missing payment reference.',
      });
    }
    const result = await getPaymentStatus(reference);
    return res.status(result.status).json(result.body);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Server error checking payment status.',
    });
  }
};
app.get('/api/payments/status/:reference', handleStatus);
app.get('/api/payments/status', handleStatus);
app.get('/api/paystack/status/:reference', handleStatus);
app.get('/api/paystack/status', handleStatus);

// Webhook endpoint
const handleWebhook = (req: any, res: Response) => {
  const signature = req.headers['x-paystack-signature'];
  const rawBody = req.rawBody || JSON.stringify(req.body);
  const result = handlePaystackWebhook(rawBody, signature, req.body);
  return res.status(result.status).json(result.body);
};
app.post('/api/payments/webhook', handleWebhook);
app.post('/api/paystack/webhook', handleWebhook);

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
