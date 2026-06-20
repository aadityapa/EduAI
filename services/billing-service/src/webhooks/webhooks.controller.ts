import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
    @Body() body: Record<string, unknown>,
    @Headers('stripe-signature') signature: string,
  ) {
    return apiResponse(await this.webhooksService.handleStripeWebhook(body, signature ?? ''));
  }

  @Post('razorpay')
  @Public()
  async razorpay(@Body() body: Record<string, unknown>) {
    return apiResponse(await this.webhooksService.handleRazorpayWebhook(body));
  }
}
