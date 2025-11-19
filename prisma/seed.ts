/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import * as bcrypt from 'bcrypt';
import { PrismaClient, UserType } from '../generated/prisma';

// Use as variáveis de ambiente para as credenciais do primeiro admin
// Nota: Você deve definir estas variáveis no seu arquivo .env
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@uaifood.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // 1. Gera o hash da senha de forma segura
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  // 2. Cria o primeiro usuário ADMIN
  const adminUser = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      password: hashedPassword,
      name: 'Super Admin',
      type: UserType.ADMIN,
      phone: '34900000000',
    },
    create: {
      email: ADMIN_EMAIL,
      password: hashedPassword,
      name: 'Super Admin',
      type: UserType.ADMIN,
      phone: '34900000000',
    },
  });

  console.log(`Created or updated Admin user with ID: ${adminUser.id}`);
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
