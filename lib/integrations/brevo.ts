/**
 * Brevo (Sendinblue) integration utilities
 * Provides functions to interact with Brevo API for email marketing
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
        console.log(`Brevo retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}

export async function addContactBrevo(
  email: string,
  attributes?: Record<string, any>
): Promise<any> {
  return retryWithBackoff(async () => {
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
      throw new Error(`Brevo API error (${res.status}): ${errorText}`);
    }

    return res.json();
  });
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
  params?: Record<string, any>,
  toName?: string
): Promise<any> {
  return retryWithBackoff(async () => {
    const apiKey = process.env.BREVO_API_KEY;
    const apiBase = process.env.BREVO_API_BASE || 'https://api.brevo.com';
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'contact@fetrabeauty.com';
    const senderName = process.env.BREVO_SENDER_NAME || 'FETRA BEAUTY';

    if (!apiKey) {
      throw new Error('BREVO_API_KEY not configured');
    }

    const endpoint = `${apiBase}/v3/smtp/email`;

    const payload = {
      to: [{ email: to, name: toName }],
      sender: { email: senderEmail, name: senderName },
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
      throw new Error(`Brevo email send error (${res.status}): ${errorText}`);
    }

    return res.json();
  });
}

/**
 * Send custom email with HTML content (no template)
 */
export async function sendCustomEmail(
  to: string,
  subject: string,
  htmlContent: string,
  textContent?: string,
  toName?: string
): Promise<any> {
  return retryWithBackoff(async () => {
    const apiKey = process.env.BREVO_API_KEY;
    const apiBase = process.env.BREVO_API_BASE || 'https://api.brevo.com';
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'contact@fetrabeauty.com';
    const senderName = process.env.BREVO_SENDER_NAME || 'FETRA BEAUTY';

    if (!apiKey) {
      throw new Error('BREVO_API_KEY not configured');
    }

    const endpoint = `${apiBase}/v3/smtp/email`;

    const payload = {
      to: [{ email: to, name: toName }],
      sender: { email: senderEmail, name: senderName },
      subject,
      htmlContent,
      textContent
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
      throw new Error(`Brevo email send error (${res.status}): ${errorText}`);
    }

    return res.json();
  });
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(
  customerEmail: string,
  customerName: string,
  orderData: {
    orderNumber: string;
    orderDate: string;
    orderTotal: string;
    currency: string;
  }
): Promise<any> {
  const templateId = Number(process.env.BREVO_TEMPLATE_ORDER_CONFIRM);
  
  if (!templateId) {
    throw new Error('BREVO_TEMPLATE_ORDER_CONFIRM not configured');
  }

  const firstName = customerName.split(' ')[0] || customerName || 'Client';

  return sendTransactionalEmail(
    customerEmail,
    templateId,
    {
      FIRSTNAME: firstName,
      ORDERNUMBER: orderData.orderNumber,
      ORDERDATE: orderData.orderDate,
      ORDERTOTAL: orderData.orderTotal,
      CURRENCY: orderData.currency
    },
    customerName
  );
}

/**
 * Send newsletter welcome email with promo code
 */
export async function sendNewsletterWelcomeEmail(
  email: string,
  promoCode?: string
): Promise<any> {
  const templateId = Number(process.env.BREVO_TEMPLATE_NEWSLETTER_WELCOME);

  if (!templateId) {
    console.warn('BREVO_TEMPLATE_NEWSLETTER_WELCOME not configured - skipping welcome email');
    return null;
  }

  return sendTransactionalEmail(
    email,
    templateId,
    {
      EMAIL: email,
      PROMO_CODE: promoCode || 'BIENVENUE10', // Fallback to generic code
      HAS_PROMO: promoCode ? 'true' : 'false'
    }
  );
}

/**
 * Send shipping confirmation email
 */
export async function sendShippingConfirmationEmail(
  customerEmail: string,
  customerName: string,
  orderData: {
    orderNumber: string;
    trackingUrl: string;
  }
): Promise<any> {
  const templateId = Number(process.env.BREVO_TEMPLATE_SHIPPED);
  
  if (!templateId) {
    throw new Error('BREVO_TEMPLATE_SHIPPED not configured');
  }

  const firstName = customerName.split(' ')[0] || customerName || 'Client';

  return sendTransactionalEmail(
    customerEmail,
    templateId,
    {
      FIRSTNAME: firstName,
      ORDERNUMBER: orderData.orderNumber,
      TRACKINGURL: orderData.trackingUrl
    },
    customerName
  );
}

