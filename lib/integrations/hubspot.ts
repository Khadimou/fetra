/**
 * HubSpot integration utilities
 * Provides functions to interact with HubSpot CRM API
 */

/**
 * Retry helper function with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      if (error.message && error.message.includes('400')) {
        throw error;
      }

      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}

export async function upsertContactHubspot(
  email: string,
  props: Record<string, string | number>
): Promise<any> {
  return retryWithBackoff(async () => {
    const apiKey = process.env.HUBSPOT_API_KEY;
    const apiBase = process.env.HUBSPOT_API_BASE || 'https://api.hubapi.com';

    if (!apiKey) {
      throw new Error('HUBSPOT_API_KEY not configured');
    }

    // Transform props to HubSpot format
    const properties = Object.entries(props).map(([property, value]) => ({
      property,
      value: String(value)
    }));

    const body = { properties };

    const endpoint = `${apiBase}/contacts/v1/contact/createOrUpdate/email/${encodeURIComponent(
      email
    )}/?hapikey=${apiKey}`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HubSpot API error (${res.status}): ${errorText}`);
    }

    return res.json();
  });
}

/**
 * Track an event in HubSpot
 */
export async function trackEventHubspot(
  email: string,
  eventName: string,
  properties?: Record<string, any>
): Promise<any> {
  const apiKey = process.env.HUBSPOT_API_KEY;
  const apiBase = process.env.HUBSPOT_API_BASE || 'https://api.hubapi.com';

  if (!apiKey) {
    throw new Error('HUBSPOT_API_KEY not configured');
  }

  const endpoint = `${apiBase}/events/v3/send?hapikey=${apiKey}`;

  const body = {
    email,
    eventName,
    properties: properties || {}
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HubSpot event tracking error: ${errorText}`);
  }

  return res.json();
}

