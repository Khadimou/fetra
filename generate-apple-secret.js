/**
 * Generate Apple Sign In Client Secret (JWT)
 *
 * This script generates a JWT token required for Apple Sign In authentication.
 * The token is valid for 6 months (maximum allowed by Apple).
 *
 * Requirements:
 * - Your Apple .p8 private key file (downloaded from Apple Developer Portal)
 * - Team ID (found in Apple Developer Membership)
 * - Service ID (configured in Apple Developer Identifiers)
 * - Key ID (from the .p8 key you created)
 *
 * Usage:
 * 1. Place your AuthKey_P93RWF29VZ.p8 file in the same directory
 * 2. Run: npm install jsonwebtoken
 * 3. Run: node generate-apple-secret.js
 * 4. Copy the generated JWT and add it to .env.local as APPLE_CLIENT_SECRET
 */

const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  keyFile: 'AuthKey_P93RWF29VZ.p8',  // Your .p8 key file name
  teamId: 'B447359FDU',              // Your Apple Team ID
  serviceId: 'com.fetrabeauty.web.service',  // Your Apple Service ID
  keyId: 'P93RWF29VZ',               // Your Key ID
  expiresIn: '180d'                   // 6 months (maximum allowed)
};

try {
  // Check if key file exists
  const keyPath = path.join(__dirname, CONFIG.keyFile);
  if (!fs.existsSync(keyPath)) {
    console.error('❌ Error: Key file not found!');
    console.error(`   Expected location: ${keyPath}`);
    console.error('');
    console.error('   Please download your .p8 key from Apple Developer Portal:');
    console.error('   https://developer.apple.com/account/resources/authkeys/list');
    console.error('');
    process.exit(1);
  }

  // Read private key
  const privateKey = fs.readFileSync(keyPath, 'utf8');

  // Generate JWT
  const token = jwt.sign({}, privateKey, {
    algorithm: 'ES256',
    expiresIn: CONFIG.expiresIn,
    audience: 'https://appleid.apple.com',
    issuer: CONFIG.teamId,
    subject: CONFIG.serviceId,
    keyid: CONFIG.keyId
  });

  // Calculate expiration date
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 180);

  // Output results
  console.log('');
  console.log('✅ Apple Client Secret (JWT) generated successfully!');
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('Add this to your .env.local file:');
  console.log('');
  console.log(`APPLE_CLIENT_SECRET=${token}`);
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('ℹ️  Configuration used:');
  console.log(`   Team ID: ${CONFIG.teamId}`);
  console.log(`   Service ID: ${CONFIG.serviceId}`);
  console.log(`   Key ID: ${CONFIG.keyId}`);
  console.log(`   Expires: ${expirationDate.toLocaleDateString()} (${CONFIG.expiresIn})`);
  console.log('');
  console.log('⚠️  Important:');
  console.log('   - This token expires in 6 months');
  console.log('   - You will need to regenerate it before expiration');
  console.log('   - Never commit this token to Git');
  console.log('   - Add it only to .env.local (which is gitignored)');
  console.log('');

} catch (error) {
  console.error('❌ Error generating Apple Client Secret:');
  console.error('');
  console.error(error.message);
  console.error('');

  if (error.code === 'ERR_OSSL_PEM_NO_START_LINE') {
    console.error('   The .p8 key file appears to be invalid or corrupted.');
    console.error('   Please download a fresh copy from Apple Developer Portal.');
  }

  process.exit(1);
}
