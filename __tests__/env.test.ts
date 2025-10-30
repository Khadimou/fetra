import { describe, it, expect } from 'vitest';

describe('Telemetry env', () => {
  it('ga id is set in CI if required', () => {
    // allow missing locally
    if (process.env.CI) {
      expect(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID).toBeDefined();
    } else {
      expect(true).toBe(true);
    }
  });
});


