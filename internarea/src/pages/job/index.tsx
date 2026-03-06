import axios from "axios";
import {
  ArrowUpRight,
  Clock,
  DollarSign,
  Filter,
  Pin,
  PlayCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const index = () => {
  const { t } = useTranslation();

  const [filteredJobs, setfilteredJobs] = useState<any>([]);
  const [isFiltervisible, setisFiltervisible] = useState(false);

  const [filter, setfilters] = useState({
    category: "",
    location: "",
    workFromHome: false,
    partTime: false,
    salary: 50,
    experience: "",
  });

  const [filteredjobs, setjob] = useState<any>([]);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axios.get("https://internshala-clone-2qo8.onrender.com/api/job");
        setjob(res.data);
        setfilteredJobs(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchdata();
  }, []);

  useEffect(() => {
    const filtered = filteredjobs.filter((job: any) => {
      const matchesCategory = job.category
        .toLowerCase()
        .includes(filter.category.toLowerCase());

      const matchesLocation = job.location
        .toLowerCase()
        .includes(filter.location.toLowerCase());

      return matchesCategory && matchesLocation;
    });

    setfilteredJobs(filtered);
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
      salary: 50,
      experience: "",
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
                  {t("jobPage.filters")}
                </span>
              </div>

              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {t("jobPage.clearAll")}
              </button>
            </div>

            <div className="space-y-6">

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("jobPage.category")}
                </label>
                <input
                  type="text"
                  name="category"
                  value={filter.category}
                  onChange={handlefilterchange}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder={t("jobPage.categoryPlaceholder")}
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("jobPage.location")}
                </label>
                <input
                  type="text"
                  name="location"
                  value={filter.location}
                  onChange={handlefilterchange}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder={t("jobPage.locationPlaceholder")}
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("jobPage.experience")}
                </label>
                <input
                  type="text"
                  name="experience"
                  value={filter.experience}
                  onChange={handlefilterchange}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder={t("jobPage.experiencePlaceholder")}
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" name="workFromHome"
                    checked={filter.workFromHome}
                    onChange={handlefilterchange}/>
                  <span>{t("jobPage.workFromHome")}</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input type="checkbox" name="partTime"
                    checked={filter.partTime}
                    onChange={handlefilterchange}/>
                  <span>{t("jobPage.partTime")}</span>
                </label>
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("jobPage.salary")}
                </label>

                <input
                  type="range"
                  name="salary"
                  min="0"
                  max="100"
                  value={filter.salary}
                  onChange={handlefilterchange}
                  className="w-full"
                />

                <div className="flex justify-between text-sm text-gray-600">
                  <span>₹0</span>
                  <span>₹50L</span>
                  <span>₹100L</span>
                </div>
              </div>
            </div>
          </div>

          {/* JOB LIST */}
          <div className="flex-1">

            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <p className="text-center font-medium text-black">
                {filteredJobs.length} {t("jobPage.jobsFound")}
              </p>
            </div>

            <div className="space-y-4">
              {filteredJobs.map((job: any) => (
                <div key={job._id}
                  className="bg-white rounded-lg shadow-sm p-6">

                  <div className="flex items-center space-x-2 text-blue-600 mb-4">
                    <ArrowUpRight className="h-5 w-5" />
                    <span className="font-medium">
                      {t("jobPage.activelyHiring")}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold">{job.title}</h2>
                  <p className="text-gray-600 mb-4">{job.company}</p>

                  <div className="grid grid-cols-3 gap-4 mb-6">

                    <div className="flex items-center space-x-2">
                      <PlayCircle className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium">
                          {t("jobPage.category")}
                        </p>
                        <p className="text-sm">{job.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Pin className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium">
                          {t("jobPage.location")}
                        </p>
                        <p className="text-sm">{job.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium">CTC</p>
                        <p className="text-sm">{job.CTC}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                        {t("jobPage.job")}
                      </span>

                      <div className="flex items-center text-green-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">
                          {t("jobPage.postedRecently")}
                        </span>
                      </div>
                    </div>

                    <a
                      href={`/detailjob/${job._id}`}
                      className="text-blue-600 font-medium"
                    >
                      {t("jobPage.viewDetails")}
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

export default index;