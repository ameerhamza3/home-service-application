export interface PaymentMethod {
  card: {
    number: string;
    exp_month: number;
    exp_year: number;
    cvc: string;
  };
}
