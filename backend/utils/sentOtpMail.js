const axios = require("axios");

const SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
const PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;

const TEMPLATE_ID = "template_da6d7y9"; // your EmailJS template id

const sentOtpMail = async (to, otp, purpose = "login") => {

  let subject = "OTP Verification";
  let title = "Verification";
  let message = "";
  let footer = "";
  let otpValue = otp; // default

  switch (purpose) {

    // ✅ LOGIN OTP
    case "login":
      subject = "Login OTP Verification";
      title = "Login Verification";
      message = "Your login OTP is:";
      footer = "If you did not try to log in, please ignore this email.";
      break;

    // ✅ RESUME OTP
    case "resume":
      subject = "Resume Generation OTP";
      title = "Resume Verification";
      message = "Use the OTP below to verify resume generation:";
      footer = "This OTP is valid for 5 minutes.";
      break;

    // 🇫🇷 FRENCH LANGUAGE
    case "french":
      subject = "French Language Activation OTP";
      title = "French Language Activation";
      message = "Use the OTP below to enable French language:";
      footer = "This OTP is valid for 5 minutes.";
      break;

    // ✅ SUBSCRIPTION (NO OTP)
    case "subscription":
      subject = "Subscription Activated 🎉";
      title = "Subscription Activated Successfully";
      message = "Your plan has been upgraded successfully.";
      footer = "You can now enjoy premium benefits on InternArea. Your subscription is valid for 1 month. Thank you for choosing InternArea 🚀";
      otpValue = ""; // no OTP
      break;

    // DEFAULT
    default:
      message = "Your OTP is:";
      footer = "This OTP is valid for 5 minutes.";
  }

  try {
    await axios.post("https://api.emailjs.com/api/v1.0/email/send", {
      service_id: SERVICE_ID,
      template_id: TEMPLATE_ID,
      user_id: PUBLIC_KEY,
      accessToken: PRIVATE_KEY,
      template_params: {
        email: to,
        subject,
        title,
        message,
        footer,
        otp: otpValue
      }
    });

    console.log("Email sent successfully to:", to);

  } catch (error) {
    console.error("Email sending failed:", error.response?.data || error);
    throw error;
  }
};

module.exports = sentOtpMail;