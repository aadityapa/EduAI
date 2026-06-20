import { IsInt, IsObject, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SubmitQuizAttemptDto {
  @ApiProperty({ description: 'Map of questionId to answer value' })
  @IsObject()
  answers!: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  timeSpent?: number;
}
