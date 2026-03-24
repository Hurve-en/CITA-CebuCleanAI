import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'resident@example.com' },
    update: {},
    create: { email: 'resident@example.com', role: 'resident' },
  });

  await prisma.smartBin.upsert({
    where: { code: 'CB-101' },
    update: {},
    create: { code: 'CB-101', barangay: 'Lahug', latitude: 10.332, longitude: 123.897 },
  });

  await prisma.reward.create({
    data: { userId: user.id, label: 'Welcome bonus', delta: 50 },
  });
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
