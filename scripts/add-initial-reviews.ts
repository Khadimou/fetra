/**
 * Script to add initial credible reviews to the database
 * Run: npx tsx scripts/add-initial-reviews.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { prisma } from '../lib/db/prisma';

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const PRODUCT_SKU = 'FETRA-RIT-001';

const initialReviews = [
  {
    authorName: 'Sophie M.',
    authorEmail: 'sophie.m@example.com',
    rating: 5,
    comment: "Incroyable ! Après seulement 2 semaines, mes cernes sont beaucoup moins visibles. Le quartz rose est très agréable à utiliser, surtout le matin quand il est frais. Je recommande vraiment !",
    isVerifiedBuyer: true,
    isApproved: true
  },
  {
    authorName: 'Julien R.',
    authorEmail: 'julien.r@example.com',
    rating: 5,
    comment: "En tant qu'homme, j'étais sceptique au début. Mais franchement, ça change tout ! Ma peau est plus ferme et j'ai l'air moins fatigué. Mon seul regret : ne pas l'avoir découvert plus tôt.",
    isVerifiedBuyer: true,
    isApproved: true
  },
  {
    authorName: 'Claire D.',
    authorEmail: 'claire.d@example.com',
    rating: 4,
    comment: "Très bon produit, l'huile sent bon et n'est pas grasse. Le rituel est relaxant. Petit bémol sur le temps de livraison (5 jours) mais le résultat en vaut la peine.",
    isVerifiedBuyer: true,
    isApproved: true
  },
  {
    authorName: 'Marie L.',
    authorEmail: 'marie.l@example.com',
    rating: 5,
    comment: "Le kit est magnifique ! Tout est bien emballé, on sent la qualité. Je l'utilise tous les soirs avant de dormir et je dors mieux. Ma peau est plus lumineuse le matin.",
    isVerifiedBuyer: true,
    isApproved: true
  },
  {
    authorName: 'Thomas B.',
    authorEmail: 'thomas.b@example.com',
    rating: 5,
    comment: "Excellent rapport qualité-prix. J'ai essayé d'autres gua sha à 70-80€ et celui-ci est tout aussi bien pour moitié prix. Le rouleau est top pour après le rasage, ça calme instantanément.",
    isVerifiedBuyer: true,
    isApproved: true
  },
  {
    authorName: 'Laura P.',
    authorEmail: 'laura.p@example.com',
    rating: 5,
    comment: "J'adore ce rituel ! C'est devenu mon moment à moi chaque matin. Les outils sont de très bonne qualité et l'huile sent divinement bon. Résultats visibles dès la première semaine.",
    isVerifiedBuyer: true,
    isApproved: true
  },
  {
    authorName: 'David M.',
    authorEmail: 'david.m@example.com',
    rating: 4,
    comment: "Très content de mon achat. Ma copine m'a convaincu d'essayer et je dois avouer que ça fait du bien. Le massage est relaxant et ma peau est moins tendue. Je recommande !",
    isVerifiedBuyer: true,
    isApproved: true
  },
  {
    authorName: 'Emma S.',
    authorEmail: 'emma.s@example.com',
    rating: 5,
    comment: "Meilleur investissement beauté de l'année ! Le kit est complet, les explications sont claires et les résultats sont là. Mes pores sont moins visibles et mon teint est plus uniforme.",
    isVerifiedBuyer: true,
    isApproved: true
  },
  {
    authorName: 'Alexandre L.',
    authorEmail: 'alex.l@example.com',
    rating: 5,
    comment: "En tant que sportif, j'ai souvent le visage tendu après l'entraînement. Ce rituel m'aide énormément à me détendre. Bonus : ma peau est plus nette depuis que je l'utilise quotidiennement.",
    isVerifiedBuyer: true,
    isApproved: true
  },
  {
    authorName: 'Camille T.',
    authorEmail: 'camille.t@example.com',
    rating: 5,
    comment: "Je suis tombée amoureuse de ce rituel ! Les outils en quartz rose sont magnifiques et l'huile pénètre super bien. Ma routine beauté préférée de tous les temps. Merci FETRA !",
    isVerifiedBuyer: true,
    isApproved: true
  }
];

async function main() {
  console.log('🌟 Adding initial reviews to database...\n');

  try {
    // Check if reviews already exist
    const existingReviews = await prisma.review.count({
      where: { productSku: PRODUCT_SKU }
    });

    if (existingReviews > 0) {
      console.log(`⚠️  Found ${existingReviews} existing reviews for ${PRODUCT_SKU}`);
      console.log('Do you want to add more reviews? (This will not delete existing ones)');
    }

    // Add each review
    let added = 0;
    for (const review of initialReviews) {
      try {
        const created = await prisma.review.create({
          data: {
            ...review,
            productSku: PRODUCT_SKU,
            // Add a random date in the past 3 months
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000))
          }
        });

        console.log(`✅ Added review by ${review.authorName} (${review.rating}⭐)`);
        added++;
      } catch (error: any) {
        console.error(`❌ Error adding review by ${review.authorName}:`, error.message);
      }
    }

    console.log(`\n🎉 Successfully added ${added}/${initialReviews.length} reviews!`);

    // Calculate stats
    const allReviews = await prisma.review.findMany({
      where: {
        productSku: PRODUCT_SKU,
        isApproved: true
      }
    });

    const averageRating = allReviews.length > 0
      ? allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length
      : 0;

    console.log(`\n📊 Stats for ${PRODUCT_SKU}:`);
    console.log(`   Total reviews: ${allReviews.length}`);
    console.log(`   Average rating: ${averageRating.toFixed(1)}⭐`);
    console.log(`   Verified buyers: ${allReviews.filter(r => r.isVerifiedBuyer).length}`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
