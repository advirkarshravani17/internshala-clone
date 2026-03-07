const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sentOtpMail = async (to, otp, purpose = "login") => {
  let subject = "OTP Verification";
  let html = "";

  switch (purpose) {
    // ✅ LOGIN OTP (UNCHANGED)
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

    // ✅ RESUME OTP (UNCHANGED)
    case "resume":
      subject = "Resume Generation OTP";
      html = `
        <h2>Resume Verification</h2>
        <p>Use the OTP below to verify resume generation:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      `;
      break;

    // 🇫🇷 NEW — FRENCH LANGUAGE UNLOCK OTP
    case "french":
  subject = "French Language Activation OTP";
  html = `
    <h2>French Language Activation</h2>
    <p>Use the OTP below to enable French language:</p>
    <h1>${otp}</h1>
    <p>This OTP is valid for 5 minutes.</p>
  `;
  break;
  
    // ✅ SUBSCRIPTION (UNCHANGED)
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

  await transporter.sendMail({
    from: `"Intern App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sentOtpMail;