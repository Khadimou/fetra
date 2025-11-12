/**
 * Script de test complet du système de codes promo newsletter
 * Run: npx tsx scripts/test-promo-codes.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { prisma } from '../lib/db/prisma';
import { createNewsletterPromoCode, validatePromoCode } from '../lib/promo-codes';

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
const TEST_EMAIL = `test-${Date.now()}@fetrabeauty.com`;

console.log('🚀 Test Complet du Système de Codes Promo');
console.log('==========================================\n');

// Test 1: Génération de code promo
async function test1_GeneratePromoCode() {
  console.log('📝 TEST 1: Génération de Code Promo');
  console.log('-----------------------------------');

  try {
    const promoCode = await createNewsletterPromoCode(TEST_EMAIL, 15, 30);

    console.log('✅ Code promo généré avec succès !');
    console.log(`   Code: ${promoCode.code}`);
    console.log(`   Email: ${promoCode.subscriberEmail}`);
    console.log(`   Réduction: ${promoCode.discountValue}%`);
    console.log(`   Valide jusqu'au: ${promoCode.validUntil?.toLocaleDateString('fr-FR')}`);
    console.log(`   Usage max: ${promoCode.maxUses}`);
    console.log(`   Utilisations: ${promoCode.currentUses}`);

    return promoCode;
  } catch (error: any) {
    console.error('❌ Erreur:', error.message);
    throw error;
  }
}

// Test 2: Validation du code
async function test2_ValidatePromoCode(code: string) {
  console.log('\n📝 TEST 2: Validation du Code');
  console.log('----------------------------');

  try {
    const result = await validatePromoCode(code);

    if (result.valid) {
      console.log('✅ Code validé avec succès !');
      console.log(`   Code: ${result.promoCode?.code}`);
      console.log(`   Type: ${result.promoCode?.discountType}`);
      console.log(`   Valeur: ${result.promoCode?.discountValue}`);
    } else {
      console.error('❌ Code invalide:', result.error);
      throw new Error(result.error);
    }

    return result;
  } catch (error: any) {
    console.error('❌ Erreur:', error.message);
    throw error;
  }
}

// Test 3: API Newsletter (inscription)
async function test3_NewsletterAPI() {
  console.log('\n📝 TEST 3: API Newsletter (Inscription)');
  console.log('--------------------------------------');

  // Utiliser un email différent pour ce test
  const newsletterEmail = `newsletter-${Date.now()}@fetrabeauty.com`;

  try {
    const response = await fetch(`${BASE_URL}/api/newsletter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: newsletterEmail
      })
    });

    const data = await response.json();

    if (response.ok && data.ok) {
      console.log('✅ Inscription newsletter réussie !');
      console.log(`   Email: ${newsletterEmail}`);

      if (data.promoCode) {
        console.log(`   Code généré: ${data.promoCode.code}`);
        console.log(`   Réduction: ${data.promoCode.discount}%`);
        console.log(`   Expire le: ${new Date(data.promoCode.validUntil).toLocaleDateString('fr-FR')}`);
        return data.promoCode.code;
      } else {
        console.warn('⚠️  Pas de code promo dans la réponse');
        return null;
      }
    } else {
      console.error('❌ Erreur API:', data.error || 'Unknown error');
      throw new Error(data.error);
    }
  } catch (error: any) {
    console.error('❌ Erreur:', error.message);
    throw error;
  }
}

// Test 4: API Validation
async function test4_ValidationAPI(code: string) {
  console.log('\n📝 TEST 4: API de Validation');
  console.log('---------------------------');

  try {
    const response = await fetch(`${BASE_URL}/api/promo-code/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log('✅ Code validé via API !');
      console.log(`   Code: ${data.promoCode.code}`);
      console.log(`   Type: ${data.promoCode.discountType}`);
      console.log(`   Valeur: ${data.promoCode.discountValue}`);
      return data;
    } else {
      console.error('❌ Erreur API:', data.error || 'Unknown error');
      throw new Error(data.error);
    }
  } catch (error: any) {
    console.error('❌ Erreur:', error.message);
    throw error;
  }
}

// Test 5: Vérifier dans la base de données
async function test5_DatabaseCheck(code: string) {
  console.log('\n📝 TEST 5: Vérification Base de Données');
  console.log('--------------------------------------');

  try {
    const promoCode = await prisma.promoCode.findUnique({
      where: { code }
    });

    if (promoCode) {
      console.log('✅ Code trouvé dans la base !');
      console.log(`   ID: ${promoCode.id}`);
      console.log(`   Code: ${promoCode.code}`);
      console.log(`   Type: ${promoCode.type}`);
      console.log(`   Réduction: ${promoCode.discountValue}%`);
      console.log(`   Actif: ${promoCode.isActive ? 'Oui' : 'Non'}`);
      console.log(`   Utilisations: ${promoCode.currentUses}/${promoCode.maxUses || '∞'}`);
      console.log(`   Email: ${promoCode.subscriberEmail}`);
      return promoCode;
    } else {
      console.error('❌ Code non trouvé dans la base');
      throw new Error('Code not found in database');
    }
  } catch (error: any) {
    console.error('❌ Erreur:', error.message);
    throw error;
  }
}

// Test 6: Tester l'expiration
async function test6_ExpirationTest() {
  console.log('\n📝 TEST 6: Test d\'Expiration');
  console.log('---------------------------');

  try {
    // Créer un code expiré
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 1); // Hier

    const expiredCode = await prisma.promoCode.create({
      data: {
        code: `EXPIRED-TEST-${Date.now()}`,
        type: 'NEWSLETTER',
        discountType: 'PERCENTAGE',
        discountValue: 15,
        maxUses: 1,
        validFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Il y a 7 jours
        validUntil: expiredDate
      }
    });

    console.log(`   Code expiré créé: ${expiredCode.code}`);

    // Tenter de valider
    const result = await validatePromoCode(expiredCode.code);

    if (!result.valid && result.error?.includes('expiré')) {
      console.log('✅ Expiration détectée correctement !');
      console.log(`   Erreur: ${result.error}`);

      // Nettoyer
      await prisma.promoCode.delete({ where: { id: expiredCode.id } });
      return true;
    } else {
      console.error('❌ Code expiré accepté (ne devrait pas) !');
      throw new Error('Expired code was accepted');
    }
  } catch (error: any) {
    console.error('❌ Erreur:', error.message);
    throw error;
  }
}

// Test 7: Tester la limite d'utilisation
async function test7_UsageLimitTest() {
  console.log('\n📝 TEST 7: Test Limite d\'Utilisation');
  console.log('------------------------------------');

  try {
    const limitCode = await prisma.promoCode.create({
      data: {
        code: `LIMIT-TEST-${Date.now()}`,
        type: 'NEWSLETTER',
        discountType: 'PERCENTAGE',
        discountValue: 15,
        maxUses: 1,
        currentUses: 1, // Déjà utilisé
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });

    console.log(`   Code créé: ${limitCode.code} (déjà utilisé 1/1 fois)`);

    // Tenter de valider
    const result = await validatePromoCode(limitCode.code);

    if (!result.valid && result.error?.includes('limite')) {
      console.log('✅ Limite d\'utilisation détectée !');
      console.log(`   Erreur: ${result.error}`);

      // Nettoyer
      await prisma.promoCode.delete({ where: { id: limitCode.id } });
      return true;
    } else {
      console.error('❌ Code déjà utilisé accepté (ne devrait pas) !');
      throw new Error('Used code was accepted');
    }
  } catch (error: any) {
    console.error('❌ Erreur:', error.message);
    throw error;
  }
}

// Test 8: Statistiques
async function test8_Statistics() {
  console.log('\n📝 TEST 8: Statistiques');
  console.log('---------------------');

  try {
    const stats = await prisma.promoCode.groupBy({
      by: ['type'],
      _count: {
        _all: true
      },
      _sum: {
        currentUses: true
      }
    });

    console.log('✅ Statistiques des codes promo :');

    stats.forEach(stat => {
      console.log(`   ${stat.type}: ${stat._count._all} codes, ${stat._sum.currentUses || 0} utilisations`);
    });

    const totalCodes = await prisma.promoCode.count();
    const activeCodes = await prisma.promoCode.count({ where: { isActive: true } });

    console.log(`\n   Total codes: ${totalCodes}`);
    console.log(`   Codes actifs: ${activeCodes}`);

    return stats;
  } catch (error: any) {
    console.error('❌ Erreur:', error.message);
    throw error;
  }
}

// Cleanup
async function cleanup() {
  console.log('\n🧹 Nettoyage...');

  try {
    // Supprimer tous les codes de test
    const deleted = await prisma.promoCode.deleteMany({
      where: {
        OR: [
          { subscriberEmail: { contains: 'test-' } },
          { subscriberEmail: { contains: 'newsletter-' } },
          { code: { contains: 'TEST' } }
        ]
      }
    });

    console.log(`✅ ${deleted.count} code(s) de test supprimé(s)`);
  } catch (error: any) {
    console.warn('⚠️  Erreur nettoyage:', error.message);
  }
}

// Main
async function main() {
  let testCode: string | null = null;

  try {
    // Test 1: Génération directe
    const promoCode1 = await test1_GeneratePromoCode();
    testCode = promoCode1.code;

    // Test 2: Validation
    await test2_ValidatePromoCode(testCode!);

    // Test 3: API Newsletter (nouveau code)
    const promoCode2 = await test3_NewsletterAPI();
    if (promoCode2) {
      testCode = promoCode2;
    }

    // Test 4: API Validation
    await test4_ValidationAPI(testCode!);

    // Test 5: Vérification DB
    await test5_DatabaseCheck(testCode!);

    // Test 6: Expiration
    await test6_ExpirationTest();

    // Test 7: Limite d'utilisation
    await test7_UsageLimitTest();

    // Test 8: Statistiques
    await test8_Statistics();

    console.log('\n========================================');
    console.log('✅ TOUS LES TESTS SONT PASSÉS !');
    console.log('========================================\n');

    console.log('📝 Résumé :');
    console.log(`   Email de test: ${TEST_EMAIL}`);
    console.log(`   Code généré: ${testCode}`);
    console.log(`   Tous les tests: ✅ PASS`);

    console.log('\n🎯 Prochaines étapes :');
    console.log('   1. Créez le template Brevo (voir docs/brevo-template-setup-guide.md)');
    console.log('   2. Testez avec votre vrai email');
    console.log('   3. Vérifiez l\'email reçu dans Brevo Logs');
    console.log('   4. Utilisez le code sur votre site');

  } catch (error: any) {
    console.log('\n========================================');
    console.log('❌ ÉCHEC DES TESTS');
    console.log('========================================');
    console.error('\nErreur:', error.message);
    process.exit(1);
  } finally {
    await cleanup();
    await prisma.$disconnect();
  }
}

main().catch(console.error);
