import React, { useState } from "react";
import { auth, provider } from "@/firebase/firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Login = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isMobileDevice = () =>
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const isMobileTimeAllowed = () => {
    const hour = new Date().getHours();
    return hour >= 10 && hour < 13;
  };

  const syncUserWithBackend = async (
    firebaseUser: any,
    loginMethod: "EMAIL" | "GOOGLE"
  ) => {
    try {
      const res = await axios.post(
        "https://internshala-clone-2qo8.onrender.com/api/users/sync",
        {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || "User",
          email: firebaseUser.email,
          profilePhoto: firebaseUser.photoURL || "",
          loginMethod,
        }
      );

      return { success: true, user: res.data };
    } catch (err: any) {
      if (err?.response?.status === 401) {
        return {
          otpRequired: true,
          email: err.response.data.email,
        };
      }

      if (err?.response?.status === 403) {
        toast.error(err.response.data.error);
        return { blocked: true };
      }

      toast.error(err?.response?.data?.error || t("userLogin.loginBlocked"));
      return { success: false };
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isMobileDevice() && !isMobileTimeAllowed()) {
      toast.error(t("userLogin.mobileTimeRestriction"));
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);

      const firebaseUser = auth.currentUser;
      if (!firebaseUser) throw new Error("No user found");

      const result = await syncUserWithBackend(firebaseUser, "EMAIL");

      if (result?.blocked) {
        await auth.signOut();
        return;
      }

      if (result?.otpRequired) {
        await auth.signOut();

        sessionStorage.setItem("pending_email", result.email);
        sessionStorage.setItem("pending_password", password);
        sessionStorage.setItem("otp_verified", "false");

        toast.info(t("userLogin.otpSent"));
        router.push("/otp");
        return;
      }

      toast.success(t("userLogin.loginSuccess"));
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || t("userLogin.loginFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isMobileDevice() && !isMobileTimeAllowed()) {
      toast.error(t("userLogin.mobileTimeRestriction"));
      return;
    }

    try {
      setLoading(true);

      await signInWithPopup(auth, provider);

      const firebaseUser = auth.currentUser;
      if (!firebaseUser) return;

      const result = await syncUserWithBackend(firebaseUser, "GOOGLE");

      if (result?.blocked) {
        await auth.signOut();
        return;
      }

      sessionStorage.setItem("otp_verified", "true");

      toast.success(t("userLogin.googleSuccess"));
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error(t("userLogin.googleFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          {t("userLogin.welcome")}
        </h2>

        <p className="text-center text-gray-500 mb-6">
          {t("userLogin.subtitle")}
        </p>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">
              {t("userLogin.email")}
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder={t("userLogin.emailPlaceholder")}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              {t("userLogin.password")}
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder={t("userLogin.passwordPlaceholder")}
            />
          </div>

          <p className="text-sm text-right">
            <Link
              href="/forgotpassword"
              className="text-blue-600 hover:underline"
            >
              {t("userLogin.forgotPassword")}
            </Link>
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? t("userLogin.loggingIn") : t("userLogin.login")}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-3 text-sm text-gray-500">
            {t("userLogin.or")}
          </span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full border py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 disabled:opacity-60"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="w-5 h-5"
          />
          <span className="font-medium text-gray-700">
            {t("userLogin.continueGoogle")}
          </span>
        </button>

        <p className="text-sm text-center mt-6 text-gray-600">
          {t("userLogin.noAccount")}{" "}
          <Link
            href="/usersignup"
            className="text-blue-600 font-medium hover:underline"
          >
            {t("userLogin.signup")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;