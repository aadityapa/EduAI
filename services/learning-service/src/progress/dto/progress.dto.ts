import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { LessonProgressStatus } from '@eduai/database';

export class UpdateLessonProgressDto {
  @ApiPropertyOptional({ enum: LessonProgressStatus })
  @IsOptional()
  @IsEnum(LessonProgressStatus)
  status?: LessonProgressStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  timeSpent?: number;
}
