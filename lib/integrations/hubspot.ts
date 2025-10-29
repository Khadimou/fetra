/**
 * HubSpot integration utilities
 * Provides functions to interact with HubSpot CRM API
 */

export async function upsertContactHubspot(
  email: string,
  props: Record<string, string | number>
): Promise<any> {
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
    throw new Error(`HubSpot API error: ${errorText}`);
  }

  return res.json();
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

