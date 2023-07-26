import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { PaymentMethod } from './payment.interface';

@Controller('payments')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-intent')
  async createPaymentIntent(
    @Body()
    payload: {
      amount: number;
      currency: string;
      payment_method: PaymentMethod;
    },
  ): Promise<{ clientSecret: string }> {
    const { amount, currency, payment_method } = payload;

    const clientSecret = await this.stripeService.createPaymentIntent(
      amount,
      currency,
      payment_method,
    );

    return { clientSecret };
  }
}
