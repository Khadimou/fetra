import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../app/api/newsletter/route';

// Mock fetch globally
global.fetch = vi.fn();

describe('Newsletter API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should reject missing email', async () => {
    const request = new Request('http://localhost/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toBeDefined();
    expect(json.error).toContain('invalide');
  });

  it('should reject invalid email format', async () => {
    const request = new Request('http://localhost/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'invalid-email' })
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toBeDefined();
  });

  it('should return error when BREVO_API_KEY is not configured', async () => {
    // Temporarily remove the API key
    const originalKey = process.env.BREVO_API_KEY;
    delete process.env.BREVO_API_KEY;

    const request = new Request('http://localhost/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' })
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.error).toContain('non configuré');

    // Restore the API key
    if (originalKey) process.env.BREVO_API_KEY = originalKey;
  });

  it('should accept valid email format', async () => {
    // Mock successful Brevo API response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1 })
    });

    // Set a dummy API key for testing
    process.env.BREVO_API_KEY = 'test-key';

    const request = new Request('http://localhost/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' })
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.ok).toBe(true);
  });
});

