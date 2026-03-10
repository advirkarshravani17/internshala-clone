const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sentOtpMail = async (to, otp, purpose = "login") => {
  let subject = "OTP Verification";
  let html = "";

  switch (purpose) {

    // ✅ LOGIN OTP
    case "login":
      subject = "Login OTP Verification";
      html = `
        <h2>Login Verification</h2>
        <p>Your login OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
        <p>If you did not try to log in, please ignore this email.</p>
      `;
      break;

    // ✅ RESUME OTP
    case "resume":
      subject = "Resume Generation OTP";
      html = `
        <h2>Resume Verification</h2>
        <p>Use the OTP below to verify resume generation:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      `;
      break;

    // 🇫🇷 FRENCH LANGUAGE OTP
    case "french":
      subject = "French Language Activation OTP";
      html = `
        <h2>French Language Activation</h2>
        <p>Use the OTP below to enable French language:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      `;
      break;

    // ✅ SUBSCRIPTION
    case "subscription":
      subject = "Subscription Activated 🎉";
      html = `
        <h2>Subscription Activated Successfully</h2>
        <p>Your plan has been upgraded successfully.</p>

        <h3>${otp}</h3>

        <p>You can now enjoy premium benefits on <b>InternArea</b>.</p>
        <p>Your subscription is valid for 1 month.</p>

        <br/>
        <p>Thank you for choosing InternArea 🚀</p>
      `;
      break;

    // DEFAULT
    default:
      html = `
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
      `;
  }

  await resend.emails.send({
    from: "Intern App <onboarding@resend.dev>",
    to: to,
    subject: subject,
    html: html,
  });
};

module.exports = sentOtpMail;