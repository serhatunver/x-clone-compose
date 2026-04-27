import nodemailer from 'nodemailer';
import { config } from '#/config/config.js';
import { logger } from '#/lib/utils/logger.js';
import { emailQueue } from '#/lib/queues/email.queue.js';
import { verificationTemplate, resetPasswordTemplate } from './email-templates.js';

const transporter = nodemailer.createTransport({
  host: config.services.email.host,
  port: config.services.email.port,
  auth: {
    user: config.services.email.user,
    pass: config.services.email.pass,
  },
});

export const emailService = {
  async queueEmail(data: { to: string; subject: string; html: string }) {
    await emailQueue.add('send-email', data);
  },

  async sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
    const from = `X Clone <${config.services.email.fromEmail || 'noreply@xclone.com'}>`;

    try {
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        html,
      });

      logger.info(
        { msgId: info.messageId, to, subject, response: info.response },
        'Email sent successfully',
      );
      return info;
    } catch (err) {
      logger.error({ err, to, subject }, 'Email sending failed');
      throw err;
    }
  },

  /**
   * Sends a verification email to the user with a link containing the verification token.
   * The link directs the user to the client application where they can verify their email address.
   * @param email - The recipient's email address
   * @param token - The verification token to be included in the email link
   */
  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${config.app.clientUrl}/verify-email?token=${token}`;

    return this.queueEmail({
      to: email,
      subject: 'Verify your account - X Clone',
      html: verificationTemplate(verificationUrl),
    });
  },

  /**
   * Sends a password reset email to the user with a link containing the reset token.
   * The link directs the user to the client application where they can set a new password.
   * @param email - The recipient's email address
   * @param token - The password reset token to be included in the email link
   */
  async sendResetPasswordEmail(email: string, token: string) {
    const resetUrl = `${config.app.clientUrl}/reset-password?token=${token}`;

    return this.queueEmail({
      to: email,
      subject: 'Reset your password - X Clone',
      html: resetPasswordTemplate(resetUrl),
    });
  },
};
