import type { VercelRequest, VercelResponse } from '@vercel/node';
import handler from '../../payments/verify/[reference].js';

export default async function paystackVerifyDynamicHandler(req: VercelRequest, res: VercelResponse) {
  return handler(req, res);
}
