import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentMethod } from './payment.interface';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(
      'sk_test_51M9OtwLTldm4L6OsyppIIJAZAafOolhVLAuf1ysiY0l2OnfmcI25HbdcTJMRPK1a9lmTPcqEGZzE0WRcq2Qfl1V80066Xw8oC1',
      {
        apiVersion: '2022-11-15',
      },
    );
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    payment_method: PaymentMethod,
  ): Promise<string> {
    try {
      const createdPaymentMethod = await this.stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: payment_method.card.number,
          exp_month: payment_method.card.exp_month,
          exp_year: payment_method.card.exp_year,
          cvc: payment_method.card.cvc,
        },
      });

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
        payment_method_types: ['card'],
        payment_method: createdPaymentMethod.id,
        confirm: true,
      });

      return paymentIntent.client_secret;
    } catch (error) {
      throw new Error(error);
    }
  }
}
