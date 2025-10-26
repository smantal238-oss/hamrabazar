// SMS Service for sending real SMS to users
export class SMSService {
  private static instance: SMSService;
  
  static getInstance(): SMSService {
    if (!SMSService.instance) {
      SMSService.instance = new SMSService();
    }
    return SMSService.instance;
  }

  async sendSMS(phone: string, message: string): Promise<boolean> {
    try {
      // For development, log to console
      if (process.env.NODE_ENV === 'development') {
        console.log(`📱 SMS to ${phone}: ${message}`);
        return true;
      }

      // In production, integrate with actual SMS provider
      // Example: Twilio, AWS SNS, or local SMS gateway
      
      // Placeholder for actual SMS implementation
      console.log(`Sending SMS to ${phone}: ${message}`);
      
      return true;
    } catch (error) {
      console.error('SMS sending failed:', error);
      return false;
    }
  }

  async send2FACode(phone: string, code: string): Promise<boolean> {
    const message = `کد تایید شما: ${code}\nاین کد تا 5 دقیقه معتبر است.`;
    return this.sendSMS(phone, message);
  }
}