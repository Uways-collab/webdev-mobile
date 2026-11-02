import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializePayment } from '../_lib/paystack.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set JSON headers explicitly
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} Not Allowed. Use POST.`,
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const result = await initializePayment({
      email: body.email,
      name: body.name || body.fullName,
      phone: body.phone,
      callbackUrl: body.callbackUrl,
    });

    return res.status(result.status).json(result.body);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error initializing payment.',
    });
  }
}
