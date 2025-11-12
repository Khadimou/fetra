/**
 * Test Simple - Codes Promo
 * Run: npx tsx scripts/test-promo-simple.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { prisma } from '../lib/db/prisma';
import { createNewsletterPromoCode, validatePromoCode, markPromoCodeAsUsed } from '../lib/promo-codes';

config({ path: resolve(process.cwd(), '.env.local') });

async function main() {
  console.log('🧪 Test Simple - Système de Codes Promo\n');

  const testEmail = `test-${Date.now()}@example.com`;

  try {
    // 1. Créer un code
    console.log('1️⃣  Création d\'un code promo...');
    const promoCode = await createNewsletterPromoCode(testEmail, 15, 30);
    console.log(`✅ Code créé: ${promoCode.code}`);
    console.log(`   Réduction: ${promoCode.discountValue}%`);
    console.log(`   Email: ${promoCode.subscriberEmail}\n`);

    // 2. Valider le code
    console.log('2️⃣  Validation du code...');
    const validation = await validatePromoCode(promoCode.code);
    if (validation.valid) {
      console.log(`✅ Code valide !`);
      console.log(`   Valeur: ${validation.promoCode?.discountValue}%\n`);
    } else {
      throw new Error(`Code invalide: ${validation.error}`);
    }

    // 3. Marquer comme utilisé
    console.log('3️⃣  Marquer comme utilisé...');
    await markPromoCodeAsUsed(promoCode.id);
    console.log(`✅ Code marqué comme utilisé\n`);

    // 4. Vérifier qu'il ne peut plus être utilisé
    console.log('4️⃣  Vérification limite d\'utilisation...');
    const validation2 = await validatePromoCode(promoCode.code);
    if (!validation2.valid) {
      console.log(`✅ Code refusé (normal) : ${validation2.error}\n`);
    } else {
      throw new Error('Code devrait être refusé (déjà utilisé)');
    }

    // 5. Statistiques
    console.log('5️⃣  Statistiques...');
    const total = await prisma.promoCode.count();
    const newsletter = await prisma.promoCode.count({
      where: { type: 'NEWSLETTER' }
    });
    const used = await prisma.promoCode.count({
      where: { currentUses: { gt: 0 } }
    });

    console.log(`✅ Total codes: ${total}`);
    console.log(`   Newsletter: ${newsletter}`);
    console.log(`   Utilisés: ${used}\n`);

    // Nettoyage
    console.log('🧹 Nettoyage...');
    await prisma.promoCode.deleteMany({
      where: {
        OR: [
          { subscriberEmail: { contains: 'test-' } },
          { code: { contains: 'TEST' } }
        ]
      }
    });
    console.log('✅ Nettoyage terminé\n');

    console.log('========================================');
    console.log('✅ TOUS LES TESTS SONT PASSÉS !');
    console.log('========================================');

  } catch (error: any) {
    console.error('\n❌ ERREUR:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
