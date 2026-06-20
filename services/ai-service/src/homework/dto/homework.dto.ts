import { IsOptional, IsString, IsUrl, IsUUID, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class HomeworkAnalyzeDto {
  @ApiPropertyOptional({ description: 'Homework text to analyze' })
  @IsOptional()
  @IsString()
  @MaxLength(8000)
  text?: string;

  @ApiPropertyOptional({ description: 'Image URL for OCR' })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'PDF URL for text extraction' })
  @IsOptional()
  @IsUrl()
  pdfUrl?: string;

  @ApiPropertyOptional({ description: 'Existing conversation ID' })
  @IsOptional()
  @IsUUID()
  conversationId?: string;
}
