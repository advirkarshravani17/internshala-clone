import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

const OTPPage = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const [email, setEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ NEW STATE (ONLY FOR FRENCH FIX)
  const [isVerified, setIsVerified] = useState(false);

  // ✅ UPDATED useEffect (small safe fix)
  useEffect(() => {
    if (!router.isReady) return;
    if (isVerified) return; // ✅ STOP after successful French verification

    const type = router.query.type;

    let storedEmail = null;

    if (type === "french") {
      storedEmail = sessionStorage.getItem("pending_french_email");
    } else {
      storedEmail = sessionStorage.getItem("pending_email");
    }

    if (!storedEmail) {
      toast.error(t("otp.sessionExpired"));
      router.push("/userlogin");
      return;
    }

    setEmail(storedEmail);
  }, [router.isReady, router.query.type, isVerified, router, t]);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const type = router.query.type;

      // ✅ FRENCH OTP FLOW (FIXED)
      if (type === "french") {
        await axios.post(
          "https://internshala-clone-2qo8.onrender.com/api/users/verify-french-otp",
          { email, otp }
        );

        setIsVerified(true); // ✅ prevent session expired trigger

        sessionStorage.removeItem("pending_french_email");

        i18n.changeLanguage("fr");

        toast.success("French language activated");

        router.replace("/"); // ✅ use replace instead of push
        return;
      }

      // ✅ NORMAL LOGIN OTP FLOW (UNCHANGED)
      await axios.post("https://internshala-clone-2qo8.onrender.com/api/users/verify-otp", {
        email,
        otp,
      });

      const password = sessionStorage.getItem("pending_password");

      if (!password) {
        throw new Error("Password missing");
      }

      await signInWithEmailAndPassword(auth, email!, password);

      sessionStorage.removeItem("pending_email");
      sessionStorage.removeItem("pending_password");
      sessionStorage.setItem("otp_verified", "true");

      toast.success(t("otp.success"));
      router.replace("/");
    } catch (err: any) {
      toast.error(err.response?.data?.error || t("otp.invalid"));
    } finally {
      setLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleVerifyOTP}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          {t("otp.title")}
        </h2>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          required
          placeholder={t("otp.placeholder")}
          className="w-full px-4 py-2 border rounded-lg mb-4 text-center"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          {loading ? t("otp.verifying") : t("otp.verifyButton")}
        </button>
      </form>
    </div>
  );
};

export default OTPPage;