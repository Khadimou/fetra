/**
 * Prisma Seed Script
 * Creates initial admin user and sample data
 * Run with: npx prisma db seed
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// Use direct URL for seed (not pooled connection)
const prisma = new PrismaClient({
  datasourceUrl: process.env.DIRECT_URL,
});

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@fetrabeauty.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'; // CHANGE IN PRODUCTION!

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin FETRA',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date()
    }
  });

  console.log('✅ Admin user created:', admin.email);

  // Create sample customer (optional)
  const customer = await prisma.customer.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      email: 'client@example.com',
      firstName: 'Marie',
      lastName: 'Dupont',
      phone: '+33612345678'
    }
  });

  console.log('✅ Sample customer created:', customer.email);

  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('📝 Login credentials:');
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
  console.log('');
  console.log('⚠️  IMPORTANT: Change the admin password in production!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
