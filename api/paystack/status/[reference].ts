import type { VercelRequest, VercelResponse } from '@vercel/node';
import handler from '../../payments/status/[reference].js';

export default async function paystackStatusDynamicHandler(req: VercelRequest, res: VercelResponse) {
  return handler(req, res);
}
