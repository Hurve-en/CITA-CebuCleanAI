import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const bins = [
  { code: 'CB-101', barangay: 'Lahug', latitude: 10.332, longitude: 123.897 },
  { code: 'CB-204', barangay: 'Carbon', latitude: 10.296, longitude: 123.902 },
  { code: 'CB-305', barangay: 'Mabolo', latitude: 10.31, longitude: 123.92 },
];

async function main() {
  const [resident, officer, admin] = await Promise.all([
    prisma.user.upsert({
      where: { email: 'resident@example.com' },
      update: {},
      create: { email: 'resident@example.com', role: 'resident' },
    }),
    prisma.user.upsert({
      where: { email: 'officer@example.com' },
      update: {},
      create: { email: 'officer@example.com', role: 'officer' },
    }),
    prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: { email: 'admin@example.com', role: 'admin' },
    }),
  ]);

  for (const b of bins) {
    const bin = await prisma.smartBin.upsert({
      where: { code: b.code },
      update: {},
      create: { ...b, fillLevel: Math.random() * 100, temperature: 30 + Math.random() * 8 },
    });
    await prisma.telemetry.createMany({
      data: Array.from({ length: 5 }).map((_, i) => ({
        binId: bin.id,
        fill: Math.min(100, bin.fillLevel + i * 2),
        temperature: bin.temperature + i * 0.2,
        battery: 80 - i * 3,
        latitude: bin.latitude,
        longitude: bin.longitude,
      })),
    });
  }

  await prisma.reward.createMany({
    data: [
      { userId: resident.id, label: 'Welcome bonus', delta: 50 },
      { userId: resident.id, label: 'Correct segregation', delta: 15 },
      { userId: officer.id, label: 'Hotspot report', delta: 30 },
    ],
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
