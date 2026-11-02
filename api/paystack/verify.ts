import type { VercelRequest, VercelResponse } from '@vercel/node';
import handler from '../payments/verify.js';

export default async function paystackVerifyHandler(req: VercelRequest, res: VercelResponse) {
  return handler(req, res);
}
