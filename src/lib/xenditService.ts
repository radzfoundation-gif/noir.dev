const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface XenditPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  description: string;
  priceIdr: string;
}

export interface XenditInvoiceResponse {
  success: boolean;
  invoiceId: string;
  invoiceUrl: string;
  externalId: string;
}

export interface InvoiceStatus {
  invoice: {
    id: string;
    externalId: string;
    status: string;
    amount: number;
    currency: string;
  };
}

export const xenditService = {
  async getPlans(): Promise<XenditPlan[]> {
    const response = await fetch(`${API_URL}/api/xendit/plans`);
    if (!response.ok) {
      throw new Error('Failed to fetch plans');
    }
    const data = await response.json();
    return data.plans;
  },

  async createInvoice(
    planId: string,
    email: string,
    name: string
  ): Promise<XenditInvoiceResponse> {
    const response = await fetch(`${API_URL}/api/xendit/create-invoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ planId, email, name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create invoice');
    }

    return response.json();
  },

  async getInvoiceStatus(externalId: string): Promise<InvoiceStatus> {
    const response = await fetch(`${API_URL}/api/xendit/invoice/${externalId}`);
    if (!response.ok) {
      throw new Error('Failed to get invoice status');
    }
    return response.json();
  },

  openXenditCheckout(invoiceUrl: string): void {
    window.open(invoiceUrl, '_blank', 'width=600,height=800');
  },

  redirectToXendit(invoiceUrl: string): void {
    window.location.href = invoiceUrl;
  },
};

export default xenditService;
