import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handlePaystackWebhook } from '../_lib/paystack.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} Not Allowed. Use POST.`,
    });
  }

  try {
    const signature = req.headers['x-paystack-signature'] as string | undefined;
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
    const parsedBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const result = handlePaystackWebhook(rawBody, signature, parsedBody);
    return res.status(result.status).json(result.body);
  } catch (error: any) {
    return res.status(500).json({
      error: error.message || 'Error processing webhook.',
    });
  }
}
