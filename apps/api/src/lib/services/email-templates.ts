export const verificationTemplate = (url: string) => `
<div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
  <h2 style="color: #1d9bf0;">Verify your email address</h2>
  <p>Thanks for joining X Clone! Please click the button below to confirm your email address and activate your account.</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="${url}" style="background-color: #1d9bf0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 9999px; font-weight: bold;">Verify Email</a>
  </div>
  <p style="font-size: 12px; color: #666;">If the button doesn't work, copy and paste this link into your browser:</p>
  <p style="font-size: 12px; color: #1d9bf0; word-break: break-all; overflow-wrap: break-word;">${url}</p>
  <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
  <p style="font-size: 12px; color: #999;">This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
</div>
`;

export const resetPasswordTemplate = (url: string) => `
<div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
  <h2 style="color: #1d9bf0;">Reset Your Password</h2>
  <p>We received a request to reset your password. Click the button below to set a new password for your account.</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="${url}" style="background-color: #1d9bf0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 9999px; font-weight: bold;">Reset Password</a>
  </div>
  <p style="font-size: 12px; color: #666;">If the button doesn't work, copy and paste this link into your browser:</p>
  <p style="font-size: 12px; color: #1d9bf0; word-break: break-all; overflow-wrap: break-word;">${url}</p>
  <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
  <p style="font-size: 12px; color: #999;">This link will expire in 15 minutes. If you didn't request a password reset, you can safely ignore this email.</p>
</div>
`;
