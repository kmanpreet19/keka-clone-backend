import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create organization
  const org = await prisma.organization.upsert({
    where: { domain: 'testcompany.com' },
    update: {},
    create: {
      name: 'Test Company',
      domain: 'testcompany.com',
    },
  });

  console.log('Organization created:', org.name);

  // 2. Create admin user
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {
      organizationId: org.id, // Link to organization
    },
    create: {
      email: 'admin@test.com',
      password: hashedPassword,
      role: 'ADMIN',
      organizationId: org.id,
      isActive: true,
    },
  });

  console.log('Admin user created:', admin.email);

  // 3. Create departments (optional)
  const engineeringDept = await prisma.department.upsert({
    where: {
      name_organizationId: {
        name: 'Engineering',
        organizationId: org.id,
      },
    },
    update: {},
    create: {
      name: 'Engineering',
      organizationId: org.id,
    },
  });

  const hrDept = await prisma.department.upsert({
    where: {
      name_organizationId: {
        name: 'Human Resources',
        organizationId: org.id,
      },
    },
    update: {},
    create: {
      name: 'Human Resources',
      organizationId: org.id,
    },
  });

  console.log('Departments created');

  // 4. Create designations (optional)
  const seniorDev = await prisma.designation.upsert({
    where: {
      title_organizationId: {
        title: 'Senior Software Engineer',
        organizationId: org.id,
      },
    },
    update: {},
    create: {
      title: 'Senior Software Engineer',
      organizationId: org.id,
    },
  });

  const hrManager = await prisma.designation.upsert({
    where: {
      title_organizationId: {
        title: 'HR Manager',
        organizationId: org.id,
      },
    },
    update: {},
    create: {
      title: 'HR Manager',
      organizationId: org.id,
    },
  });

  console.log('Designations created');

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(' Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });