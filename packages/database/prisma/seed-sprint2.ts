import type { PrismaClient } from '@prisma/client';

export async function seedSprint2(prisma: PrismaClient, tenantId: string, studentUserId: string, parentUserId: string) {
  console.log('📚 Seeding Sprint 2 learning data...');

  const board = await prisma.board.upsert({
    where: { code: 'CBSE' },
    update: {},
    create: { code: 'CBSE', name: 'Central Board of Secondary Education', country: 'IN' },
  });

  const mathSubject = await prisma.subject.upsert({
    where: { boardId_classLevel_code: { boardId: board.id, classLevel: 8, code: 'MATH' } },
    update: {},
    create: {
      boardId: board.id,
      classLevel: 8,
      code: 'MATH',
      name: 'Mathematics',
      sortOrder: 1,
    },
  });

  const scienceSubject = await prisma.subject.upsert({
    where: { boardId_classLevel_code: { boardId: board.id, classLevel: 8, code: 'SCI' } },
    update: {},
    create: {
      boardId: board.id,
      classLevel: 8,
      code: 'SCI',
      name: 'Science',
      sortOrder: 2,
    },
  });

  const mathCh1 = await prisma.chapter.upsert({
    where: { id: '00000000-0000-4000-8000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-4000-8000-000000000001',
      subjectId: mathSubject.id,
      name: 'Rational Numbers',
      chapterNumber: 1,
      description: 'Introduction to rational numbers and their properties',
      sortOrder: 1,
    },
  });

  const mathCh2 = await prisma.chapter.upsert({
    where: { id: '00000000-0000-4000-8000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-4000-8000-000000000002',
      subjectId: mathSubject.id,
      name: 'Linear Equations',
      chapterNumber: 2,
      description: 'Solving linear equations in one variable',
      sortOrder: 2,
    },
  });

  const sciCh1 = await prisma.chapter.upsert({
    where: { id: '00000000-0000-4000-8000-000000000003' },
    update: {},
    create: {
      id: '00000000-0000-4000-8000-000000000003',
      subjectId: scienceSubject.id,
      name: 'Crop Production',
      chapterNumber: 1,
      description: 'Agricultural practices and crop management',
      sortOrder: 1,
    },
  });

  const mathCourse = await prisma.course.upsert({
    where: { id: '00000000-0000-4000-8000-000000000010' },
    update: {},
    create: {
      id: '00000000-0000-4000-8000-000000000010',
      tenantId,
      boardId: board.id,
      subjectId: mathSubject.id,
      title: 'Class 8 Mathematics — CBSE',
      description: 'Complete CBSE Class 8 Mathematics curriculum with videos, notes, and quizzes.',
      classLevel: 8,
      status: 'published',
      sortOrder: 1,
    },
  });

  const scienceCourse = await prisma.course.upsert({
    where: { id: '00000000-0000-4000-8000-000000000011' },
    update: {},
    create: {
      id: '00000000-0000-4000-8000-000000000011',
      tenantId,
      boardId: board.id,
      subjectId: scienceSubject.id,
      title: 'Class 8 Science — CBSE',
      description: 'Explore physics, chemistry, and biology concepts for Class 8.',
      classLevel: 8,
      status: 'published',
      sortOrder: 2,
    },
  });

  const lesson1 = await prisma.lesson.upsert({
    where: { id: '00000000-0000-4000-8000-000000000020' },
    update: {},
    create: {
      id: '00000000-0000-4000-8000-000000000020',
      tenantId,
      chapterId: mathCh1.id,
      title: 'What are Rational Numbers?',
      type: 'mixed',
      durationMinutes: 15,
      status: 'published',
      sortOrder: 1,
    },
  });

  const lesson2 = await prisma.lesson.upsert({
    where: { id: '00000000-0000-4000-8000-000000000021' },
    update: {},
    create: {
      id: '00000000-0000-4000-8000-000000000021',
      tenantId,
      chapterId: mathCh1.id,
      title: 'Properties of Rational Numbers',
      type: 'video',
      durationMinutes: 20,
      status: 'published',
      sortOrder: 2,
    },
  });

  const lesson3 = await prisma.lesson.upsert({
    where: { id: '00000000-0000-4000-8000-000000000022' },
    update: {},
    create: {
      id: '00000000-0000-4000-8000-000000000022',
      tenantId,
      chapterId: mathCh2.id,
      title: 'Introduction to Linear Equations',
      type: 'text',
      durationMinutes: 12,
      status: 'published',
      sortOrder: 1,
    },
  });

  const lesson4 = await prisma.lesson.upsert({
    where: { id: '00000000-0000-4000-8000-000000000023' },
    update: {},
    create: {
      id: '00000000-0000-4000-8000-000000000023',
      tenantId,
      chapterId: sciCh1.id,
      title: 'Agricultural Practices',
      type: 'mixed',
      durationMinutes: 18,
      status: 'published',
      sortOrder: 1,
    },
  });

  await prisma.lessonContent.upsert({
    where: { id: '00000000-0000-4000-8000-000000000030' },
    update: {},
    create: {
      id: '00000000-0000-4000-8000-000000000030',
      lessonId: lesson1.id,
      body: 'A rational number is any number that can be expressed as p/q where p and q are integers and q ≠ 0.',
      sortOrder: 1,
    },
  });

  await prisma.contentResource.createMany({
    data: [
      {
        lessonId: lesson1.id,
        type: 'video',
        title: 'Rational Numbers Explained',
        url: 'https://www.youtube.com/watch?v=example1',
        durationSecs: 600,
        sortOrder: 1,
      },
      {
        lessonId: lesson1.id,
        type: 'notes',
        title: 'Rational Numbers Notes',
        url: '/content/demo/rational-numbers-notes.pdf',
        sortOrder: 2,
      },
      {
        lessonId: lesson2.id,
        type: 'video',
        title: 'Properties Video',
        url: 'https://www.youtube.com/watch?v=example2',
        durationSecs: 900,
        sortOrder: 1,
      },
      {
        lessonId: lesson2.id,
        type: 'worksheet',
        title: 'Practice Worksheet',
        url: '/content/demo/rational-properties-worksheet.pdf',
        sortOrder: 2,
      },
    ],
    skipDuplicates: true,
  });

  const quiz = await prisma.quiz.upsert({
    where: { id: '00000000-0000-4000-8000-000000000040' },
    update: {},
    create: {
      id: '00000000-0000-4000-8000-000000000040',
      tenantId,
      lessonId: lesson1.id,
      title: 'Rational Numbers Quiz',
      timeLimitMinutes: 10,
      passingScore: 70,
      status: 'published',
    },
  });

  const q1 = await prisma.question.create({
    data: {
      quizId: quiz.id,
      type: 'mcq',
      stem: 'Which of the following is a rational number?',
      explanation: '1/2 can be written as p/q where p=1, q=2.',
      marks: 1,
      sortOrder: 1,
      options: {
        create: [
          { label: '√2', isCorrect: false, sortOrder: 1 },
          { label: '1/2', isCorrect: true, sortOrder: 2 },
          { label: 'π', isCorrect: false, sortOrder: 3 },
          { label: '√3', isCorrect: false, sortOrder: 4 },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      quizId: quiz.id,
      type: 'true_false',
      stem: 'Zero is a rational number.',
      explanation: 'Zero can be written as 0/1.',
      marks: 1,
      sortOrder: 2,
      options: {
        create: [
          { label: 'True', isCorrect: true, sortOrder: 1 },
          { label: 'False', isCorrect: false, sortOrder: 2 },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      quizId: quiz.id,
      type: 'fill_blank',
      stem: 'A rational number can be written in the form ___/q where q ≠ 0.',
      explanation: 'The numerator p must be an integer.',
      marks: 1,
      sortOrder: 3,
      metadata: { correctAnswers: ['p', 'P'] },
    },
  });

  await prisma.question.create({
    data: {
      quizId: quiz.id,
      type: 'multi_select',
      stem: 'Select all rational numbers:',
      explanation: 'Integers and fractions are rational.',
      marks: 2,
      sortOrder: 4,
      options: {
        create: [
          { label: '-5', isCorrect: true, sortOrder: 1 },
          { label: '3/4', isCorrect: true, sortOrder: 2 },
          { label: '√5', isCorrect: false, sortOrder: 3 },
          { label: '0.75', isCorrect: true, sortOrder: 4 },
        ],
      },
    },
  });

  void q1;

  await prisma.courseEnrollment.upsert({
    where: {
      tenantId_courseId_userId: {
        tenantId,
        courseId: mathCourse.id,
        userId: studentUserId,
      },
    },
    update: {},
    create: {
      tenantId,
      courseId: mathCourse.id,
      userId: studentUserId,
    },
  });

  await prisma.userXp.upsert({
    where: { userId: studentUserId },
    update: {},
    create: { tenantId, userId: studentUserId, totalXp: 150, currentLevel: 2 },
  });

  await prisma.userCoins.upsert({
    where: { userId: studentUserId },
    update: {},
    create: { tenantId, userId: studentUserId, balance: 25 },
  });

  await prisma.userStreak.upsert({
    where: { userId: studentUserId },
    update: {},
    create: {
      tenantId,
      userId: studentUserId,
      currentStreak: 3,
      longestStreak: 5,
      lastActivityDate: new Date(),
    },
  });

  const firstLessonBadge = await prisma.badge.upsert({
    where: { tenantId_code: { tenantId, code: 'first_lesson' } },
    update: {},
    create: {
      tenantId,
      code: 'first_lesson',
      name: 'First Steps',
      description: 'Complete your first lesson',
      criteria: { type: 'lessons_completed', count: 1 },
      xpReward: 50,
      category: 'learning',
    },
  });

  const quizMasterBadge = await prisma.badge.upsert({
    where: { tenantId_code: { tenantId, code: 'quiz_master' } },
    update: {},
    create: {
      tenantId,
      code: 'quiz_master',
      name: 'Quiz Master',
      description: 'Pass 5 quizzes with 80%+ score',
      criteria: { type: 'quizzes_passed', count: 5, minScore: 80 },
      xpReward: 100,
      category: 'assessment',
    },
  });

  void quizMasterBadge;

  await prisma.userBadge.upsert({
    where: {
      tenantId_userId_badgeId: {
        tenantId,
        userId: studentUserId,
        badgeId: firstLessonBadge.id,
      },
    },
    update: {},
    create: {
      tenantId,
      userId: studentUserId,
      badgeId: firstLessonBadge.id,
    },
  });

  await prisma.parentStudentLink.upsert({
    where: {
      tenantId_parentId_studentId: {
        tenantId,
        parentId: parentUserId,
        studentId: studentUserId,
      },
    },
    update: { status: 'verified', verifiedAt: new Date() },
    create: {
      tenantId,
      parentId: parentUserId,
      studentId: studentUserId,
      status: 'verified',
      verifiedAt: new Date(),
    },
  });

  await prisma.translation.createMany({
    data: [
      { tenantId, namespace: 'course', key: 'math.title', locale: 'hi', value: 'कक्षा 8 गणित — CBSE' },
      { tenantId, namespace: 'course', key: 'math.title', locale: 'mr', value: 'इयत्ता 8 गणित — CBSE' },
      { tenantId, namespace: 'course', key: 'science.title', locale: 'hi', value: 'कक्षा 8 विज्ञान — CBSE' },
      { tenantId, namespace: 'course', key: 'science.title', locale: 'mr', value: 'इयत्ता 8 विज्ञान — CBSE' },
    ],
    skipDuplicates: true,
  });

  void scienceCourse;
  void lesson3;
  void lesson4;

  console.log('✅ Sprint 2 seed complete — 2 courses, 4 lessons, 1 quiz, badges, parent link');
}
