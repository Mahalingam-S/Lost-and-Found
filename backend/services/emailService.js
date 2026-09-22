const nodemailer = require('nodemailer');

let testAccount = null;
let transporter = null;

// Initialize email transporter with free auto-configured SMTP or environment credentials
const getTransporter = async () => {
  if (transporter) return transporter;

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587');

  if (emailUser && emailPass) {
    console.log(`[EMAIL SERVICE] Initializing SMTP Transport via ${smtpHost}...`);
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });
  } else {
    try {
      console.log('[EMAIL SERVICE] No custom SMTP credentials provided. Creating free zero-config test account...');
      testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.log(`[EMAIL SERVICE] Free Ethereal SMTP active. Test User: ${testAccount.user}`);
    } catch (err) {
      console.warn('[EMAIL SERVICE] Ethereal fallback failed, using jsonTransport fallback:', err.message);
      transporter = nodemailer.createTransport({
        jsonTransport: true
      });
    }
  }

  return transporter;
};

/**
 * Send 6-digit verification OTP email to student address or phone identifier
 */
const sendOTPEmail = async (recipient, otp) => {
  try {
    const transport = await getTransporter();
    const isEmail = recipient.includes('@');
    const targetAddress = isEmail ? recipient.trim() : `${recipient.trim().replace(/\D/g, '')}@campus-lost-found.edu`;

    const mailOptions = {
      from: `"Campus Lost & Found Auth" <${process.env.EMAIL_USER || 'no-reply@campus-lost-found.edu'}>`,
      to: isEmail ? targetAddress : (process.env.ADMIN_EMAIL || 'student@campus-lost-found.edu'),
      subject: `🔐 Your 6-Digit Verification Code: ${otp}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="display: inline-block; width: 56px; height: 56px; line-height: 56px; border-radius: 16px; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; font-size: 26px; font-weight: bold;">
              🔑
            </div>
            <h2 style="color: #0f172a; margin: 12px 0 4px; font-size: 22px; font-weight: 800;">Campus Lost & Found</h2>
            <p style="color: #64748b; font-size: 14px; margin: 0;">Verification Security Code</p>
          </div>

          <div style="background: #f8fafc; border-radius: 12px; padding: 20px; text-align: center; border: 1px solid #e2e8f0; margin-bottom: 20px;">
            <p style="color: #475569; font-size: 13px; font-weight: 600; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.5px;">Your 6-Digit Verification Code</p>
            <div style="font-size: 32px; font-weight: 900; color: #4f46e5; letter-spacing: 6px; margin: 8px 0;">
              ${otp}
            </div>
            <p style="color: #94a3b8; font-size: 12px; margin: 6px 0 0;">⏱️ Valid for 5 minutes. Do not share this code with anyone.</p>
          </div>

          <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin-bottom: 16px;">
            This verification code was requested for logging in to <strong>Campus Lost & Found</strong> for account <strong style="color: #0f172a;">${recipient}</strong>.
          </p>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />

          <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">
            © 2026 Campus Lost & Found System • Amrita Vishwa Vidyapeetham
          </p>
        </div>
      `
    };

    const info = await transport.sendMail(mailOptions);
    console.log(`[EMAIL SENT SUCCESS] Target: ${recipient} | OTP: ${otp} | MessageId: ${info.messageId}`);
    
    if (testAccount && info.messageId) {
      console.log(`[ETHEREAL PREVIEW URL] ${nodemailer.getTestMessageUrl(info)}`);
    }

    return { success: true, messageId: info.messageId, previewUrl: testAccount ? nodemailer.getTestMessageUrl(info) : null };
  } catch (err) {
    console.error('[EMAIL SERVICE ERROR]', err.message);
    return { success: false, error: err.message };
  }
};

module.exports = { sendOTPEmail };
