/**
 * Simple admin authentication
 * For production, consider using NextAuth.js or a proper auth solution
 */

/**
 * Admin credentials interface
 */
export interface AdminCredentials {
  email: string;
  password: string;
}

/**
 * Verify admin credentials against environment variables
 * @param email - Admin email
 * @param password - Admin password
 * @returns true if credentials are valid
 */
export function verifyAdminCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error('Admin credentials not configured in environment variables');
    return false;
  }

  return email === adminEmail && password === adminPassword;
}

/**
 * Create admin session token (simple base64 encoding)
 * For production, use JWT or a secure session management system
 */
export function createAdminToken(email: string): string {
  const payload = {
    email,
    role: 'admin',
    createdAt: Date.now()
  };

  // Simple base64 encoding (NOT secure for production!)
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

/**
 * Verify admin token
 * @param token - Admin session token
 * @returns Admin email if valid, null otherwise
 */
export function verifyAdminToken(token: string): string | null {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));

    // Check if token is expired (24 hours)
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in ms
    if (Date.now() - payload.createdAt > maxAge) {
      return null;
    }

    // Verify email matches admin email
    if (payload.email !== process.env.ADMIN_EMAIL) {
      return null;
    }

    return payload.email;
  } catch (error) {
    return null;
  }
}

/**
 * Cookie name for admin session
 */
export const ADMIN_COOKIE_NAME = 'fetra_admin_session';

/**
 * Check if request has valid admin session
 * @param request - Next.js request object
 * @returns true if valid admin session
 */
export function isAdminAuthenticated(request: Request): boolean {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) {
    return false;
  }

  // Parse cookies
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map((cookie) => {
      const [name, value] = cookie.split('=');
      return [name, decodeURIComponent(value)];
    })
  );

  const token = cookies[ADMIN_COOKIE_NAME];
  if (!token) {
    return false;
  }

  return verifyAdminToken(token) !== null;
}

/**
 * Get admin email from request
 * @param request - Next.js request object
 * @returns Admin email or null
 */
export function getAdminFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) {
    return null;
  }

  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map((cookie) => {
      const [name, value] = cookie.split('=');
      return [name, decodeURIComponent(value)];
    })
  );

  const token = cookies[ADMIN_COOKIE_NAME];
  if (!token) {
    return null;
  }

  return verifyAdminToken(token);
}
