import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const ResumeView = () => {
  const { t } = useTranslation();
  const user = useSelector((state: any) => state.user.user);
  const [resume, setResume] = useState<any>(null);

  useEffect(() => {
    if (!user?.uid) return;

    fetch(`https://internshala-clone-2qo8.onrender.com/api/resume/my?uid=${user.uid}`)
      .then((res) => res.json())
      .then((data) => setResume(data))
      .catch(() => toast.error(t("resumeView.loadFailed")));
  }, [user?.uid]);

  const saveToProfile = async () => {
    try {
      await fetch("https://internshala-clone-2qo8.onrender.com/api/user/save-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          resumeId: resume._id,
        }),
      });

      toast.success(t("resumeView.savedProfile"));
    } catch {
      toast.error(t("resumeView.saveFailed"));
    }
  };

  const enableAutoAdd = async () => {
    try {
      await fetch("https://internshala-clone-2qo8.onrender.com/api/application/auto-attach-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid }),
      });

      toast.success(t("resumeView.autoAttachSuccess"));
    } catch {
      toast.error(t("resumeView.autoAttachFailed"));
    }
  };

  if (!resume) return <p>{t("resumeView.loading")}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white">
      <h1 className="text-2xl font-bold">{resume.name}</h1>
      <p>
        {resume.email} | {resume.phone}
      </p>

      <hr className="my-4" />

      <h2 className="font-semibold">{t("resumeView.qualification")}</h2>
      <p>{resume.qualification}</p>

      <h2 className="font-semibold mt-4">{t("resumeView.skills")}</h2>
      <p>{resume.skills}</p>

      <h2 className="font-semibold mt-4">{t("resumeView.about")}</h2>
      <p>{resume.about}</p>

      <h2 className="font-semibold mt-4">{t("resumeView.professional")}</h2>
      <p>{resume.professional}</p>

      <div className="flex gap-4 mt-6">
        <button
          onClick={saveToProfile}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {t("resumeView.saveProfile")}
        </button>

        <button
          onClick={enableAutoAdd}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {t("resumeView.autoAttach")}
        </button>
      </div>
    </div>
  );
};

export default ResumeView;