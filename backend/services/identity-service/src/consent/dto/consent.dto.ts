import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ConsentPurposeDto {
  account_core = 'account_core',
  learning_analytics = 'learning_analytics',
  ai_tutor = 'ai_tutor',
  marketing = 'marketing',
  third_party_sharing = 'third_party_sharing',
  parental_oversight = 'parental_oversight',
}

export enum ParentalVerifyMethodDto {
  email_otp = 'email_otp',
  in_person = 'in_person',
  school_attestation = 'school_attestation',
  digital_signature = 'digital_signature',
}

export class GrantConsentDto {
  @ApiProperty({ enum: ConsentPurposeDto })
  @IsEnum(ConsentPurposeDto)
  purpose!: ConsentPurposeDto;

  @ApiPropertyOptional({
    description: 'Subject user id. Defaults to caller. Required when granting for a linked child.',
  })
  @IsOptional()
  @IsUUID()
  subjectUserId?: string;

  @ApiPropertyOptional({ enum: ParentalVerifyMethodDto })
  @IsOptional()
  @IsEnum(ParentalVerifyMethodDto)
  parentalMethod?: ParentalVerifyMethodDto;

  @ApiPropertyOptional({ description: 'Policy version string, e.g. 2026.07' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  policyVersion?: string;
}

export class VerifyParentalConsentDto {
  @ApiProperty({ description: 'OTP or attestation token issued at grant time' })
  @IsString()
  @MinLength(4)
  @MaxLength(64)
  code!: string;
}

export class WithdrawConsentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
