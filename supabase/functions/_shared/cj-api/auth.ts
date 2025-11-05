/**
 * CJ Dropshipping OAuth2 Authentication Module
 * Handles token generation, caching, and refresh
 */

import { CJAuthTokenResponse, CJTokenCache } from './types.ts';

const TOKEN_URL = 'https://developers.cjdropshipping.com/api/oauth/token';

// In-memory token cache (resets on cold starts, which is fine for short-lived Edge Functions)
let tokenCache: CJTokenCache | null = null;

/**
 * Get a valid CJ API access token
 * Uses cached token if available and not expired, otherwise requests new token
 */
export async function getCjAccessToken(): Promise<string> {
  // Check if we have a valid cached token
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    console.log('Using cached CJ access token');
    return tokenCache.accessToken;
  }

  // Request new token
  console.log('Requesting new CJ access token');
  const clientId = Deno.env.get('CJ_CLIENT_ID');
  const clientSecret = Deno.env.get('CJ_CLIENT_SECRET');

  if (!clientId || !clientSecret) {
    throw new Error('CJ_CLIENT_ID and CJ_CLIENT_SECRET must be set in environment variables');
  }

  try {
    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get CJ access token: ${response.status} ${errorText}`);
    }

    const data: CJAuthTokenResponse = await response.json();

    // Cache the token with 5-minute buffer before expiry
    const bufferSeconds = 300; // 5 minutes
    const expiresAt = Date.now() + (data.expires_in - bufferSeconds) * 1000;

    tokenCache = {
      accessToken: data.access_token,
      expiresAt,
    };

    console.log(`CJ access token obtained, expires in ${data.expires_in} seconds`);
    return data.access_token;
  } catch (error) {
    console.error('Error getting CJ access token:', error);
    throw error;
  }
}

/**
 * Clear the cached token (useful for testing or forcing refresh)
 */
export function clearTokenCache(): void {
  tokenCache = null;
  console.log('CJ access token cache cleared');
}
