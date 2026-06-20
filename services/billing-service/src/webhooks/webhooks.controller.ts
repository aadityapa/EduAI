import { Body, Controller, Headers, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { WebhooksService } from './webhooks.service';
import { Public } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('stripe')
  @Public()
  async stripe(
    @Req() req: Request,
    @Body() body: Record<string, unknown>,
    @Headers('stripe-signature') signature: string,
  ) {
    const rawBody =
      typeof req.body === 'string'
        ? req.body
        : JSON.stringify(body);
    return apiResponse(
      await this.webhooksService.handleStripeWebhook(rawBody, body, signature ?? ''),
    );
  }

  @Post('razorpay')
  @Public()
  async razorpay(
    @Req() req: Request,
    @Body() body: Record<string, unknown>,
    @Headers('x-razorpay-signature') signature: string,
  ) {
    const rawBody =
      typeof req.body === 'string'
        ? req.body
        : JSON.stringify(body);
    return apiResponse(
      await this.webhooksService.handleRazorpayWebhook(rawBody, body, signature ?? ''),
    );
  }
}
