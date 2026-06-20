import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HomeworkAnalyzeDto {
  @ApiPropertyOptional({ description: 'Homework text to analyze' })
  @IsOptional()
  @IsString()
  @MaxLength(8000)
  text?: string;

  @ApiPropertyOptional({ description: 'Image URL for OCR (stub in Sprint 3)' })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
