import { IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class HubQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  boardId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  classLevel?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  subjectId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  chapterId?: string;
}
