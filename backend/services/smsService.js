const https = require('https');

/**
 * Send real SMS to mobile number via configured SMS Gateway Provider
 * Supports Fast2SMS (India), 2Factor.in (India), and Twilio (Global).
 */
const sendSMS = async (phone, otp) => {
  const cleanPhone = (phone || '').replace(/\D/g, '');
  // Format for Indian 10-digit mobile number
  const indianMobile = cleanPhone.length > 10 ? cleanPhone.slice(-10) : cleanPhone;

  // 1. Fast2SMS Integration (Popular Indian SMS Gateway)
  const fast2smsKey = (process.env.FAST2SMS_API_KEY || '').trim();
  if (fast2smsKey) {
    try {
      console.log(`[SMS SERVICE] Dispatching SMS via Fast2SMS to +91 ${indianMobile}...`);
      
      // Fast2SMS GET OTP Endpoint
      const fast2smsUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=${encodeURIComponent(fast2smsKey)}&route=otp&variables_values=${encodeURIComponent(otp)}&flash=0&numbers=${encodeURIComponent(indianMobile)}`;

      return new Promise((resolve) => {
        https.get(fast2smsUrl, (res) => {
          let data = '';
          res.on('data', chunk => { data += chunk; });
          res.on('end', () => {
            console.log(`[FAST2SMS API RESPONSE] Status: ${res.statusCode} | Body: ${data}`);
            try {
              const parsed = JSON.parse(data);
              if (parsed.return === true || parsed.status_code === 200) {
                return resolve({ success: true, provider: 'Fast2SMS', raw: data });
              }
            } catch (e) {}

            // Fallback POST payload with Quick SMS Route
            console.log('[SMS SERVICE] Fast2SMS GET OTP returned non-true, attempting Quick Transactional Route POST...');
            const postPayload = JSON.stringify({
              route: 'q',
              message: `Your Campus Lost & Found verification code is: ${otp}. Valid for 5 minutes.`,
              language: 'english',
              flash: 0,
              numbers: indianMobile
            });

            const req = https.request({
              hostname: 'www.fast2sms.com',
              path: '/dev/bulkV2',
              method: 'POST',
              headers: {
                'authorization': fast2smsKey,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postPayload)
              }
            }, (postRes) => {
              let postData = '';
              postRes.on('data', chunk => { postData += chunk; });
              postRes.on('end', () => {
                console.log(`[FAST2SMS QUICK ROUTE RESPONSE] Status: ${postRes.statusCode} | Body: ${postData}`);
                resolve({ success: true, provider: 'Fast2SMS Quick Route', raw: postData });
              });
            });

            req.on('error', (err) => {
              console.error('[FAST2SMS POST ERROR]', err.message);
              resolve({ success: false, provider: 'Fast2SMS', error: err.message });
            });

            req.write(postPayload);
            req.end();
          });
        }).on('error', (err) => {
          console.error('[FAST2SMS GET ERROR]', err.message);
          resolve({ success: false, provider: 'Fast2SMS', error: err.message });
        });
      });
    } catch (err) {
      console.error('[SMS SERVICE] Fast2SMS Exception:', err.message);
    }
  }

  // 2. 2Factor.in Integration (Indian SMS Gateway)
  const twoFactorKey = process.env.TWO_FACTOR_API_KEY;
  if (twoFactorKey) {
    try {
      console.log(`[SMS SERVICE] Dispatching SMS via 2Factor to +91 ${indianMobile}...`);
      return new Promise((resolve, reject) => {
        const url = `https://2factor.in/API/V1/${twoFactorKey}/SMS/${indianMobile}/${otp}/AUTOGEN`;
        https.get(url, (res) => {
          let data = '';
          res.on('data', chunk => { data += chunk; });
          res.on('end', () => {
            console.log(`[2FACTOR RESPONSE] ${data}`);
            resolve({ success: true, provider: '2Factor', raw: data });
          });
        }).on('error', (err) => {
          console.error('[2FACTOR ERROR]', err);
          reject(err);
        });
      });
    } catch (err) {
      console.error('[SMS SERVICE] 2Factor Exception:', err.message);
    }
  }

  // 3. Twilio Integration (Global SMS Gateway)
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_PHONE_NUMBER;

  if (twilioSid && twilioAuthToken && twilioFrom) {
    try {
      console.log(`[SMS SERVICE] Dispatching SMS via Twilio to +91 ${indianMobile}...`);
      const auth = Buffer.from(`${twilioSid}:${twilioAuthToken}`).toString('base64');
      const formattedPhone = cleanPhone.startsWith('91') ? `+${cleanPhone}` : `+91${indianMobile}`;
      const postData = new URLSearchParams({
        To: formattedPhone,
        From: twilioFrom,
        Body: `Your Campus Lost & Found verification code is: ${otp}. Valid for 5 minutes.`
      }).toString();

      return new Promise((resolve, reject) => {
        const req = https.request({
          hostname: 'api.twilio.com',
          path: `/2010-04-01/Accounts/${twilioSid}/Messages.json`,
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
          }
        }, (res) => {
          let data = '';
          res.on('data', chunk => { data += chunk; });
          res.on('end', () => {
            console.log(`[TWILIO RESPONSE] ${data}`);
            resolve({ success: true, provider: 'Twilio', raw: data });
          });
        });

        req.on('error', (err) => {
          console.error('[TWILIO ERROR]', err);
          reject(err);
        });

        req.write(postData);
        req.end();
      });
    } catch (err) {
      console.error('[SMS SERVICE] Twilio Exception:', err.message);
    }
  }

  console.log(`[SMS SERVICE SANDBOX] Real SMS credentials not active. Logged OTP for +91 ${indianMobile}: ${otp}`);
  return { success: true, provider: 'Sandbox', demoOtp: otp };
};

const isRealSmsConfigured = () => {
  return (
    process.env.ENABLE_REAL_SMS === 'true' ||
    Boolean(process.env.FAST2SMS_API_KEY) ||
    Boolean(process.env.TWO_FACTOR_API_KEY) ||
    Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN)
  );
};

module.exports = { sendSMS, isRealSmsConfigured };
