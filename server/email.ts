import nodemailer from 'nodemailer';

export class EmailService {
  private static instance: EmailService;
  private transporter: any;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async sendVerificationCode(email: string, code: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'کد تایید همراه بازار',
        html: `
          <div dir="rtl" style="font-family: Tahoma, Arial; padding: 20px; background: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
              <h2 style="color: #333; text-align: center;">همراه بازار</h2>
              <p style="font-size: 16px; color: #666;">سلام،</p>
              <p style="font-size: 16px; color: #666;">کد تایید شما:</p>
              <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 5px;">
                ${code}
              </div>
              <p style="font-size: 14px; color: #999;">این کد تا 5 دقیقه معتبر است.</p>
              <p style="font-size: 14px; color: #999;">اگر شما این درخواست را نداده اید، این ایمیل را نادیده بگیرید.</p>
            </div>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Verification code sent to ${email}`);
      return true;
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      return false;
    }
  }

  async sendPasswordReset(email: string, code: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'بازیابی رمز عبور - همراه بازار',
        html: `
          <div dir="rtl" style="font-family: Tahoma, Arial; padding: 20px; background: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
              <h2 style="color: #333; text-align: center;">بازیابی رمز عبور</h2>
              <p style="font-size: 16px; color: #666;">سلام،</p>
              <p style="font-size: 16px; color: #666;">کد بازیابی رمز عبور شما:</p>
              <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 5px;">
                ${code}
              </div>
              <p style="font-size: 14px; color: #999;">این کد تا 5 دقیقه معتبر است.</p>
              <p style="font-size: 14px; color: #999;">اگر شما این درخواست را نداده اید، این ایمیل را نادیده بگیرید.</p>
            </div>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Password reset code sent to ${email}`);
      return true;
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      return false;
    }
  }
}
