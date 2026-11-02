import crypto from 'crypto';

export const COURSE_TELEGRAM_LINK = 'https://t.me/+SMTclxHBnv5jYWNk';
export const EXPECTED_AMOUNT_KOBO = 700000; // ₦7,000 NGN in kobo
export const EXPECTED_CURRENCY = 'NGN';

export interface VerifiedTransactionRecord {
  reference: string;
  email: string;
  name: string;
  phone?: string;
  amount: number;
  currency: string;
  paidAt: string;
  status: string;
  processedAt: string;
}

// In-memory cache of verified transactions to prevent repeated or duplicate processing
const verifiedTransactions = new Map<string, VerifiedTransactionRecord>();

/**
 * Get Paystack Secret Key safely.
 */
export function getPaystackSecretKey(): string | null {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key || key.trim().length === 0) {
    return null;
  }
  return key.trim();
}

/**
 * Get Paystack Public Key safely.
 */
export function getPaystackPublicKey(): string {
  const key = process.env.PAYSTACK_PUBLIC_KEY || process.env.VITE_PAYSTACK_PUBLIC_KEY || '';
  return key.trim();
}

/**
 * Initialize a Paystack transaction.
 */
export async function initializePayment(params: {
  email: string;
  name: string;
  phone?: string;
  callbackUrl?: string;
}) {
  const secretKey = getPaystackSecretKey();
  if (!secretKey) {
    return {
      status: 500,
      body: {
        success: false,
        error: 'PAYSTACK_SECRET_KEY is not configured in Vercel environment variables. Please add PAYSTACK_SECRET_KEY in your Vercel Project Settings > Environment Variables.',
      },
    };
  }

  const { email, name, phone, callbackUrl } = params;

  if (!email || !email.includes('@')) {
    return {
      status: 400,
      body: { success: false, error: 'A valid email address is required.' },
    };
  }

  if (!name || name.trim().length < 2) {
    return {
      status: 400,
      body: { success: false, error: 'Full name is required (at least 2 characters).' },
    };
  }

  const reference = `MVC-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  try {
    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim(),
        amount: EXPECTED_AMOUNT_KOBO,
        currency: EXPECTED_CURRENCY,
        reference,
        callback_url: callbackUrl || undefined,
        metadata: {
          custom_fields: [
            { display_name: 'Full Name', variable_name: 'full_name', value: name.trim() },
            { display_name: 'Phone Number', variable_name: 'phone_number', value: phone || 'N/A' },
            { display_name: 'Product', variable_name: 'product', value: 'Mobile Vibe Coding Masterclass' },
          ],
          name: name.trim(),
          phone: phone || '',
        },
      }),
    });

    const responseText = await paystackRes.text();
    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch {
      return {
        status: 502,
        body: {
          success: false,
          error: 'Paystack API returned an invalid non-JSON response.',
        },
      };
    }

    if (!paystackRes.ok || !data.status) {
      return {
        status: 400,
        body: {
          success: false,
          error: data.message || 'Failed to initialize Paystack transaction.',
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        reference,
        authorization_url: data.data.authorization_url,
        access_code: data.data.access_code,
        data: data.data,
      },
    };
  } catch (error: any) {
    return {
      status: 500,
      body: {
        success: false,
        error: error.message || 'Network error occurred while connecting to Paystack.',
      },
    };
  }
}

/**
 * Verify a Paystack transaction directly with the Paystack API.
 */
export async function verifyPayment(reference: string) {
  if (!reference || reference.trim().length === 0) {
    return {
      status: 400,
      body: { success: false, error: 'Transaction reference is required for verification.' },
    };
  }

  const cleanRef = reference.trim();

  // 1. Check if already processed to prevent duplicate processing
  if (verifiedTransactions.has(cleanRef)) {
    const record = verifiedTransactions.get(cleanRef)!;
    return {
      status: 200,
      body: {
        success: true,
        verified: true,
        reference: record.reference,
        amount: record.amount,
        currency: record.currency,
        customer: {
          name: record.name,
          email: record.email,
        },
        paidAt: record.paidAt,
        telegramUrl: COURSE_TELEGRAM_LINK,
        alreadyProcessed: true,
      },
    };
  }

  const secretKey = getPaystackSecretKey();
  if (!secretKey) {
    return {
      status: 500,
      body: {
        success: false,
        error: 'PAYSTACK_SECRET_KEY is not configured in Vercel environment variables.',
      },
    };
  }

  try {
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(cleanRef)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    });

    const responseText = await paystackRes.text();
    let result: any;
    try {
      result = JSON.parse(responseText);
    } catch {
      return {
        status: 502,
        body: {
          success: false,
          verified: false,
          error: 'Paystack API returned an invalid response during verification.',
        },
      };
    }

    if (!paystackRes.ok || !result.status) {
      return {
        status: 400,
        body: {
          success: false,
          verified: false,
          error: result.message || 'Payment verification failed on Paystack.',
        },
      };
    }

    const txData = result.data;

    // Strict validation: status must be 'success'
    if (txData.status !== 'success') {
      return {
        status: 400,
        body: {
          success: false,
          verified: false,
          status: txData.status,
          error: `Transaction status is '${txData.status}'. Payment has not been completed.`,
        },
      };
    }

    // Strict validation: amount must be exactly ₦7,000 (700,000 kobo)
    if (txData.amount !== EXPECTED_AMOUNT_KOBO) {
      return {
        status: 400,
        body: {
          success: false,
          verified: false,
          error: `Payment amount (${txData.amount / 100} ${txData.currency}) does not match required fee of ₦7,000 NGN.`,
        },
      };
    }

    // Strict validation: currency must be NGN
    if (txData.currency !== EXPECTED_CURRENCY) {
      return {
        status: 400,
        body: {
          success: false,
          verified: false,
          error: `Invalid currency: expected ${EXPECTED_CURRENCY}, received ${txData.currency}.`,
        },
      };
    }

    // Save record to prevent duplicate processing
    const record: VerifiedTransactionRecord = {
      reference: cleanRef,
      email: txData.customer?.email || 'N/A',
      name: txData.metadata?.name || txData.customer?.first_name || 'Student',
      phone: txData.metadata?.phone || txData.customer?.phone || '',
      amount: txData.amount / 100,
      currency: txData.currency,
      paidAt: txData.paid_at || new Date().toISOString(),
      status: txData.status,
      processedAt: new Date().toISOString(),
    };

    verifiedTransactions.set(cleanRef, record);

    return {
      status: 200,
      body: {
        success: true,
        verified: true,
        reference: cleanRef,
        amount: record.amount,
        currency: record.currency,
        customer: {
          name: record.name,
          email: record.email,
        },
        paidAt: record.paidAt,
        telegramUrl: COURSE_TELEGRAM_LINK,
      },
    };
  } catch (error: any) {
    return {
      status: 500,
      body: {
        success: false,
        verified: false,
        error: error.message || 'Network error occurred while verifying payment.',
      },
    };
  }
}

/**
 * Check payment status for a reference.
 */
export async function getPaymentStatus(reference: string) {
  if (!reference) {
    return {
      status: 400,
      body: { success: false, error: 'Payment reference is required.' },
    };
  }

  const cleanRef = reference.trim();
  if (verifiedTransactions.has(cleanRef)) {
    const record = verifiedTransactions.get(cleanRef)!;
    return {
      status: 200,
      body: {
        success: true,
        reference: cleanRef,
        status: record.status,
        verified: true,
        amount: record.amount,
        paidAt: record.paidAt,
        telegramUrl: COURSE_TELEGRAM_LINK,
      },
    };
  }

  // If not in cache, verify through Paystack
  return verifyPayment(cleanRef);
}

/**
 * Handle Paystack Webhook with HMAC SHA512 signature validation.
 */
export function handlePaystackWebhook(rawBody: string | Buffer, signature: string | undefined, parsedBody: any) {
  const secretKey = getPaystackSecretKey();
  if (!secretKey) {
    return { status: 500, body: { error: 'PAYSTACK_SECRET_KEY not configured.' } };
  }

  if (!signature) {
    return { status: 401, body: { error: 'Missing x-paystack-signature header.' } };
  }

  const hash = crypto
    .createHmac('sha512', secretKey)
    .update(rawBody)
    .digest('hex');

  if (hash !== signature) {
    return { status: 401, body: { error: 'Invalid webhook signature.' } };
  }

  if (parsedBody && parsedBody.event === 'charge.success') {
    const data = parsedBody.data;
    if (data && data.amount === EXPECTED_AMOUNT_KOBO && data.currency === EXPECTED_CURRENCY) {
      const ref = data.reference;
      if (ref && !verifiedTransactions.has(ref)) {
        verifiedTransactions.set(ref, {
          reference: ref,
          email: data.customer?.email || 'N/A',
          name: data.metadata?.name || data.customer?.first_name || 'Student',
          phone: data.metadata?.phone || '',
          amount: data.amount / 100,
          currency: data.currency,
          paidAt: data.paid_at || new Date().toISOString(),
          status: 'success',
          processedAt: new Date().toISOString(),
        });
      }
    }
  }

  return { status: 200, body: { status: 'success' } };
}
