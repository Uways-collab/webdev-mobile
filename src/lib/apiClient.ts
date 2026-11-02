/**
 * Safe API request client that handles JSON and non-JSON responses gracefully.
 * Prevents "Unexpected token 'T', 'The page c'... is not valid JSON" errors.
 */

export interface ApiResponse<T = any> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
  isHtmlResponse?: boolean;
}

export async function safeFetchJson<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(input, init);
    const contentType = (res.headers.get('content-type') || '').toLowerCase();

    // Check if the response is valid JSON
    if (contentType.includes('application/json')) {
      try {
        const data = (await res.json()) as T;
        if (!res.ok) {
          const errMessage =
            (data as any)?.error ||
            (data as any)?.message ||
            `Server error (Status ${res.status})`;
          return {
            ok: false,
            status: res.status,
            error: errMessage,
            data,
          };
        }
        return {
          ok: true,
          status: res.status,
          data,
        };
      } catch (parseErr: any) {
        console.error('Failed to parse JSON despite application/json header:', parseErr);
        return {
          ok: false,
          status: res.status,
          error: 'Invalid response format received from payment server.',
        };
      }
    }

    // Response is NOT JSON (e.g. HTML 404/500 from Vercel)
    const rawText = await res.text();
    const isHtml =
      contentType.includes('text/html') ||
      rawText.trim().startsWith('<') ||
      rawText.includes('The page could not be found') ||
      rawText.includes('<!DOCTYPE') ||
      rawText.includes('<!doctype');

    // Log diagnostic message for debugging without leaking any credentials
    console.error(`[API Error] ${input.toString()} returned HTTP ${res.status} with Content-Type: ${contentType || 'unknown'}`);
    if (isHtml) {
      console.warn(`[API Notice] Received HTML error page instead of JSON API response.`);
    }

    let friendlyError = `Payment server responded with status ${res.status}.`;
    if (res.status === 404) {
      friendlyError = 'Payment endpoint not found (404). Please ensure Vercel serverless functions are deployed.';
    } else if (res.status === 405) {
      friendlyError = 'HTTP method not allowed for this payment endpoint.';
    } else if (res.status >= 500) {
      friendlyError = 'Payment gateway server is currently unavailable. Please try again shortly or contact WhatsApp support.';
    }

    return {
      ok: false,
      status: res.status,
      error: friendlyError,
      isHtmlResponse: true,
    };
  } catch (netErr: any) {
    console.error('[Network Error] Failed to connect to payment server:', netErr.message || netErr);
    return {
      ok: false,
      status: 0,
      error: 'Network connection failed. Please check your internet connection and try again.',
    };
  }
}
