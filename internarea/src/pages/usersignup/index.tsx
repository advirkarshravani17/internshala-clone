import React, { useState } from "react";
import { auth, provider } from "@/firebase/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const Signup = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Email Signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success(t("signup.success"));
      router.push("/");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Google Signup
  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      toast.success(t("signup.googleSuccess"));
      router.push("/");
    } catch (error) {
      toast.error(t("signup.googleError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {t("signup.title")}
        </h2>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder={t("signup.email")}
            className="w-full border rounded-lg px-4 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder={t("signup.password")}
            className="w-full border rounded-lg px-4 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            {loading ? t("signup.creating") : t("signup.createAccount")}
          </button>
        </form>

        <div className="my-4 text-center text-gray-500">
          {t("signup.or")}
        </div>

        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full border py-2 rounded-lg hover:bg-gray-50"
        >
          {t("signup.continueGoogle")}
        </button>

        <p className="text-sm text-center mt-4">
          {t("signup.haveAccount")}{" "}
          <Link href="/login" className="text-blue-600">
            {t("signup.login")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;