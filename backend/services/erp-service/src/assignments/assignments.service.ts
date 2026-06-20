import { Injectable, NotFoundException } from '@nestjs/common';
import { AssignmentStatus } from '@eduai/database';
import { PrismaService } from '../prisma/prisma.service';
import type { UserContext } from '../common/decorators';
import type { CreateAssignmentDto } from './dto/assignments.dto';

@Injectable()
export class AssignmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: UserContext, dto: CreateAssignmentDto) {
    const assignment = await this.prisma.assignment.create({
      data: {
        tenantId: user.tenantId,
        classId: dto.classId,
        teacherId: user.sub,
        title: dto.title,
        description: dto.description,
        dueDate: new Date(dto.dueDate),
        lessonId: dto.lessonId,
        status: dto.status ?? AssignmentStatus.published,
      },
    });

    await this.prisma.logActivity(user.tenantId, user.sub, 'assignment.create', 'assignment', assignment.id);

    return assignment;
  }

  async listByClass(user: UserContext, classId: string) {
    return this.prisma.assignment.findMany({
      where: { tenantId: user.tenantId, classId },
      orderBy: { dueDate: 'asc' },
    });
  }

  async listMine(user: UserContext) {
    return this.prisma.assignment.findMany({
      where: { tenantId: user.tenantId, teacherId: user.sub },
      include: { class: { select: { id: true, name: true, section: true } } },
      orderBy: { dueDate: 'desc' },
      take: 50,
    });
  }

  async getStudentHomework(user: UserContext, studentId: string) {
    const enrollments = await this.prisma.classEnrollment.findMany({
      where: { tenantId: user.tenantId, studentId, status: 'active' },
      select: { classId: true },
    });
    const classIds = enrollments.map((e) => e.classId);
    if (!classIds.length) return [];

    return this.prisma.assignment.findMany({
      where: {
        tenantId: user.tenantId,
        classId: { in: classIds },
        status: AssignmentStatus.published,
      },
      include: { class: { select: { name: true, section: true } } },
      orderBy: { dueDate: 'asc' },
    });
  }

  async publish(user: UserContext, id: string) {
    const assignment = await this.prisma.assignment.findFirst({
      where: { id, tenantId: user.tenantId, teacherId: user.sub },
    });
    if (!assignment) throw new NotFoundException('Assignment not found');

    return this.prisma.assignment.update({
      where: { id },
      data: { status: AssignmentStatus.published },
    });
  }
}
