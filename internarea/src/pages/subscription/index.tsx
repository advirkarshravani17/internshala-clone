import { useSelector } from "react-redux";
import axios from "axios";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Subscription() {
  const { t } = useTranslation();
  const user = useSelector((state: any) => state.user.user);

  const plans = [
    {
      name: "Free",
      price: 0,
      features: [
        t("subscription.features.free1"),
        t("subscription.features.free2"),
      ],
    },
    {
      name: "Bronze",
      price: 100,
      features: [
        t("subscription.features.bronze1"),
        t("subscription.features.bronze2"),
        t("subscription.features.bronze3"),
      ],
    },
    {
      name: "Silver",
      price: 300,
      highlight: true,
      features: [
        t("subscription.features.silver1"),
        t("subscription.features.silver2"),
        t("subscription.features.silver3"),
        t("subscription.features.silver4"),
      ],
    },
    {
      name: "Gold",
      price: 1000,
      features: [
        t("subscription.features.gold1"),
        t("subscription.features.gold2"),
        t("subscription.features.gold3"),
        t("subscription.features.gold4"),
      ],
    },
  ];

  const [subscription, setSubscription] = useState<any>(null);
  const [loadingSub, setLoadingSub] = useState(true);
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }, []);

  const fetchSubscription = async () => {
    try {
      if (!user?.uid) return;

      const { data } = await axios.get(
        `https://internshala-clone-2qo8.onrender.com/api/subscription/${user.uid}`
      );

      setSubscription(data);

      if (
        data?.applicationsUsed !== undefined &&
        data?.applyLimit !== undefined &&
        data?.applyLimit !== Infinity &&
        data?.applicationsUsed >= data?.applyLimit
      ) {
        setLimitReached(true);
      } else {
        setLimitReached(false);
      }
    } catch {
      console.log("Subscription fetch failed");
    } finally {
      setLoadingSub(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [user]);

  const handlePayment = async (plan: string) => {
    try {
      if (plan === "Free") {
        toast.info(t("subscription.toast.freePlan"));
        return;
      }

      if (!user?.uid) {
        toast.error(t("subscription.toast.userNotLoaded"));
        return;
      }

      if (
        subscription &&
        subscription.plan !== "Free" &&
        new Date(subscription.expiryDate) > new Date()
      ) {
        toast.error(t("subscription.toast.activePlan"));
        return;
      }

      toast.loading(t("subscription.toast.creatingOrder"), {
        toastId: "payment",
      });

      const { data: order } = await axios.post(
        "https://internshala-clone-2qo8.onrender.com/api/payment/create-subscription-order",
        { plan, uid: user.uid }
      );

      toast.dismiss("payment");

      if (!window.Razorpay) {
        toast.error(t("subscription.toast.gatewayFail"));
        return;
      }

      const options = {
        key: order.key,
        amount: order.amount,
        currency: "INR",
        name: "InternArea Subscription",
        description: `${plan} Plan Subscription`,
        order_id: order.id,

        handler: async (response: any) => {
          try {
            toast.loading(t("subscription.toast.verifying"), {
              toastId: "verify",
            });

            await axios.post(
              "https://internshala-clone-2qo8.onrender.com/api/payment/verify-subscription-payment",
              {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                uid: user.uid,
                plan,
              }
            );

            toast.dismiss("verify");
            toast.success(t("subscription.toast.success"));
            fetchSubscription();
          } catch {
            toast.dismiss("verify");
            toast.error(t("subscription.toast.verifyFail"));
          }
        },

        modal: {
          ondismiss: () => {
            toast.info(t("subscription.toast.cancelled"));
          },
        },

        theme: { color: "#6366F1" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast.dismiss("payment");
      toast.error(
        error.response?.data?.message ||
          t("subscription.toast.genericError")
      );
    }
  };

  const currentPlan = subscription?.plan || "Free";

  const expiryInfo =
    subscription?.expiryDate && currentPlan !== "Free"
      ? (() => {
          const expiry = new Date(subscription.expiryDate);

          const daysLeft = Math.max(
            0,
            Math.ceil(
              (expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            )
          );

          const formattedDate = expiry.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });

          return { daysLeft, formattedDate };
        })()
      : null;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-8 pb-20 px-6">
      <h1 className="text-5xl font-extrabold mb-4 text-gray-900 text-center">
        {t("subscription.title")}
      </h1>

      <p className="text-gray-500 text-lg mb-10 text-center max-w-2xl">
        {t("subscription.subtitle")}
      </p>

      {limitReached && (
        <div className="w-full max-w-4xl mb-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-center font-semibold">
          {t("subscription.limitReached")}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 w-full max-w-7xl">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.name;

          return (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-[2px] transition-all duration-500 hover:scale-105 ${
                plan.highlight
                  ? "bg-gradient-to-r from-blue-500 to-purple-600"
                  : "bg-gray-200"
              }`}
            >
              <div className="bg-white rounded-3xl p-8 h-full shadow-lg hover:shadow-2xl flex flex-col justify-between">
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-1 rounded-full text-sm font-semibold">
                    {t("subscription.mostPopular")}
                  </div>
                )}

                <div>
                  <h2 className="text-2xl font-bold text-center mb-4 text-gray-900">
                    {plan.name}
                  </h2>

                  <p className="text-center mb-6">
                    <span className="text-4xl font-extrabold">
                      ₹{plan.price}
                    </span>
                    {plan.price !== 0 && (
                      <span className="text-gray-500 text-lg">
                        {" "}
                        {t("subscription.perMonth")}
                      </span>
                    )}
                  </p>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-700">
                        <CheckCircle
                          className="text-green-500 mr-2"
                          size={18}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {isCurrent && expiryInfo && (
                    <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl text-center font-semibold">
                      {t("subscription.activeUntil", {
                        date: expiryInfo.formattedDate,
                        days: expiryInfo.daysLeft,
                      })}
                    </div>
                  )}
                </div>

                <button
                  disabled={isCurrent}
                  onClick={() => handlePayment(plan.name)}
                  className={`w-full py-3 rounded-xl font-semibold text-white ${
                    isCurrent
                      ? "bg-gray-400 cursor-not-allowed"
                      : plan.highlight
                      ? "bg-gradient-to-r from-blue-600 to-purple-600"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isCurrent
                    ? t("subscription.currentPlan")
                    : t("subscription.upgrade")}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}