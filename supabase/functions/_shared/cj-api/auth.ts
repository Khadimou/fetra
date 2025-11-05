/**
 * CJ Dropshipping Authentication Module
 * Handles token generation using API key (not OAuth2)
 * Documentation: https://developers.cjdropshipping.cn/en/api/api2/api/auth.html
 */

import { CJAuthTokenResponse, CJTokenCache } from './types.ts';

const TOKEN_URL = 'https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken';

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
  
  // Try to get API key directly first, then fall back to client_id + client_secret combination
  let apiKey = Deno.env.get('CJ_API_KEY');
  
  // If no direct API key, try to construct it from CLIENT_ID and CLIENT_SECRET
  if (!apiKey) {
    const clientId = Deno.env.get('CJ_CLIENT_ID');
    const clientSecret = Deno.env.get('CJ_CLIENT_SECRET');
    
    if (clientId && clientSecret) {
      // Construct API key in format: CLIENT_ID@api@CLIENT_SECRET
      apiKey = `${clientId}@api@${clientSecret}`;
    }
  }

  if (!apiKey) {
    throw new Error('CJ_API_KEY or (CJ_CLIENT_ID and CJ_CLIENT_SECRET) must be set in environment variables');
  }

  try {
    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: apiKey,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get CJ access token: ${response.status} ${errorText}`);
    }

    const data: CJAuthTokenResponse = await response.json();

    // Check if the response indicates an error
    if (data.result === false || data.code !== 200) {
      const errorMessage = data.message || 'Unknown error';
      throw new Error(`CJ API error: ${errorMessage}`);
    }

    // Extract access token (priority: data.accessToken > data.data.accessToken > data.access_token)
    const accessToken = data.data?.accessToken || data.data?.access_token || data.access_token;
    const expiresIn = data.data?.expires_in || data.expires_in || 3600; // Default 1 hour

    if (!accessToken) {
      throw new Error('CJ API error: No access token in response');
    }

    // Calculate expiry time from accessTokenExpiryDate if available, otherwise use expiresIn
    let expiresAt: number;
    if (data.data?.accessTokenExpiryDate) {
      // Parse the expiry date (format: "2025-11-20T21:06:24+08:00")
      const expiryDate = new Date(data.data.accessTokenExpiryDate);
      expiresAt = expiryDate.getTime() - (5 * 60 * 1000); // 5 minute buffer
    } else {
      // Cache the token with 5-minute buffer before expiry
      const bufferSeconds = 300; // 5 minutes
      expiresAt = Date.now() + (expiresIn - bufferSeconds) * 1000;
    }

    tokenCache = {
      accessToken: accessToken,
      expiresAt,
    };

    console.log(`CJ access token obtained, expires in ${expiresIn} seconds`);
    return accessToken;
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
