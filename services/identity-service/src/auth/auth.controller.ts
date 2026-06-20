import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Ip,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  LoginDto,
  OtpLoginDto,
  RefreshTokenDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { apiResponse } from '../common/response.util';
import { CurrentUser, Public } from '../common/decorators';
import { JwtAuthGuard } from '../common/guards';
import type { UserContext } from '../common/decorators';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  @Throttle({ auth: { limit: 5, ttl: 900000 } })
  @ApiHeader({ name: 'X-Tenant-Id', required: false })
  async login(
    @Body() dto: LoginDto,
    @Headers('x-tenant-id') tenantId: string | undefined,
    @Ip() ip: string,
  ) {
    const data = await this.authService.login(dto, tenantId, ip);
    return apiResponse(data);
  }

  @Public()
  @Post('register')
  @Throttle({ auth: { limit: 10, ttl: 3600000 } })
  @ApiHeader({ name: 'X-Tenant-Id', required: false })
  async register(
    @Body() dto: RegisterDto,
    @Headers('x-tenant-id') tenantId: string | undefined,
    @Ip() ip: string,
  ) {
    const data = await this.authService.register(dto, tenantId, ip);
    return apiResponse(data);
  }

  @Public()
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() dto: RefreshTokenDto) {
    const data = await this.authService.refresh(dto.refreshToken);
    return apiResponse(data);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async logout(@CurrentUser() user: UserContext, @Body() body: { refresh_token?: string }) {
    const data = await this.authService.logout(user.sub, body.refresh_token);
    return apiResponse(data);
  }

  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async logoutAll(@CurrentUser() user: UserContext) {
    const data = await this.authService.logoutAll(user.sub);
    return apiResponse(data);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return apiResponse({
      message: 'If the email exists, a reset link will be sent.',
      email: dto.email,
    });
  }

  @Public()
  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Body() _dto: ResetPasswordDto) {
    return apiResponse({ message: 'Password reset stub — Sprint 2 implementation' });
  }

  @Public()
  @Post('login/otp')
  @HttpCode(200)
  async otpLogin(@Body() dto: OtpLoginDto) {
    return apiResponse({
      message: 'OTP login placeholder',
      email: dto.email,
      otp_sent: !dto.otp,
      verified: false,
    });
  }

  @Public()
  @Post('login/google')
  @HttpCode(501)
  async googleLogin() {
    return apiResponse({ message: 'Google OAuth stub — configure GOOGLE_CLIENT_ID in Sprint 2' });
  }

  @Public()
  @Post('login/apple')
  @HttpCode(501)
  async appleLogin() {
    return apiResponse({ message: 'Apple OAuth stub — configure APPLE_CLIENT_ID in Sprint 2' });
  }
}
