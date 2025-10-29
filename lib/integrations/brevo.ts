/**
 * Brevo (Sendinblue) integration utilities
 * Provides functions to interact with Brevo API for email marketing
 */

export async function addContactBrevo(
  email: string,
  attributes?: Record<string, any>
): Promise<any> {
  const apiKey = process.env.BREVO_API_KEY;
  const apiBase = process.env.BREVO_API_BASE || 'https://api.brevo.com';

  if (!apiKey) {
    throw new Error('BREVO_API_KEY not configured');
  }

  const endpoint = `${apiBase}/v3/contacts`;

  const payload: any = {
    email,
    updateEnabled: true // Update if contact already exists
  };

  if (attributes) {
    payload.attributes = attributes;
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorText = await res.text();
    // Don't throw if contact already exists
    if (res.status === 400 && errorText.includes('already exists')) {
      return { message: 'Contact already exists', updated: true };
    }
    throw new Error(`Brevo API error: ${errorText}`);
  }

  return res.json();
}

/**
 * Add contact to a specific Brevo list
 */
export async function addContactToList(
  email: string,
  listId: number
): Promise<any> {
  const apiKey = process.env.BREVO_API_KEY;
  const apiBase = process.env.BREVO_API_BASE || 'https://api.brevo.com';

  if (!apiKey) {
    throw new Error('BREVO_API_KEY not configured');
  }

  const endpoint = `${apiBase}/v3/contacts`;

  const payload = {
    email,
    listIds: [listId],
    updateEnabled: true
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorText = await res.text();
    if (res.status === 400 && errorText.includes('already exists')) {
      return { message: 'Contact already in list', updated: true };
    }
    throw new Error(`Brevo API error: ${errorText}`);
  }

  return res.json();
}

/**
 * Send a transactional email via Brevo
 */
export async function sendTransactionalEmail(
  to: string,
  templateId: number,
  params?: Record<string, any>
): Promise<any> {
  const apiKey = process.env.BREVO_API_KEY;
  const apiBase = process.env.BREVO_API_BASE || 'https://api.brevo.com';

  if (!apiKey) {
    throw new Error('BREVO_API_KEY not configured');
  }

  const endpoint = `${apiBase}/v3/smtp/email`;

  const payload = {
    to: [{ email: to }],
    templateId,
    params: params || {}
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Brevo email send error: ${errorText}`);
  }

  return res.json();
}

