/**
 * Test script for CJ Dropshipping Integration
 * Run with: npx tsx scripts/test-cj-integration.ts
 */

import { createCjOrder, isCjConfigured } from '../lib/integrations/cj-dropshipping';
import type { CJOrderRequest } from '../lib/types/cj';

async function testCjIntegration() {
  console.log('🧪 Testing CJ Dropshipping Integration\n');
  
  // Test 1: Check configuration
  console.log('1️⃣ Checking configuration...');
  const configured = isCjConfigured();
  console.log(`   ✅ CJ Configured: ${configured ? 'Yes' : 'No'}`);
  
  if (!configured) {
    console.log('\n   ⚠️  CJ is not configured. Please set:');
    console.log('      - NEXT_PUBLIC_SUPABASE_URL');
    console.log('      - NEXT_PUBLIC_SUPABASE_ANON_KEY');
    console.log('      OR');
    console.log('      - CJ_CLIENT_ID');
    console.log('      - CJ_CLIENT_SECRET');
    return;
  }
  
  // Test 2: Try to create a test order (will fail if no valid variant ID)
  console.log('\n2️⃣ Testing order creation...');
  
  const testOrder: CJOrderRequest = {
    orderNumber: `TEST-${Date.now()}`,
    shippingCustomerName: 'Test User',
    shippingAddress: '123 Test Street',
    shippingCity: 'Paris',
    shippingCountry: 'FR',
    shippingCountryCode: 'FR',
    shippingZip: '75001',
    shippingPhone: '+33123456789',
    email: 'test@example.com',
    remark: 'Test order from integration test',
    products: [
      {
        vid: process.env.CJ_DEFAULT_VARIANT_ID || 'TEST_VARIANT_ID',
        quantity: 1,
      },
    ],
    shopAmount: 49.90,
  };
  
  try {
    console.log('   📦 Creating test order...');
    const result = await createCjOrder(testOrder);
    console.log('   ✅ Order created successfully!');
    console.log(`      Order ID: ${result.orderId}`);
    console.log(`      Order Num: ${result.orderNum}`);
  } catch (error: any) {
    console.log('   ❌ Order creation failed:', error.message);
    if (error.message.includes('variant ID')) {
      console.log('\n   💡 Tip: Set CJ_DEFAULT_VARIANT_ID in your .env.local');
      console.log('      Or configure cjVariantId in your Product model');
    }
  }
  
  console.log('\n✅ Test completed!');
}

// Run the test
testCjIntegration().catch(console.error);

