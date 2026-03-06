import { selectuser } from "@/feature/Userslice";
import axios, { AxiosError } from "axios";
import {
  ArrowUpRight,
  Book,
  Clock,
  DollarSign,
  ExternalLink,
  MapPin,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const index = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;

  const [jobData, setjob] = useState<any>([]);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axios.get(
          `https://internshala-clone-2qo8.onrender.com/api/job/${id}`
        );
        setjob(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchdata();
  }, [id]);

  const [availability, setAvailability] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const user = useSelector(selectuser);

  if (!jobData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handlesubmitapplication = async () => {
    if (!coverLetter.trim()) {
      toast.error(t("detailedJob.toast.pleaseWriteCoverLetter"));
      return;
    }

    if (!availability) {
      toast.error(t("detailedJob.toast.pleaseSelectAvailability"));
      return;
    }

    try {
      const applicationdata = {
        category: jobData.category,
        company: jobData.company,
        coverLetter,
        user,
        Application: id,
        availability,
      };

      await axios.post(
        "https://internshala-clone-2qo8.onrender.com/api/application",
        applicationdata
      );

      toast.success(t("detailedJob.toast.applicationSubmitted"));
      router.push("/job");
    } catch (error) {
      console.error(error);

      const axiosError = error as AxiosError<{ message: string }>;

      if (axiosError.response?.data?.message) {
        toast.error(axiosError.response.data.message);
      } else {
        toast.error(t("detailedJob.toast.applicationFailed"));
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-2 text-blue-600 mb-4">
            <ArrowUpRight className="h-5 w-5" />
            <span className="font-medium">
              {t("detailedJob.activelyHiring")}
            </span>
          </div>

          <h1 className="text-3xl font-bold mb-2">
            {jobData.title}
          </h1>

          <p className="text-lg text-gray-600 mb-4">
            {jobData.company}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="h-5 w-5" />
              <span>{jobData.location}</span>
            </div>

            <div className="flex items-center space-x-2 text-gray-600">
              <DollarSign className="h-5 w-5" />
              <span>CTC {jobData.CTC}</span>
            </div>

            <div className="flex items-center space-x-2 text-gray-600">
              <Book className="h-5 w-5" />
              <span>{jobData.category}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-2">
            <Clock className="h-4 w-4 text-green-500" />
            <span className="text-green-500 text-sm">
              {t("detailedJob.postedOn")} {jobData.createAt}
            </span>
          </div>
        </div>

        {/* Company */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold mb-4">
            {t("detailedJob.aboutCompany", {
              company: jobData.company,
            })}
          </h2>

          <div className="flex items-center space-x-2 mb-4">
            <a href="#" className="text-blue-600 flex items-center space-x-1">
              <span>{t("detailedJob.visitCompanyWebsite")}</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <p className="text-gray-600">{jobData.aboutCompany}</p>
        </div>

        {/* Job Details */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold mb-4">
            {t("detailedJob.aboutJob")}
          </h2>

          <p className="mb-6">{jobData.aboutJob}</p>

          <h3 className="font-semibold mb-2">
            {t("detailedJob.whoCanApply")}
          </h3>
          <p className="mb-6">{jobData.whoCanApply}</p>

          <h3 className="font-semibold mb-2">
            {t("detailedJob.perks")}
          </h3>
          <p className="mb-6">{jobData.perks}</p>

          <h3 className="font-semibold mb-2">
            {t("detailedJob.additionalInformation")}
          </h3>
          <p>{jobData.AdditionalInfo}</p>
        </div>

        {/* Apply Button */}
        <div className="p-6 flex justify-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg"
          >
            {t("detailedJob.applyNow")}
          </button>
        </div>
      </div>

      {/* Modal SAME AS INTERNSHIP STRUCTURE */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4">
            <div className="p-6 border-b flex justify-between">
              <h2 className="text-2xl font-bold">
                {t("detailedJob.applyModal.applyTo", {
                  company: jobData.company,
                })}
              </h2>

              <button onClick={() => setIsModalOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <Link
                href="/resumeView"
                className="underline font-semibold"
              >
                {t("detailedJob.applyModal.yourResume")}
              </Link>

              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder={t(
                  "detailedJob.applyModal.writeCoverLetter"
                )}
                className="w-full h-32 border p-3 rounded-lg text-black"
              />

              <div className="space-y-3">
                {[
                  t("detailedJob.applyModal.availableImmediately"),
                  t("detailedJob.applyModal.onNoticePeriod"),
                  t("detailedJob.applyModal.willServeNotice"),
                  t("detailedJob.applyModal.other"),
                ].map((option) => (
                  <label key={option} className="flex gap-2">
                    <input
                      type="radio"
                      value={option}
                      checked={availability === option}
                      onChange={(e) =>
                        setAvailability(e.target.value)
                      }
                    />
                    {option}
                  </label>
                ))}
              </div>

              <div className="flex justify-end">
                {user ? (
                  <button
                    onClick={handlesubmitapplication}
                    className="bg-blue-600 text-white px-6 py-2 rounded"
                  >
                    {t(
                      "detailedJob.applyModal.submitApplication"
                    )}
                  </button>
                ) : (
                  <Link
                    href="/"
                    className="bg-blue-600 text-white px-6 py-2 rounded"
                  >
                    {t("detailedJob.applyModal.signupToApply")}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default index;