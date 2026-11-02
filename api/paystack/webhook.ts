import type { VercelRequest, VercelResponse } from '@vercel/node';
import handler from '../payments/webhook.js';

export default async function paystackWebhookHandler(req: VercelRequest, res: VercelResponse) {
  return handler(req, res);
}
