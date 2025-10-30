// __tests__/cookies.test.ts
import { describe, it, expect } from 'vitest';
import { defaultConsent } from '@/lib/cookies';

describe('cookies util', () => {
  it('default consent shape', () => {
    const c = defaultConsent();
    expect(c.necessary).toBe(true);
    expect(typeof c.updatedAt).toBe('string');
    expect(c.analytics).toBe(false);
    expect(c.marketing).toBe(false);
  });

  it('has valid ISO timestamp', () => {
    const c = defaultConsent();
    const date = new Date(c.updatedAt);
    expect(date.getTime()).toBeGreaterThan(0);
    expect(c.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it('necessary is always true', () => {
    const c = defaultConsent();
    expect(c.necessary).toBe(true);
    // Should not be changeable in type system
    expect(typeof c.necessary === 'boolean').toBe(true);
  });
});
