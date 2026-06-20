import { IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { AssignmentStatus } from '@eduai/database';

export class CreateAssignmentDto {
  @IsUUID()
  classId!: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  dueDate!: string;

  @IsOptional()
  @IsUUID()
  lessonId?: string;

  @IsOptional()
  @IsEnum(AssignmentStatus)
  status?: AssignmentStatus;
}
