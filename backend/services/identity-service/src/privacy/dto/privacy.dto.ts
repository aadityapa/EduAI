import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum DsrTypeDto {
  access_export = 'access_export',
  erasure = 'erasure',
  correction = 'correction',
  restrict_processing = 'restrict_processing',
}

export enum DsrStatusDto {
  submitted = 'submitted',
  in_progress = 'in_progress',
  awaiting_verification = 'awaiting_verification',
  completed = 'completed',
  rejected = 'rejected',
  cancelled = 'cancelled',
}

export class CreateDsrDto {
  @ApiProperty({ enum: DsrTypeDto })
  @IsEnum(DsrTypeDto)
  type!: DsrTypeDto;

  @ApiPropertyOptional({
    description: 'Subject user id. Defaults to caller; parents may set linked child.',
  })
  @IsOptional()
  @IsUUID()
  subjectUserId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  purposeNote?: string;
}

export class UpdateDsrStatusDto {
  @ApiProperty({ enum: DsrStatusDto })
  @IsEnum(DsrStatusDto)
  status!: DsrStatusDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  resolutionNote?: string;
}
