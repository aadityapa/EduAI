import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LinkParentDto {
  @ApiProperty()
  @IsEmail()
  studentEmail!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  relationship?: string;
}
