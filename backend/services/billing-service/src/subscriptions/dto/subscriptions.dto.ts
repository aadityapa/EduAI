import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class StartTrialDto {
  @ApiProperty({ example: 'starter' })
  @IsString()
  @IsNotEmpty()
  planCode!: string;

  @ApiPropertyOptional({ default: 14, minimum: 1, maximum: 90 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(90)
  trialDays?: number;
}

export class UsageBillingDto {
  @ApiProperty({ description: 'Token count used in the billing window (amount computed server-side)' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  tokensUsed!: number;
}

export class RenewSubscriptionDto {
  @ApiPropertyOptional({ description: 'Optional coupon; discount applied server-side' })
  @IsOptional()
  @IsString()
  couponCode?: string;
}

export class CancelSubscriptionDto {
  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  immediate?: boolean;
}

export class ChangePlanDto {
  @ApiProperty({ example: 'professional' })
  @IsString()
  @IsNotEmpty()
  planCode!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  couponCode?: string;
}
