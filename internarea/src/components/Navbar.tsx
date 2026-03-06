import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import Link from "next/link";
import { Search, LogOut } from "lucide-react";
import { useSelector } from "react-redux";
import { selectuser } from "@/feature/Userslice";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

const Navbar = () => {
  const user = useSelector(selectuser);
  const { t } = useTranslation();
const router = useRouter();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link href="/">
            <img src="/logo.png" className="h-14 cursor-pointer" />
          </Link>

          {/* Menu */}
          <div className="hidden md:flex items-center space-x-8 font-medium">
            
            <Link href="/internship" className="hover:text-blue-600">
              {t("nav.internships")}
            </Link>

            <Link href="/job" className="hover:text-blue-600">
              {t("nav.jobs")}
            </Link>

            {/* Community */}
            <Link
              href={user ? "/community/feed" : "/userlogin"}
              className="hover:text-blue-600"
            >
              {t("nav.community")}
            </Link>

            {/* Resume Builder */}
            <Link
              href={user ? "/resume" : "/userlogin"}
              className="hover:text-blue-600"
            >
              {t("nav.resume")}
            </Link>

            {/* Subscription */}
            <Link
              href={user ? "/subscription" : "/userlogin"}
              className="hover:text-blue-600"
            >
              {t("nav.subscription")}
            </Link>

            {/* Search Bar */}
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <Search size={16} />
              <input
                className="ml-2 bg-transparent focus:outline-none text-sm"
                placeholder={t("nav.search")}
              />
            </div>

            {/* ✅ Temporary Language Switch (Testing) */}
            <select
  onChange={async (e) => {
    const selectedLang = e.target.value;

    if (selectedLang !== "fr") {
      i18n.changeLanguage(selectedLang);
      return;
    }

    if (!user?.email) {
      toast.error("Login required");
      return;
    }

    try {
      const res = await axios.post(
        "https://internshala-clone-2qo8.onrender.com/api/users/send-french-otp",
        { email: user.email }
      );

      sessionStorage.setItem("pending_french_email", user.email);
toast.success("OTP sent to your email");
router.push("/otp?type=french");
    } catch (err: any) {
      toast.error(err.response?.data?.error);
    }
  }}
              className="border rounded px-0 py-1 text-sm"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
              <option value="pt">Portugues</option>
              <option value="zh">Chinese</option>
            </select>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <Link href="/adminlogin" className="text-gray-600">
                  {t("nav.admin")}
                </Link>

                <Link href="/userlogin">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    {t("nav.login")}
                  </button>
                </Link>
              </>
            ) : (
              <>
                {/* Login History */}
                <Link
                  href="/login-history"
                  className="text-sm font-medium text-gray-600 hover:text-blue-600"
                >
                  {t("nav.loginHistory")}
                </Link>

                {/* Profile */}
                <Link href="/profile">
                  <img
                    src={user.photo || "/avatar.jpg"}
                    className="w-9 h-9 rounded-full cursor-pointer border"
                  />
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700"
                >
                  <LogOut size={18} />
                  {t("nav.logout")}
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;