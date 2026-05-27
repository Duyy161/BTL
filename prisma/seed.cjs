const { PrismaClient, UserRole } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const sme = await prisma.user.upsert({
    where: { email: 'sme.demo@broker40.vn' },
    update: {},
    create: {
      email: 'sme.demo@broker40.vn',
      fullName: 'SME Demo',
      role: UserRole.SME,
    },
  });

  const experts = [
    {
      email: 'lab.nlp@hust.vn',
      fullName: 'Lab NLP HUST',
      organization: 'HUST AI Lab',
      technologies: 'nlp,chatbot,customer-support,automation',
      rating: 4.8,
      projectCount: 22,
    },
    {
      email: 'expert.cv@vnu.vn',
      fullName: 'Computer Vision Team VNU',
      organization: 'VNU Innovation Lab',
      technologies: 'computer-vision,quality-control,iot,automation',
      rating: 4.6,
      projectCount: 16,
    },
    {
      email: 'startup.crm@tech.vn',
      fullName: 'Startup CRM Next',
      organization: 'CRM Next JSC',
      technologies: 'crm,sales-ops,chatbot,analytics',
      rating: 4.4,
      projectCount: 11,
    },
  ];

  for (const ex of experts) {
    const user = await prisma.user.upsert({
      where: { email: ex.email },
      update: {},
      create: {
        email: ex.email,
        fullName: ex.fullName,
        role: UserRole.EXPERT,
      },
    });

    await prisma.expertProfile.upsert({
      where: { userId: user.id },
      update: {
        organization: ex.organization,
        technologies: ex.technologies,
        rating: ex.rating,
        projectCount: ex.projectCount,
      },
      create: {
        userId: user.id,
        organization: ex.organization,
        technologies: ex.technologies,
        rating: ex.rating,
        projectCount: ex.projectCount,
      },
    });
  }

  console.log('Seeded users and expert profiles. SME ID:', sme.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
