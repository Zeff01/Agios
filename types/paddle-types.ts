export interface CheckoutTypes {
  allowedPaymentMethods: string[];
  settings: {
    displayMode: string;
    theme: string;
    locale: string;
  };
  items: { priceId: string; quantity: number }[];
  customData: { [key: string]: any };
  successUrl: string;
  customer: { email: string };
}
