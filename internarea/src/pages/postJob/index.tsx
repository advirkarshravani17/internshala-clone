import axios from "axios";
import {
  User,
  Lock,
  Briefcase,
  Building2,
  MapPin,
  Tags,
  Info,
  Users,
  DollarSign,
  Calendar,
} from "lucide-react";
import router, { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";

const index = () => {
  const [formadata, setformadata] = useState({
    title: "",
    company: "",
    location: "",
    category: "",
    aboutCompany: "",
    aboutJob: "",
    whoCanApply: "",
    perks: "",
    numberOfOpening: "",
    CTC: "",
    startDate: "",
    AdditionalInfo: "",
  });
  const router = useRouter()
  const [isloading, setisloading] = useState(false)
  const handlechange = (e: any) => {
    const { name, value } = e.target;
    setformadata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
   const handlesubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasemptyfields = Object.values(formadata).some((val) => !val.trim());
    if (hasemptyfields) {
      toast.error("Please fill in all detials");
      return;
    }
    try {
      setisloading(true);
      const res = await axios.post(
        'http://localhost:5000/api/job',
        formadata
      );
      toast.success("job posted successfuly");
      router.push("/adminpanel");
    } catch (error) {
      console.log(error);
      toast.error("error posting job");
    } finally {
      setisloading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Post New Job</h1>
            <p className="mt-2 text-sm text-gray-600">
              Create a new Job opportunity
            </p>
          </div>

          <form className="space-y-6" onSubmit={handlesubmit}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <div className="flex items-center mb-1">
                      <Briefcase className="h-4 w-4 mr-1" />
                      Title*
                    </div>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formadata.title}
                    onChange={handlechange}
                    className="text-black  mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="e.g. Frontend Developer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <div className="flex items-center mb-1">
                      <Building2 className="h-4 w-4 mr-1" />
                      Company Name*
                    </div>
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formadata.company}
                    onChange={handlechange}
                    className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="e.g. Tech Solutions Inc"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <div className="flex items-center mb-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      Location*
                    </div>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formadata.location}
                    onChange={handlechange}
                    className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="e.g. Mumbai, India"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <div className="flex items-center mb-1">
                      <Tags className="h-4 w-4 mr-1" />
                      Category*
                    </div>
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formadata.category}
                    onChange={handlechange}
                    className=" text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="e.g. Software Development"
                  />
                </div>
              </div>
            </div>

            {/* Company & Internship Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center mb-1">
                    <Info className="h-4 w-4 mr-1" />
                    About Company*
                  </div>
                </label>
                <textarea
                  name="aboutCompany"
                  value={formadata.aboutCompany}
                  onChange={handlechange}
                  rows={4}
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Describe your company..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center mb-1">
                    <Briefcase className="h-4 w-4 mr-1" />
                    About Job*
                  </div>
                </label>
                <textarea
                  name="aboutJob"
                  value={formadata.aboutJob}
                  onChange={handlechange}
                  rows={4}
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Describe the job role..."
                />
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center mb-1">
                    <Users className="h-4 w-4 mr-1" />
                    Who Can Apply*
                  </div>
                </label>
                <textarea
                  name="whoCanApply"
                  value={formadata.whoCanApply}
                  onChange={handlechange}
                  rows={3}
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Eligibility criteria..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center mb-1">
                    <Info className="h-4 w-4 mr-1" />
                    Perks*
                  </div>
                </label>
                <textarea
                  name="perks"
                  value={formadata.perks}
                  onChange={handlechange}
                  rows={3}
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="List the perks..."
                />
              </div>
            </div>

            {/* Final Details */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center mb-1">
                    <Users className="h-4 w-4 mr-1" />
                    Number of Openings*
                  </div>
                </label>
                <input
                  type="number"
                  name="numberOfOpening"
                  value={formadata.numberOfOpening}
                  onChange={handlechange}
                  min="1"
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="e.g. 5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center mb-1">
                    <DollarSign className="h-4 w-4 mr-1" />
                    CTC*
                  </div>
                </label>
                <input
                  type="text"
                  name="CTC"
                  value={formadata.CTC}
                  onChange={handlechange}
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="e.g. ₹10LPA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center mb-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    Start Date*
                  </div>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formadata.startDate}
                  onChange={handlechange}
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center mb-1">
                    <Info className="h-4 w-4 mr-1" />
                    Additional Information*
                  </div>
                </label>
                <textarea
                  name="AdditionalInfo"
                  value={formadata.AdditionalInfo}
                  onChange={handlechange}
                  rows={3}
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Any additional details..."
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isloading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isloading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Posting job...
                  </div>
                ) : (
                  "Post Job"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default index;
