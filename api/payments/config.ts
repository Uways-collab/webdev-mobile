import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPaystackPublicKey, getPaystackSecretKey } from '../_lib/paystack.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} Not Allowed. Use GET.`,
    });
  }

  const publicKey = getPaystackPublicKey();
  const hasSecretKey = Boolean(getPaystackSecretKey());

  return res.status(200).json({
    success: true,
    hasSecretKey,
    publicKey,
    mode: publicKey.startsWith('pk_live_') ? 'live' : 'test',
  });
}
