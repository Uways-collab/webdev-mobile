import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPaymentStatus } from '../_lib/paystack.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} Not Allowed. Use GET.`,
    });
  }

  try {
    const reference = (req.query.reference as string) || (req.query.trxref as string);
    if (!reference) {
      return res.status(400).json({
        success: false,
        error: 'Missing transaction reference.',
      });
    }

    const result = await getPaymentStatus(reference);
    return res.status(result.status).json(result.body);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error checking payment status.',
    });
  }
}
