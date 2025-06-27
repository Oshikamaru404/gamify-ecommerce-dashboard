
interface CryptomusInvoiceRequest {
  amount: string;
  currency: string;
  order_id: string;
  url_return: string;
  url_success: string;
  url_callback: string;
  is_payment_multiple: boolean;
  lifetime: number;
  to_currency?: string;
}

interface CryptomusInvoiceResponse {
  state: number;
  result?: {
    uuid: string;
    order_id: string;
    amount: string;
    payment_amount?: string;
    payer_amount?: string;
    discount_percent?: string;
    discount?: string;
    payer_currency: string;
    currency: string;
    comments?: string;
    merchant_amount: string;
    network?: string;
    address?: string;
    from?: string;
    txid?: string;
    payment_status: string;
    url: string;
    expired_at: number;
    status: string;
    is_final: boolean;
    additional_data?: string;
    created_at: string;
    updated_at: string;
  };
  errors?: Record<string, string[]>;
}

export class CryptomusService {
  private readonly apiUrl = 'https://api.cryptomus.com/v1';
  private readonly merchantId: string;
  private readonly apiKey: string;

  constructor(merchantId: string, apiKey: string) {
    this.merchantId = merchantId;
    this.apiKey = apiKey;
  }

  private generateSign(data: any): string {
    const jsonString = JSON.stringify(data);
    const base64Data = btoa(jsonString);
    return btoa(base64Data + this.apiKey);
  }

  async createInvoice(invoiceData: CryptomusInvoiceRequest): Promise<CryptomusInvoiceResponse> {
    const sign = this.generateSign(invoiceData);
    
    const response = await fetch(`${this.apiUrl}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'merchant': this.merchantId,
        'sign': sign,
      },
      body: JSON.stringify(invoiceData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async getPaymentInfo(uuid: string): Promise<CryptomusInvoiceResponse> {
    const data = { uuid };
    const sign = this.generateSign(data);
    
    const response = await fetch(`${this.apiUrl}/payment/info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'merchant': this.merchantId,
        'sign': sign,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
}

export const createCryptomusInvoice = async (
  packageData: any,
  customerInfo: any,
  merchantId: string,
  apiKey: string
) => {
  const cryptomus = new CryptomusService(merchantId, apiKey);
  
  const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const baseUrl = window.location.origin;
  
  const invoiceRequest: CryptomusInvoiceRequest = {
    amount: packageData.price.toString(),
    currency: 'EUR',
    order_id: orderId,
    url_return: `${baseUrl}/payment/return`,
    url_success: `${baseUrl}/payment/success`,
    url_callback: `${baseUrl}/api/cryptomus/callback`,
    is_payment_multiple: false,
    lifetime: 3600, // 1 hour
    to_currency: 'USDT', // Convert to USDT for crypto payment
  };

  return await cryptomus.createInvoice(invoiceRequest);
};
