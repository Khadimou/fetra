/**
 * NextAuth Configuration
 * Using Prisma Adapter + Credentials Provider + Social OAuth
 */

import { PrismaAdapter } from '@auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';
import bcrypt from 'bcrypt';
import prisma from '@/lib/db/prisma';
import { upsertCustomer } from '@/lib/db/orders';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    // Apple Sign In
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID || '',
      clientSecret: process.env.APPLE_CLIENT_SECRET || '',
    }),
    // User Credentials (customers)
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'admin@fetrabeauty.com' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis');
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error('Identifiants invalides');
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(credentials.password, user.password);

        if (!isValidPassword) {
          throw new Error('Identifiants invalides');
        }

        // Return user object (will be available in session)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        };
      }
    }),
    // Admin Credentials (admins only)
    CredentialsProvider({
      id: 'admin-credentials',
      name: 'Admin Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'admin@fetrabeauty.com' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis');
        }

        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) {
          throw new Error('Identifiants invalides');
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) {
          throw new Error('Identifiants invalides');
        }

        // Enforce admin role here
        if (user.role !== 'ADMIN') {
          throw new Error('Accès administrateur requis');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        };
      }
    })
  ],
  session: {
    strategy: 'jwt', // Use JWT for session (works well with credentials provider)
    maxAge: 24 * 60 * 60 // 24 hours
  },
  pages: {
    // Built-in NextAuth pages
    signIn: '/login',
    error: '/auth-error'  // Show detailed error page
  },
  callbacks: {
    // Create Customer on first social sign in
    async signIn({ user, account, profile }) {
      // Only for OAuth providers (not credentials)
      if (account?.provider !== 'credentials' && user.email) {
        try {
          // Check if user already has a customer
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { customer: true }
          });

          // Create customer if doesn't exist
          if (existingUser && !existingUser.customerId) {
            const nameParts = user.name?.split(' ') || [];
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            const customer = await upsertCustomer(user.email, {
              firstName,
              lastName,
            });

            // Link user to customer
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { customerId: customer.id }
            });
          }
        } catch (error) {
          console.error('Error creating customer on sign in:', error);
          // Don't block sign in if customer creation fails
        }
      }
      return true;
    },
    // Add custom fields to JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    // Add custom fields to session
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
};
