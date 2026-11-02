export interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
}

export interface VerificationResult {
  success: boolean;
  verified: boolean;
  reference: string;
  amount: number;
  customer?: {
    name: string;
    email: string;
  };
  paidAt?: string;
  telegramUrl?: string;
  isTestMode?: boolean;
  error?: string;
}

export interface ModuleItem {
  id: string;
  number: string;
  title: string;
  description: string;
  topics: string[];
  duration: string;
  iconName: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}
