import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateQuestionsDto {
  @ApiProperty({ example: 'Mathematics' })
  @IsString()
  @MaxLength(100)
  subject!: string;

  @ApiProperty({ example: 'Linear Equations' })
  @IsString()
  @MaxLength(200)
  topic!: string;

  @ApiProperty({ example: 8 })
  @IsInt()
  @Min(1)
  @Max(12)
  classLevel!: number;

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  @Max(20)
  count!: number;

  @ApiPropertyOptional({ enum: ['easy', 'medium', 'hard'] })
  @IsOptional()
  @IsEnum(['easy', 'medium', 'hard'])
  difficulty?: 'easy' | 'medium' | 'hard';

  @ApiPropertyOptional({ example: ['mcq', 'true_false'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  questionTypes?: Array<'mcq' | 'true_false' | 'short_answer'>;
}

export class GenerateMockTestDto {
  @ApiProperty({ example: 'Science' })
  @IsString()
  @MaxLength(100)
  subject!: string;

  @ApiProperty({ example: 'Photosynthesis' })
  @IsString()
  @MaxLength(200)
  topic!: string;

  @ApiProperty({ example: 8 })
  @IsInt()
  @Min(1)
  @Max(12)
  classLevel!: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(5)
  @Max(50)
  questionCount!: number;

  @ApiProperty({ example: 45 })
  @IsInt()
  @Min(15)
  @Max(180)
  durationMinutes!: number;

  @ApiPropertyOptional({ enum: ['easy', 'medium', 'hard'] })
  @IsOptional()
  @IsEnum(['easy', 'medium', 'hard'])
  difficulty?: 'easy' | 'medium' | 'hard';
}

export class EvaluateMockTestDto {
  @ApiProperty()
  questions!: Array<{
    type: string;
    stem: string;
    options?: Array<{ label: string; isCorrect: boolean }>;
    explanation?: string;
    marks: number;
  }>;

  @ApiProperty({ example: { q0: '4', q1: 'True' } })
  answers!: Record<string, string>;
}
