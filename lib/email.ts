import nodemailer from "nodemailer";

/**
 * Email Transporter Configuration
 * Adapted from teammate's email system
 * Using Gmail SMTP
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send Email Verification
 */
export async function sendVerificationEmail(
  email: string,
  firstName: string,
  token: string
) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Accenprove - Berita Acara Digital" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "✉️ Verifikasi Email Anda - Accenprove",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #13686D 0%, #1a8a90 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Accenprove</h1>
          <p style="color: #e0f2f3; margin: 5px 0 0;">Sistem Berita Acara Digital</p>
        </div>
        <div style="background: white; padding: 40px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #13686D; margin-top: 0;">Halo, ${firstName}!</h2>
          <p style="color: #333; line-height: 1.6;">Terima kasih telah mendaftar di <strong>Accenprove</strong>. Silakan klik tombol di bawah untuk memverifikasi email Anda:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="display: inline-block; background-color: #13686D; color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Verifikasi Email
            </a>
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">Atau copy link berikut ke browser Anda:</p>
          <p style="color: #13686D; word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 5px; font-size: 13px;">${verificationUrl}</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px; text-align: center;">Jika Anda tidak mendaftar di Accenprove, abaikan email ini.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email verifikasi berhasil dikirim ke:", email);
  } catch (error) {
    console.error("❌ Gagal mengirim email verifikasi:", error);
    throw error;
  }
}

/**
 * Send Password Reset Email
 */
export async function sendResetPasswordEmail(
  email: string,
  firstName: string,
  token: string
) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"Accenprove - Berita Acara Digital" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🔑 Reset Password - Accenprove",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Reset Password</h1>
        </div>
        <div style="background: white; padding: 40px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
          <p style="color: #333; line-height: 1.6;">Halo, <strong>${firstName}</strong>!</p>
          <p style="color: #333; line-height: 1.6;">Kami menerima permintaan untuk reset password akun Anda di Accenprove. Klik tombol di bawah untuk melanjutkan:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="display: inline-block; background-color: #dc2626; color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Reset Password
            </a>
          </div>
          <div style="background: #fff3cd; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <p style="color: #856404; margin: 0; font-weight: bold;">⚠️ Link ini akan kadaluarsa dalam 1 jam.</p>
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">Atau copy link berikut ke browser Anda:</p>
          <p style="color: #dc2626; word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 5px; font-size: 13px;">${resetUrl}</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px; text-align: center;">Jika Anda tidak meminta reset password, abaikan email ini.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email reset password berhasil dikirim ke:", email);
  } catch (error) {
    console.error("❌ Gagal mengirim email reset password:", error);
    throw error;
  }
}

/**
 * Send New Device Login Notification
 */
export async function sendNewDeviceLoginEmail(
  email: string,
  firstName: string,
  deviceInfo: string,
  ipAddress: string
) {
  const mailOptions = {
    from: `"Accenprove Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🔔 Login dari Perangkat Baru - Accenprove",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #fb923c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🔔 Aktivitas Login Terdeteksi</h1>
        </div>
        <div style="background: white; padding: 40px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
          <p style="color: #333; line-height: 1.6;">Halo, <strong>${firstName}</strong>!</p>
          <p style="color: #333; line-height: 1.6;">Kami mendeteksi login dari perangkat baru ke akun Accenprove Anda:</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 8px 0; color: #333;"><strong>Perangkat:</strong> ${deviceInfo}</p>
            <p style="margin: 8px 0; color: #333;"><strong>IP Address:</strong> ${ipAddress}</p>
            <p style="margin: 8px 0; color: #333;"><strong>Waktu:</strong> ${new Date().toLocaleString("id-ID")}</p>
          </div>
          <p style="color: #333; line-height: 1.6;">Jika ini adalah Anda, tidak perlu melakukan apa-apa.</p>
          <div style="background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <p style="color: #991b1b; margin: 0; font-weight: bold;">⚠️ Jika Anda tidak mengenali aktivitas ini, segera ubah password Anda!</p>
          </div>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px; text-align: center;">Email otomatis dari sistem keamanan Accenprove.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email notifikasi login berhasil dikirim ke:", email);
  } catch (error) {
    console.error("❌ Gagal mengirim email notifikasi login:", error);
    // Don't throw - login should succeed even if email fails
  }
}

/**
 * Send Password Changed Confirmation
 */
export async function sendPasswordChangedEmail(
  email: string,
  firstName: string
) {
  const mailOptions = {
    from: `"Accenprove Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "✅ Password Berhasil Diubah - Accenprove",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">✅ Password Diubah</h1>
        </div>
        <div style="background: white; padding: 40px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
          <p style="color: #333; line-height: 1.6;">Halo, <strong>${firstName}</strong>!</p>
          <p style="color: #333; line-height: 1.6;">Password akun Accenprove Anda telah berhasil diubah pada:</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; color: #13686D; font-weight: bold; font-size: 16px;">${new Date().toLocaleString("id-ID")}</p>
          </div>
          <div style="background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <p style="color: #991b1b; margin: 0;">Jika Anda tidak melakukan perubahan ini, segera hubungi administrator!</p>
          </div>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px; text-align: center;">Email konfirmasi dari sistem keamanan Accenprove.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email konfirmasi password berhasil dikirim ke:", email);
  } catch (error) {
    console.error("❌ Gagal mengirim email konfirmasi password:", error);
  }
}
