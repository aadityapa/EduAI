import type { PrismaClient } from '@prisma/client';

export async function seedSprint4(
  prisma: PrismaClient,
  tenantId: string,
  schoolId: string,
  teacherId: string,
  studentId: string,
  parentId: string,
) {
  console.log('  📚 Seeding Sprint 4 ERP data...');

  const academicYear = '2025-26';
  const demoClass = await prisma.academicClass.upsert({
    where: {
      tenantId_schoolId_name_section_academicYear: {
        tenantId,
        schoolId,
        name: 'Class 8',
        section: 'A',
        academicYear,
      },
    },
    update: { teacherId },
    create: {
      tenantId,
      schoolId,
      name: 'Class 8',
      section: 'A',
      classLevel: 8,
      academicYear,
      teacherId,
      room: '201',
    },
  });

  await prisma.classEnrollment.upsert({
    where: {
      tenantId_classId_studentId: {
        tenantId,
        classId: demoClass.id,
        studentId,
      },
    },
    update: {},
    create: { tenantId, classId: demoClass.id, studentId },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  await prisma.attendanceRecord.upsert({
    where: {
      tenantId_classId_studentId_date: {
        tenantId,
        classId: demoClass.id,
        studentId,
        date: today,
      },
    },
    update: {},
    create: {
      tenantId,
      classId: demoClass.id,
      studentId,
      date: today,
      status: 'present',
      markedById: teacherId,
    },
  });

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  for (let i = 1; i <= 5; i++) {
    await prisma.timetableSlot.createMany({
      data: [
        {
          tenantId,
          classId: demoClass.id,
          dayOfWeek: i,
          startTime: '09:00',
          endTime: '09:45',
          subject: 'Mathematics',
          teacherId,
          room: '201',
        },
        {
          tenantId,
          classId: demoClass.id,
          dayOfWeek: i,
          startTime: '10:00',
          endTime: '10:45',
          subject: 'Science',
          teacherId,
          room: '201',
        },
      ],
      skipDuplicates: true,
    });
  }

  await prisma.feeInvoice.upsert({
    where: { tenantId_invoiceNumber: { tenantId, invoiceNumber: 'FEE-2025-001' } },
    update: {},
    create: {
      tenantId,
      studentId,
      invoiceNumber: 'FEE-2025-001',
      description: 'Term 1 Tuition Fee',
      amount: 15000,
      gstAmount: 2700,
      status: 'issued',
      dueDate: new Date(Date.now() + 30 * 86400000),
    },
  });

  const exam = await prisma.exam.create({
    data: {
      tenantId,
      classId: demoClass.id,
      title: 'Mid-Term Mathematics',
      subject: 'Mathematics',
      examDate: new Date(Date.now() - 7 * 86400000),
      maxMarks: 100,
      status: 'completed',
    },
  });

  await prisma.examResult.upsert({
    where: {
      tenantId_examId_studentId: { tenantId, examId: exam.id, studentId },
    },
    update: {},
    create: {
      tenantId,
      examId: exam.id,
      studentId,
      marksObtained: 87,
      grade: 'A',
    },
  });

  await prisma.assignment.create({
    data: {
      tenantId,
      classId: demoClass.id,
      teacherId,
      title: 'Chapter 5 Practice Problems',
      description: 'Complete exercises 1-10 from textbook',
      dueDate: new Date(Date.now() + 5 * 86400000),
      status: 'published',
    },
  });

  await prisma.staffProfile.upsert({
    where: { userId: teacherId },
    update: {},
    create: {
      tenantId,
      schoolId,
      userId: teacherId,
      employeeId: 'EMP-001',
      department: 'Science',
      designation: 'Senior Teacher',
      joinDate: new Date('2020-06-01'),
    },
  });

  await prisma.notification.createMany({
    data: [
      {
        tenantId,
        userId: parentId,
        title: 'Attendance Update',
        body: 'Arjun was marked present today.',
        channel: 'in_app',
      },
      {
        tenantId,
        userId: teacherId,
        title: 'Assignment Due',
        body: '3 assignments due this week.',
        channel: 'in_app',
      },
    ],
    skipDuplicates: true,
  });

  // Billing plans
  const plans = [
    { code: 'student', name: 'Student', type: 'student' as const, monthly: 299, yearly: 2990, maxStudents: 1 },
    { code: 'coaching', name: 'Coaching Institute', type: 'coaching' as const, monthly: 4999, yearly: 49990, maxStudents: 200 },
    { code: 'school', name: 'School', type: 'school' as const, monthly: 14999, yearly: 149990, maxStudents: 500 },
    { code: 'enterprise', name: 'Enterprise', type: 'enterprise' as const, monthly: 49999, yearly: 499990, maxStudents: 5000 },
  ];

  for (const p of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { code: p.code },
      update: {},
      create: {
        code: p.code,
        name: p.name,
        type: p.type,
        priceMonthly: p.monthly,
        priceYearly: p.yearly,
        maxStudents: p.maxStudents,
        features: ['ai_tutor', 'erp', 'analytics'],
      },
    });
  }

  const schoolPlan = await prisma.subscriptionPlan.findUnique({ where: { code: 'school' } });
  if (schoolPlan) {
    const existingSub = await prisma.tenantSubscription.findFirst({
      where: { tenantId, planId: schoolPlan.id },
    });
    if (!existingSub) {
      await prisma.tenantSubscription.create({
        data: {
          tenantId,
          planId: schoolPlan.id,
          status: 'active',
          provider: 'manual',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 365 * 86400000),
        },
      });
    }
  }

  await prisma.coupon.upsert({
    where: { code: 'EDUAI20' },
    update: {},
    create: {
      code: 'EDUAI20',
      discountPct: 20,
      validFrom: new Date('2025-01-01'),
      validUntil: new Date('2026-12-31'),
    },
  });

  await prisma.tenantBranding.upsert({
    where: { tenantId },
    update: {},
    create: {
      tenantId,
      primaryColor: '#6366f1',
      secondaryColor: '#8b5cf6',
      emailFromName: 'EduAI Demo School',
    },
  });

  // Scaffold data
  await prisma.transportRoute.create({
    data: {
      tenantId,
      name: 'Route 1 — North Campus',
      vehicleNo: 'MH-12-AB-1234',
      driverName: 'Ramesh Kumar',
      stops: ['Gate A', 'Main Road', 'Sector 5'],
    },
  });

  await prisma.libraryBook.create({
    data: {
      tenantId,
      title: 'NCERT Mathematics Class 8',
      author: 'NCERT',
      isbn: '978-8174505124',
      copies: 10,
      available: 8,
    },
  });

  console.log('  ✅ Sprint 4 ERP seed complete');
}
