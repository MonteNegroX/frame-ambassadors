import * as dotenv from 'dotenv';
import * as path from 'path';

// Explicitly load .env from the root directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, UserRole, CampaignStatus, ApplicationStatus, PaymentType } from '@prisma/client';

async function main() {
  console.log('--- Start seeding ---');
  console.log('DATABASE_URL defined:', !!process.env.DATABASE_URL);

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined. Please check your .env file.');
  }

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  try {
    // 1. Create Projects
    console.log('Seeding Projects...');
    const projectUsers = [
      {
        handle: 'optimism',
        id: '123456',
        name: 'Optimism',
        desc: 'A collective of companies, communities, and citizens working to reward public goods.',
        site: 'https://optimism.io'
      },
      {
        handle: 'base',
        id: '789012',
        name: 'Base',
        desc: 'A secure, low-cost, builder-friendly Ethereum L2.',
        site: 'https://base.org'
      }
    ];

    for (const pu of projectUsers) {
      const user = await prisma.user.upsert({
        where: { twitterHandle: pu.handle },
        update: { role: UserRole.PROJECT },
        create: {
          role: UserRole.PROJECT,
          twitterHandle: pu.handle,
          twitterId: pu.id,
        },
      });

      await prisma.project.upsert({
        where: { id: user.id },
        update: {
          name: pu.name,
          description: pu.desc,
          website: pu.site,
          verified: true,
        },
        create: {
          id: user.id,
          name: pu.name,
          description: pu.desc,
          website: pu.site,
          verified: true,
        },
      });
      console.log(`  ✓ Project: ${pu.handle}`);
    }

    // 2. Create KOLs
    console.log('Seeding KOLs...');
    const kolUsers = [
      {
        handle: 'crypto_kol_1',
        id: 'kol_1_id',
        followers: 50000,
        niches: ['L2', 'DeFi', 'Ethereum']
      },
      {
        handle: 'web3_marketer',
        id: 'kol_2_id',
        followers: 120000,
        niches: ['NFT', 'Gaming', 'Marketing']
      }
    ];

    for (const ku of kolUsers) {
      const user = await prisma.user.upsert({
        where: { twitterHandle: ku.handle },
        update: { role: UserRole.KOL },
        create: {
          role: UserRole.KOL,
          twitterHandle: ku.handle,
          twitterId: ku.id,
        },
      });

      await prisma.kOLProfile.upsert({
        where: { id: user.id },
        update: {
          followerCount: ku.followers,
          niches: ku.niches,
        },
        create: {
          id: user.id,
          followerCount: ku.followers,
          niches: ku.niches,
        },
      });
      console.log(`  ✓ KOL: ${ku.handle}`);
    }

    // 3. Create Campaigns
    console.log('Seeding Campaigns...');
    const optUser = await prisma.user.findUnique({ where: { twitterHandle: 'optimism' } });
    const baseUser = await prisma.user.findUnique({ where: { twitterHandle: 'base' } });

    if (!optUser || !baseUser) throw new Error('Project users not found after upsert!');

    const campaign1 = await prisma.campaign.upsert({
      where: { id: 'test-campaign-opt-1' },
      update: {},
      create: {
        id: 'test-campaign-opt-1',
        projectId: optUser.id,
        title: 'Optimism RetroPGF Awareness',
        brief: 'Create a thread explaining the impact of RetroPGF on the Optimism ecosystem.',
        contentType: 'thread',
        platform: 'twitter',
        budgetUsd: 1500,
        paymentType: PaymentType.INSTANT,
        status: CampaignStatus.ACTIVE,
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
        type: 'open',
      }
    });

    const campaign2 = await prisma.campaign.upsert({
      where: { id: 'test-campaign-base-1' },
      update: {},
      create: {
        id: 'test-campaign-base-1',
        projectId: baseUser.id,
        title: 'Base Mainnet Onboarding',
        brief: 'Share your experience bridge to Base and using one of the dApps.',
        contentType: 'tweet',
        platform: 'twitter',
        budgetUsd: 500,
        paymentType: PaymentType.INSTANT,
        status: CampaignStatus.ACTIVE,
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        type: 'open',
      }
    });
    console.log('  ✓ Campaigns created');

    // 4. Create Applications
    console.log('Seeding Applications...');
    const kol1 = await prisma.user.findUnique({ where: { twitterHandle: 'crypto_kol_1' } });
    const kol2 = await prisma.user.findUnique({ where: { twitterHandle: 'web3_marketer' } });

    if (!kol1 || !kol2) throw new Error('KOL users not found after upsert!');

    await prisma.campaignApplication.upsert({
      where: {
        campaignId_kolId: {
          campaignId: campaign1.id,
          kolId: kol1.id,
        }
      },
      update: {},
      create: {
        campaignId: campaign1.id,
        kolId: kol1.id,
        pitch: 'I have a large following interested in L2 ecosystems.',
        status: ApplicationStatus.PENDING,
      }
    });

    await prisma.campaignApplication.upsert({
      where: {
        campaignId_kolId: {
          campaignId: campaign2.id,
          kolId: kol2.id,
        }
      },
      update: {},
      create: {
        campaignId: campaign2.id,
        kolId: kol2.id,
        pitch: 'I love Base and can make a very engaging guide for beginners.',
        status: ApplicationStatus.APPROVED,
      }
    });
    console.log('  ✓ Applications created');

    console.log('--- Seeding completed successfully ---');
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('SEED ERROR:', e);
    process.exit(1);
  });
