import {
  ArrowUpRight,
  Clock,
  DollarSign,
  Filter,
  Pin,
  PlayCircle,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import link from "next/link";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();

  const [filteredInternships, setfilteredInternships] = useState<any>([]);
  const [isFiltervisible, setisFiltervisible] = useState(false);

  const [filter, setfilters] = useState({
    category: "",
    location: "",
    workFromHome: false,
    partTime: false,
    stipend: 50,
  });

  const [internshipData, setinternship] = useState<any>([]);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axios.get("https://internshala-clone-2qo8.onrender.com/api/internship");
        setinternship(res.data);
        setfilteredInternships(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchdata();
  }, []);

  useEffect(() => {
    const filtered = internshipData.filter((internship: any) => {
      const matchesCategory = internship.category
        .toLowerCase()
        .includes(filter.category.toLowerCase());

      const matchesLocation = internship.location
        .toLowerCase()
        .includes(filter.location.toLowerCase());

      return matchesCategory && matchesLocation;
    });

    setfilteredInternships(filtered);
  }, [filter]);

  const handlefilterchange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setfilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const clearFilters = () => {
    setfilters({
      category: "",
      location: "",
      workFromHome: false,
      partTime: false,
      stipend: 50,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Filter */}
          <div className="hidden md:block w-64 bg-white rounded-lg shadow-sm p-6 h-fit">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-black">
                  {t("internshipPage.filters")}
                </span>
              </div>

              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {t("internshipPage.clearAll")}
              </button>
            </div>

            <div className="space-y-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("internshipPage.category")}
                </label>
                <input
                  type="text"
                  name="category"
                  value={filter.category}
                  onChange={handlefilterchange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700"
                  placeholder={t("internshipPage.categoryPlaceholder")}
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("internshipPage.location")}
                </label>
                <input
                  type="text"
                  name="location"
                  value={filter.location}
                  onChange={handlefilterchange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700"
                  placeholder={t("internshipPage.locationPlaceholder")}
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="workFromHome"
                    checked={filter.workFromHome}
                    onChange={handlefilterchange}
                    className="h-4 w-4 text-blue-600 rounded "
                  />
                  <span className="text-gray-700">
                    {t("internshipPage.workFromHome")}
                  </span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="partTime"
                    checked={filter.partTime}
                    onChange={handlefilterchange}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <span className="text-gray-700">
                    {t("internshipPage.partTime")}
                  </span>
                </label>
              </div>

              {/* Stipend */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("internshipPage.stipend")}
                </label>

                <input
                  type="range"
                  name="stipend"
                  min="0"
                  max="100"
                  value={filter.stipend}
                  onChange={handlefilterchange}
                  className="w-full"
                />

                <div className="flex justify-between text-sm text-gray-600">
                  <span>₹0</span>
                  <span>₹50K</span>
                  <span>₹100K</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex-1">

            <div className="md:hidden mb-4">
              <button
                onClick={() => setisFiltervisible(!isFiltervisible)}
                className="w-full flex items-center justify-center space-x-2 bg-white p-3 rounded-lg shadow-sm text-black"
              >
                <Filter className="h-5 w-5" />
                <span>{t("internshipPage.showFilters")}</span>
              </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <p className="text-center font-medium text-black">
                {filteredInternships.length}{" "}
                {t("internshipPage.results")}
              </p>
            </div>

            <div className="space-y-4">
              {filteredInternships.map((internship: any) => (
                <div
                  key={internship._id}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-2 text-blue-600 mb-4">
                    <ArrowUpRight className="h-5 w-5" />
                    <span className="font-medium">
                      {t("internshipPage.activelyHiring")}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {internship.title}
                  </h2>

                  <p className="text-gray-600 mb-4">
                    {internship.company}
                  </p>

                  <div className="grid grid-cols-3 gap-4 mb-6">

                    <div className="flex items-center space-x-2 text-gray-600">
                      <PlayCircle className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium">
                          {t("internshipPage.startDate")}
                        </p>
                        <p className="text-sm">{internship.startDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-600">
                      <Pin className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium">
                          {t("internshipPage.location")}
                        </p>
                        <p className="text-sm">{internship.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-600">
                      <DollarSign className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium">
                          {t("internshipPage.stipend")}
                        </p>
                        <p className="text-sm">{internship.stipend}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        {t("internshipPage.type")}
                      </span>

                      <div className="flex items-center space-x-1 text-green-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">
                          {t("internshipPage.posted")}
                        </span>
                      </div>
                    </div>

                    <a
                      href={`/detailinternship/${internship._id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {t("internshipPage.viewDetails")}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;