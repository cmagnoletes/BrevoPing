export interface BrevoContactAttributes {
  [key: string]: unknown;
}

export interface BrevoContact {
  id?: string | number;
  email?: string;
  createdAt?: string;
  listIds?: number[];
  attributes?: BrevoContactAttributes;
  [key: string]: unknown;
}

export interface BrevoWebhookPayload {
  contact?: BrevoContact;
  [key: string]: unknown;
}
