import {
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PlannerGenerateDto {
  @ApiProperty({ example: ['Mathematics', 'Science'] })
  @IsArray()
  @IsString({ each: true })
  subjects!: string[];

  @ApiProperty({ example: 'Prepare for mid-term exams' })
  @IsString()
  @MaxLength(500)
  goals!: string;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(1)
  @Max(40)
  availableHoursPerWeek!: number;

  @ApiPropertyOptional({ example: '2026-03-15' })
  @IsOptional()
  @IsDateString()
  examDate?: string;

  @ApiPropertyOptional({ example: 8 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  classLevel?: number;
}
