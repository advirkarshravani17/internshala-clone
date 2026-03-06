import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const ResumePage = () => {
  const { t } = useTranslation();
  const user = useSelector((state: any) => state.user.user);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    qualification: "",
    professional: "",
    skills: "",
    about: "",
    photo: null as File | null,
    photoPreview: "",
  });

  const [existingResume, setExistingResume] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔁 Fetch existing resume
  useEffect(() => {
    if (!user?.uid) return;

    fetch(`https://internshala-clone-2qo8.onrender.com/api/resume/my?uid=${user.uid}`)
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data) {
          setExistingResume(data);
          setIsEditing(true);
          setForm({
            name: data.name,
            email: data.email,
            phone: data.phone,
            qualification: data.qualification,
            professional: data.professional,
            skills: data.skills,
            about: data.about,
            photo: null,
            photoPreview: data.photo,
          });
        }
      });
  }, [user?.uid]);

  const getInputClass = (value: string) =>
    `border px-4 py-2 rounded-md outline-none transition
     ${value ? "border-blue-500 bg-blue-50" : "border-gray-400"}
     focus:border-blue-500 focus:ring-1 focus:ring-blue-500`;

  const getTextareaClass = (value: string) =>
    `w-full border px-4 py-2 rounded-md outline-none transition
     ${value ? "border-blue-500 bg-blue-50" : "border-gray-400"}
     focus:border-blue-500 focus:ring-1 focus:ring-blue-500`;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setForm({
        ...form,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      });
    }
  };

  // 🔐 STEP 1: Send OTP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await fetch("https://internshala-clone-2qo8.onrender.com/api/resume/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await res.json();
      if (!res.ok)
        return toast.error(data.message || t("resume.otpFailed"));

      toast.success(t("resume.otpSent"));
      setOtpSent(true);
    } finally {
      setLoading(false);
    }
  };

  // 🔐 STEP 2: Verify OTP
  const handleVerifyOtp = async () => {
    try {
      setLoading(true);

      const res = await fetch("https://internshala-clone-2qo8.onrender.com/api/resume/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp }),
      });

      const data = await res.json();
      if (!res.ok)
        return toast.error(data.message || t("resume.otpVerifyFailed"));

      toast.success(t("resume.emailVerified"));
      setOtpVerified(true);
    } finally {
      setLoading(false);
    }
  };

  // 💳 STEP 3: Create resume
  const createResume = async () => {
    if (!user?.uid) return toast.error(t("resume.userNotLogged"));

    const res = await fetch("https://internshala-clone-2qo8.onrender.com/api/resume/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: user.uid,
        ...form,
        photo: form.photoPreview,
        paymentVerified: true,
      }),
    });

    const data = await res.json();
    if (!res.ok) return toast.error(data.message);

    toast.success(t("resume.resumeCreated"));

    setTimeout(() => {
      window.location.href = "/resumeView";
    }, 1200);
  };

  // 💰 Razorpay payment
  const handlePayment = async () => {
    const res = await fetch("https://internshala-clone-2qo8.onrender.com/api/payment/create-order", {
      method: "POST",
    });

    const data = await res.json();
    if (!res.ok)
      return toast.error(t("resume.paymentInitFailed"));

    const options = {
      key: data.key,
      amount: data.amount,
      currency: "INR",
      name: "Internshala",
      description: "Resume Generation Fee",
      order_id: data.orderId,
      handler: async (response: any) => {
        const verifyRes = await fetch(
          "https://internshala-clone-2qo8.onrender.com/api/payment/verify",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          }
        );

        const verifyData = await verifyRes.json();

        if (verifyData.status === "SUCCESS") {
          toast.success(t("resume.paymentSuccess"));
          await createResume();
        } else {
          toast.error(t("resume.paymentVerifyFailed"));
        }
      },
      theme: { color: "#4f46e5" },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  // ✏️ Update resume
  const updateResume = async () => {
    const res = await fetch("https://internshala-clone-2qo8.onrender.com/api/resume/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: user.uid,
        ...form,
        photo: form.photoPreview,
      }),
    });

    await res.json();

    toast.success(t("resume.resumeUpdated"));

    setTimeout(() => {
      window.location.href = "/resumeView";
    }, 1200);
  };

  return (
    <div className="w-full flex justify-center py-8 bg-[#f3f4f6]">
      <div className="w-[780px] bg-white px-8 py-6 rounded-md">
        <h1 className="text-xl font-semibold">
          {isEditing
            ? t("resume.editTitle")
            : t("resume.createTitle")}
        </h1>

        <p className="text-sm mt-1">
          {isEditing
            ? t("resume.editSubtitle")
            : t("resume.createSubtitle")}
        </p>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <input name="name" value={form.name} onChange={handleChange} className={getInputClass(form.name)} placeholder={t("resume.fullName")} />

          <input
            name="email"
            value={form.email}
            disabled={isEditing}
            onChange={handleChange}
            className={`${getInputClass(form.email)} ${isEditing && "bg-gray-100 cursor-not-allowed"}`}
            placeholder={t("resume.email")}
          />

          <input name="phone" value={form.phone} onChange={handleChange} className={getInputClass(form.phone)} placeholder={t("resume.phone")} />
          <input name="qualification" value={form.qualification} onChange={handleChange} className={getInputClass(form.qualification)} placeholder={t("resume.qualification")} />
        </div>

        <textarea name="professional" value={form.professional} onChange={handleChange} className={`${getTextareaClass(form.professional)} mt-4`} placeholder={t("resume.professional")} />
        <input name="skills" value={form.skills} onChange={handleChange} className={`${getInputClass(form.skills)} mt-4 w-full`} placeholder={t("resume.skills")} />
        <textarea name="about" value={form.about} onChange={handleChange} className={`${getTextareaClass(form.about)} mt-4`} placeholder={t("resume.about")} />

        <div className="mt-4 flex items-center gap-4">
          <label className="border px-4 py-2 rounded cursor-pointer">
            {t("resume.uploadPhoto")}
            <input type="file" accept="image/*" hidden onChange={handleFileChange} />
          </label>
          {form.photoPreview && (
            <img src={form.photoPreview} className="w-16 h-16 rounded object-cover" />
          )}
        </div>

        {!isEditing && (
          <>
            <button onClick={handleSubmit} className="w-full mt-6 bg-indigo-600 text-white py-3 rounded">
              {t("resume.generateOtp")}
            </button>

            {otpSent && (
              <div className="mt-4">
                <input value={otp} onChange={e => setOtp(e.target.value)} className={getInputClass(otp)} placeholder={t("resume.enterOtp")} />

                <button onClick={handleVerifyOtp} className="w-full mt-3 bg-green-600 text-white py-3 rounded">
                  {t("resume.verifyOtp")}
                </button>

                {otpVerified && (
                  <button onClick={handlePayment} className="w-full mt-3 bg-purple-600 text-white py-3 rounded">
                    {t("resume.payCreate")}
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {isEditing && (
          <button onClick={updateResume} className="w-full mt-6 bg-green-600 text-white py-3 rounded">
            {t("resume.saveChanges")}
          </button>
        )}
      </div>
    </div>
  );
};

export default ResumePage;