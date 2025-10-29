import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../app/api/webhooks/stripe/route';

// Mock dependencies
vi.mock('../../../../lib/integrations/hubspot', () => ({
  upsertContactHubspot: vi.fn().mockResolvedValue({ success: true })
}));

vi.mock('../../../../lib/integrations/brevo', () => ({
  addContactBrevo: vi.fn().mockResolvedValue({ success: true })
}));

vi.mock('../../../../lib/db/orders', () => ({
  saveOrder: vi.fn().mockReturnValue(true)
}));

describe('Stripe Webhook API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 for invalid JSON payload', async () => {
    const request = new Request('http://localhost/api/webhooks/stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid json'
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toBeDefined();
  });

  it('should return 200 for valid checkout.session.completed event', async () => {
    const validEvent = {
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_123',
          customer_email: 'test@example.com',
          customer_details: {
            email: 'test@example.com',
            name: 'Test User'
          },
          amount_total: 4990,
          currency: 'eur',
          payment_status: 'paid'
        }
      }
    };

    const request = new Request('http://localhost/api/webhooks/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'dummy-signature'
      },
      body: JSON.stringify(validEvent)
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.received).toBe(true);
  });

  it('should handle events without customer email', async () => {
    const eventWithoutEmail = {
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_456',
          amount_total: 4990,
          currency: 'eur',
          payment_status: 'paid'
        }
      }
    };

    const request = new Request('http://localhost/api/webhooks/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'dummy-signature'
      },
      body: JSON.stringify(eventWithoutEmail)
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.received).toBe(true);
  });

  it('should return 200 for payment_intent.succeeded event', async () => {
    const validEvent = {
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_test_123',
          amount: 4990,
          currency: 'eur'
        }
      }
    };

    const request = new Request('http://localhost/api/webhooks/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'dummy-signature'
      },
      body: JSON.stringify(validEvent)
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.received).toBe(true);
  });

  it('should handle unknown event types gracefully', async () => {
    const unknownEvent = {
      type: 'unknown.event.type',
      data: {
        object: {}
      }
    };

    const request = new Request('http://localhost/api/webhooks/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'dummy-signature'
      },
      body: JSON.stringify(unknownEvent)
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.received).toBe(true);
  });
});

