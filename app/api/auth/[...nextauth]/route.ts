/**
 * NextAuth API Route Handler
 * Handles all NextAuth routes: /api/auth/*
 */

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
