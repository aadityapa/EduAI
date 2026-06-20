import { IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TutorChatDto {
  @ApiProperty({ description: 'User message to the AI tutor' })
  @IsString()
  @MaxLength(4000)
  message!: string;

  @ApiPropertyOptional({ description: 'Existing conversation ID to continue' })
  @IsOptional()
  @IsUUID()
  conversationId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  lessonId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  subjectId?: string;

  @ApiPropertyOptional({ description: 'Student class level (1-10)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  classLevel?: number;

  @ApiPropertyOptional({ description: 'Response language: en, hi, mr' })
  @IsOptional()
  @IsString()
  language?: string;
}
