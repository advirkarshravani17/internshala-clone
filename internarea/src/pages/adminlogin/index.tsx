import { User, Lock } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

const index = () => {
  const { t } = useTranslation();

  const [formadata, setformadata] = useState({
    username: "",
    password: "",
  });

  const router = useRouter();
  const [isloading, setisloading] = useState(false);

  const handlechange = (e: any) => {
    const { name, value } = e.target;
    setformadata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlesubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formadata.username || !formadata.password) {
      toast.error(t("adminLogin.fillDetails"));
      return;
    }

    try {
      setisloading(true);

      await axios.post(
        "https://internshala-clone-2qo8.onrender.com/api/admin/adminlogin",
        formadata
      );

      toast.success(t("adminLogin.success"));
      router.push("/adminpanel");
    } catch (error) {
      console.log(error);
      toast.error(t("adminLogin.invalid"));
    } finally {
      setisloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          {t("adminLogin.title")}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t("adminLogin.subtitle")}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handlesubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("adminLogin.username")}
              </label>

              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>

                <input
                  name="username"
                  type="text"
                  required
                  value={formadata.username}
                  onChange={handlechange}
                  placeholder={t("adminLogin.usernamePlaceholder")}
                  className="block w-full text-black pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("adminLogin.password")}
              </label>

              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>

                <input
                  name="password"
                  type="password"
                  required
                  value={formadata.password}
                  onChange={handlechange}
                  placeholder={t("adminLogin.passwordPlaceholder")}
                  className="block w-full text-black pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isloading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isloading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  {t("adminLogin.signingIn")}
                </div>
              ) : (
                t("adminLogin.signIn")
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default index;