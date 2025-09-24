export interface IEmailService {
  sendPasswordReset(email: string, token: string): Promise<void>;
}

export const EMAIL_SERVICE = 'EMAIL_SERVICE';
