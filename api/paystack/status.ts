import type { VercelRequest, VercelResponse } from '@vercel/node';
import handler from '../payments/status.js';

export default async function paystackStatusHandler(req: VercelRequest, res: VercelResponse) {
  return handler(req, res);
}
