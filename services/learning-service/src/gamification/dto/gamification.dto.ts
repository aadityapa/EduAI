import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InternalAwardDto {
  @ApiProperty()
  @IsUUID()
  tenantId!: string;

  @ApiProperty()
  @IsUUID()
  userId!: string;

  @ApiProperty({ enum: ['lesson_complete', 'quiz_pass'] })
  @IsEnum(['lesson_complete', 'quiz_pass'])
  eventType!: 'lesson_complete' | 'quiz_pass';

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  resourceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  score?: number;
}

export class LinkParentDto {
  @ApiProperty()
  @IsString()
  studentEmail!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  relationship?: string;
}
