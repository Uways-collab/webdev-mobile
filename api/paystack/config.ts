import type { VercelRequest, VercelResponse } from '@vercel/node';
import handler from '../payments/config.js';

export default async function paystackConfigHandler(req: VercelRequest, res: VercelResponse) {
  return handler(req, res);
}
