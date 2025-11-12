/**
 * Script to test Brevo and HubSpot API integrations
 * Run: npx tsx scripts/test-integrations.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

// Test Brevo API
async function testBrevo() {
  console.log('\n🧪 Testing Brevo API...');

  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.error('❌ BREVO_API_KEY not configured');
    return false;
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/account', {
      method: 'GET',
      headers: {
        'api-key': apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Brevo API error (${response.status}): ${errorText}`);
      return false;
    }

    const data = await response.json();
    console.log('✅ Brevo API connected successfully!');
    console.log(`   Account: ${data.email}`);
    console.log(`   Plan: ${data.plan?.[0]?.type || 'Unknown'}`);

    // Check email quota
    if (data.plan?.[0]?.credits !== undefined) {
      console.log(`   Email credits: ${data.plan[0].credits}`);
    }

    return true;
  } catch (error: any) {
    console.error('❌ Brevo API test failed:', error.message);
    return false;
  }
}

// Test HubSpot API
async function testHubSpot() {
  console.log('\n🧪 Testing HubSpot API...');

  const accessToken = process.env.HUBSPOT_ACCESS_TOKEN;

  if (!accessToken) {
    console.warn('⚠️  HUBSPOT_ACCESS_TOKEN not configured (optional)');
    return true; // Not critical
  }

  try {
    const response = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts?limit=1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ HubSpot API error (${response.status}): ${errorText}`);
      return false;
    }

    const data = await response.json();
    console.log('✅ HubSpot API connected successfully!');
    console.log(`   Total contacts: ${data.total || 0}`);

    return true;
  } catch (error: any) {
    console.error('❌ HubSpot API test failed:', error.message);
    return false;
  }
}

// Test Brevo email templates
async function testBrevoTemplates() {
  console.log('\n🧪 Testing Brevo email templates...');

  const apiKey = process.env.BREVO_API_KEY;
  const templateOrderConfirm = process.env.BREVO_TEMPLATE_ORDER_CONFIRM;
  const templateShipped = process.env.BREVO_TEMPLATE_SHIPPED;

  if (!apiKey) {
    console.error('❌ BREVO_API_KEY not configured');
    return false;
  }

  try {
    // Check order confirmation template
    if (templateOrderConfirm) {
      const response = await fetch(`https://api.brevo.com/v3/smtp/templates/${templateOrderConfirm}`, {
        method: 'GET',
        headers: {
          'api-key': apiKey,
        },
      });

      if (response.ok) {
        const template = await response.json();
        console.log(`✅ Order confirmation template (ID ${templateOrderConfirm}): "${template.name}"`);
      } else {
        console.error(`❌ Order confirmation template (ID ${templateOrderConfirm}) not found`);
        return false;
      }
    } else {
      console.warn('⚠️  BREVO_TEMPLATE_ORDER_CONFIRM not configured');
    }

    // Check shipping template
    if (templateShipped) {
      const response = await fetch(`https://api.brevo.com/v3/smtp/templates/${templateShipped}`, {
        method: 'GET',
        headers: {
          'api-key': apiKey,
        },
      });

      if (response.ok) {
        const template = await response.json();
        console.log(`✅ Shipping confirmation template (ID ${templateShipped}): "${template.name}"`);
      } else {
        console.error(`❌ Shipping confirmation template (ID ${templateShipped}) not found`);
        return false;
      }
    } else {
      console.warn('⚠️  BREVO_TEMPLATE_SHIPPED not configured');
    }

    return true;
  } catch (error: any) {
    console.error('❌ Template check failed:', error.message);
    return false;
  }
}

// Test Stripe API
async function testStripe() {
  console.log('\n🧪 Testing Stripe API...');

  const apiKey = process.env.STRIPE_SECRET_KEY;

  if (!apiKey) {
    console.error('❌ STRIPE_SECRET_KEY not configured');
    return false;
  }

  try {
    const response = await fetch('https://api.stripe.com/v1/balance', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Stripe API error (${response.status}): ${errorText}`);
      return false;
    }

    const data = await response.json();
    console.log('✅ Stripe API connected successfully!');
    console.log(`   Mode: ${apiKey.includes('test') ? 'TEST' : 'LIVE'}`);
    console.log(`   Available balance: ${data.available[0]?.amount / 100 || 0} ${data.available[0]?.currency?.toUpperCase() || 'EUR'}`);

    return true;
  } catch (error: any) {
    console.error('❌ Stripe API test failed:', error.message);
    return false;
  }
}

// Run all tests
async function main() {
  console.log('🚀 Testing FETRA integrations...');
  console.log('================================\n');

  const results = {
    stripe: await testStripe(),
    brevo: await testBrevo(),
    brevoTemplates: await testBrevoTemplates(),
    hubspot: await testHubSpot(),
  };

  console.log('\n================================');
  console.log('📊 Test Results:');
  console.log('================================');
  console.log(`Stripe:           ${results.stripe ? '✅' : '❌'}`);
  console.log(`Brevo:            ${results.brevo ? '✅' : '❌'}`);
  console.log(`Brevo Templates:  ${results.brevoTemplates ? '✅' : '⚠️'}`);
  console.log(`HubSpot:          ${results.hubspot ? '✅' : '⚠️'}`);

  const criticalPassed = results.stripe && results.brevo;

  if (criticalPassed) {
    console.log('\n✅ All critical integrations are working!');
    console.log('   You can now process orders and send emails.');
  } else {
    console.log('\n❌ Some critical integrations failed.');
    console.log('   Please check the errors above and fix configuration.');
    process.exit(1);
  }
}

main().catch(console.error);
