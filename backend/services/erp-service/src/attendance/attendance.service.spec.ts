import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceService } from './attendance.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AttendanceService', () => {
  let service: AttendanceService;
  const mockPrisma = {
    academicClass: { findFirst: jest.fn() },
    attendanceRecord: { upsert: jest.fn(), findMany: jest.fn() },
    parentStudentLink: { findFirst: jest.fn() },
    logActivity: jest.fn(),
  };

  const user = {
    sub: 'teacher-1',
    email: 'teacher@test.in',
    tenantId: 'tenant-1',
    roles: ['teacher'] as const,
    permissions: ['attendance:write:class'],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get(AttendanceService);
    jest.clearAllMocks();
  });

  it('marks attendance for a class', async () => {
    mockPrisma.academicClass.findFirst.mockResolvedValue({ id: 'class-1' });
    mockPrisma.attendanceRecord.upsert.mockResolvedValue({ id: 'rec-1', status: 'present' });
    mockPrisma.logActivity.mockResolvedValue(undefined);

    const result = await service.markAttendance(user as never, {
      classId: 'class-1',
      date: '2025-06-21',
      entries: [{ studentId: 'student-1', status: 'present' }],
    });

    expect(result.records).toHaveLength(1);
    expect(mockPrisma.attendanceRecord.upsert).toHaveBeenCalled();
    expect(mockPrisma.logActivity).toHaveBeenCalled();
  });

  it('returns class attendance for a date', async () => {
    mockPrisma.attendanceRecord.findMany.mockResolvedValue([
      { id: 'rec-1', status: 'present', student: { firstName: 'Arjun' } },
    ]);

    const result = await service.getClassAttendance(user as never, 'class-1', '2025-06-21');
    expect(result.records).toHaveLength(1);
    expect(result.classId).toBe('class-1');
  });
});
