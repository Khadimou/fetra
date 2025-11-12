/**
 * Script to create an admin user in the database
 * Run with: npx tsx scripts/create-admin.ts
 */

import prisma from '../lib/db/prisma';
import bcrypt from 'bcrypt';

async function createAdmin() {
  const email = 'admin@fetrabeauty.com';
  const password = '334578a*';
  
  console.log('🔐 Creating admin user...\n');
  
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Check if admin already exists
    const existing = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existing) {
      console.log('⚠️  Admin already exists, updating password...');
      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          role: 'ADMIN'
        }
      });
      console.log('✅ Admin password updated!\n');
    } else {
      console.log('📝 Creating new admin user...');
      await prisma.user.create({
        data: {
          email,
          name: 'Admin',
          password: hashedPassword,
          role: 'ADMIN',
          emailVerified: new Date()
        }
      });
      console.log('✅ Admin user created!\n');
    }
    
    console.log('📧 Credentials:');
    console.log('   Email:', email);
    console.log('   Password:', password);
    console.log('\n🌐 Login URL:');
    console.log('   https://0fa5d0e0758d.ngrok-free.app//admin/login');
    console.log('   https://fetrabeauty.com/admin/login\n');
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

createAdmin()
  .then(() => {
    console.log('✨ Done!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

