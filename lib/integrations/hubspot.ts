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
    const accessToken = process.env.HUBSPOT_ACCESS_TOKEN;

    if (!accessToken) {
      throw new Error('HUBSPOT_ACCESS_TOKEN not configured');
    }

    // HubSpot API v3 - Create or update contact
    const endpoint = `https://api.hubapi.com/crm/v3/objects/contacts`;

    // First, try to find the contact by email
    const searchEndpoint = `https://api.hubapi.com/crm/v3/objects/contacts/search`;
    const searchBody = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: 'email',
              operator: 'EQ',
              value: email
            }
          ]
        }
      ]
    };

    let contactId: string | null = null;

    try {
      const searchRes = await fetch(searchEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(searchBody)
      });

      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (searchData.results && searchData.results.length > 0) {
          contactId = searchData.results[0].id;
        }
      }
    } catch (err) {
      // Contact not found, will create new
    }

    // Transform props to HubSpot v3 format
    const properties: Record<string, string> = {};
    Object.entries(props).forEach(([key, value]) => {
      properties[key] = String(value);
    });

    if (contactId) {
      // Update existing contact
      const updateEndpoint = `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`;
      const res = await fetch(updateEndpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ properties })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HubSpot API error (${res.status}): ${errorText}`);
      }

      return res.json();
    } else {
      // Create new contact
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ properties })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HubSpot API error (${res.status}): ${errorText}`);
      }

      return res.json();
    }
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
  const accessToken = process.env.HUBSPOT_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error('HUBSPOT_ACCESS_TOKEN not configured');
  }

  const endpoint = `https://api.hubapi.com/events/v3/send`;

  const body = {
    email,
    eventName,
    properties: properties || {}
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HubSpot event tracking error: ${errorText}`);
  }

  return res.json();
}

