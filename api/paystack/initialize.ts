import type { VercelRequest, VercelResponse } from '@vercel/node';
import handler from '../payments/initialize.js';

export default async function paystackInitializeHandler(req: VercelRequest, res: VercelResponse) {
  return handler(req, res);
}
