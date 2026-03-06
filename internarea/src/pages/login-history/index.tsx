import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectuser } from "@/feature/Userslice";
import { useTranslation } from "react-i18next"; // ✅ added

type LoginHistory = {
  _id: string;
  browser: string;
  os: string;
  deviceType: string;
  ipAddress: string;
  loginTime: string;
};

export default function LoginHistoryPage() {
  const user = useSelector(selectuser);
  const { t } = useTranslation(); // ✅ added

  const [history, setHistory] = useState<LoginHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `https://internshala-clone-2qo8.onrender.com/api/login-history/${user.uid}`
        );
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch login history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return <p className="p-6">{t("loginHistory.loading")}</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        {t("loginHistory.title")}
      </h2>

      <div className="overflow-x-auto border rounded-md">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">
                {t("loginHistory.browser")}
              </th>
              <th className="p-3 text-left">
                {t("loginHistory.os")}
              </th>
              <th className="p-3 text-left">
                {t("loginHistory.device")}
              </th>
              <th className="p-3 text-left">
                {t("loginHistory.ipAddress")}
              </th>
              <th className="p-3 text-left">
                {t("loginHistory.loginTime")}
              </th>
            </tr>
          </thead>

          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  {t("loginHistory.noHistory")}
                </td>
              </tr>
            ) : (
              history.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="p-3">{item.browser}</td>
                  <td className="p-3">{item.os}</td>
                  <td className="p-3">{item.deviceType}</td>
                  <td className="p-3">{item.ipAddress}</td>
                  <td className="p-3">
                    {formatDateTime(item.loginTime)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}