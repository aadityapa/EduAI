import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { PERMISSIONS, ROLE_PERMISSIONS } from '@eduai/auth/permissions';

const prisma = new PrismaClient();

async function assignRole(
  userId: string,
  roleId: string,
  tenantId: string,
  schoolId: string,
) {
  const existing = await prisma.userRole.findFirst({
    where: { userId, roleId, schoolId, classId: null },
  });
  if (!existing) {
    await prisma.userRole.create({
      data: { userId, roleId, tenantId, schoolId },
    });
  }
}

async function main() {
  console.log('🌱 Seeding EduAI database...');

  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      slug: 'demo',
      name: 'EduAI Demo School Group',
      type: 'school_group',
      subscriptionTier: 'professional',
      status: 'active',
    },
  });

  const school = await prisma.school.upsert({
    where: { tenantId_code: { tenantId: tenant.id, code: 'MAIN' } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Demo Public School',
      code: 'MAIN',
    },
  });

  for (const perm of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { code: perm.code },
      update: {},
      create: perm,
    });
  }

  const allPermissions = await prisma.permission.findMany();
  const permMap = new Map(allPermissions.map((p) => [p.code, p.id]));

  for (const [roleCode, permCodes] of Object.entries(ROLE_PERMISSIONS)) {
    const role = await prisma.role.upsert({
      where: { code_tenantId: { code: roleCode, tenantId: tenant.id } },
      update: {},
      create: {
        code: roleCode,
        name: roleCode.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        tenantId: tenant.id,
        isSystem: true,
      },
    });

    for (const code of permCodes) {
      const permId = permMap.get(code);
      if (!permId) continue;
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permId } },
        update: {},
        create: { roleId: role.id, permissionId: permId },
      });
    }
  }

  const passwordHash = await bcrypt.hash('Demo1234!', 12);

  const adminUser = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'admin@demo.eduai.in' } },
    update: { passwordHash, status: 'active' },
    create: {
      tenantId: tenant.id,
      schoolId: school.id,
      email: 'admin@demo.eduai.in',
      passwordHash,
      firstName: 'Demo',
      lastName: 'Admin',
      status: 'active',
      emailVerifiedAt: new Date(),
    },
  });

  const tenantAdminRole = await prisma.role.findFirst({
    where: { code: 'tenant_admin', tenantId: tenant.id },
  });
  if (tenantAdminRole) {
    await assignRole(adminUser.id, tenantAdminRole.id, tenant.id, school.id);
  }

  const demoUsers = [
    { email: 'teacher@demo.eduai.in', role: 'teacher', firstName: 'Priya', lastName: 'Sharma' },
    { email: 'student@demo.eduai.in', role: 'student', firstName: 'Arjun', lastName: 'Patil', classLevel: 8 },
    { email: 'parent@demo.eduai.in', role: 'parent', firstName: 'Rajesh', lastName: 'Patil' },
  ];

  for (const demo of demoUsers) {
    const user = await prisma.user.upsert({
      where: { tenantId_email: { tenantId: tenant.id, email: demo.email } },
      update: { passwordHash, status: 'active' },
      create: {
        tenantId: tenant.id,
        schoolId: school.id,
        email: demo.email,
        passwordHash,
        firstName: demo.firstName,
        lastName: demo.lastName,
        classLevel: demo.classLevel,
        status: 'active',
        emailVerifiedAt: new Date(),
      },
    });

    const role = await prisma.role.findFirst({
      where: { code: demo.role, tenantId: tenant.id },
    });
    if (role) {
      await assignRole(user.id, role.id, tenant.id, school.id);
    }
  }

  const studentUser = await prisma.user.findFirst({
    where: { tenantId: tenant.id, email: 'student@demo.eduai.in' },
  });
  const parentUser = await prisma.user.findFirst({
    where: { tenantId: tenant.id, email: 'parent@demo.eduai.in' },
  });

  if (studentUser && parentUser) {
    const { seedSprint2 } = await import('./seed-sprint2');
    await seedSprint2(prisma, tenant.id, studentUser.id, parentUser.id);
  }

  console.log('✅ Seed complete — demo tenant: demo, password: Demo1234!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
