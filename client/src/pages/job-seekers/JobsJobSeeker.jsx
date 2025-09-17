import { useEffect, useState } from "react";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import {
  Work,
  LocationOn,
  Business,
  Category,
  Search,
  FilterList,
  BookmarkBorder,
  Bookmark,
  AccessTime,
  AttachMoney,
  TrendingUp,
} from "@mui/icons-material";

function JobsJobSeeker() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [filters, setFilters] = useState({
    jobType: "",
    specialization: "",
    location: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await customFetch.get("/jobs");
      setJobs(res.data.jobs || []);
      setFilteredJobs(res.data.jobs || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const apply = async (jobId) => {
    try {
      const token = localStorage.getItem("jobseeker_token");
      if (!token) {
        toast.info("Please login as Job Seeker first");
        return;
      }
      await customFetch.post(`/jobseekers/apply/${jobId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Application sent successfully!");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to apply");
    }
  };

  const toggleSaveJob = (jobId) => {
    const newSavedJobs = new Set(savedJobs);
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
      toast.info("Job removed from saved");
    } else {
      newSavedJobs.add(jobId);
      toast.success("Job saved for later");
    }
    setSavedJobs(newSavedJobs);
  };

  const applyFilters = () => {
    let filtered = jobs.filter((job) => {
      const matchesSearch =
        job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.specialization.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesJobType =
        !filters.jobType || job.jobType === filters.jobType;
      const matchesSpecialization =
        !filters.specialization ||
        job.specialization === filters.specialization;
      const matchesLocation =
        !filters.location ||
        (job.jobLocation &&
          job.jobLocation
            .toLowerCase()
            .includes(filters.location.toLowerCase()));

      return (
        matchesSearch &&
        matchesJobType &&
        matchesSpecialization &&
        matchesLocation
      );
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "company":
          return a.company.localeCompare(b.company);
        case "position":
          return a.position.localeCompare(b.position);
        default:
          return 0;
      }
    });

    setFilteredJobs(filtered);
  };

  const clearFilters = () => {
    setFilters({ jobType: "", specialization: "", location: "" });
    setSearchTerm("");
    setSortBy("newest");
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, jobs, filters, sortBy]);

  // Get unique values for filter options
  const uniqueJobTypes = [...new Set(jobs.map((job) => job.jobType))];
  const uniqueSpecializations = [
    ...new Set(jobs.map((job) => job.specialization)),
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="loading"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-color)] mb-2">
              Find Your Dream Job
            </h1>
            <p className="text-[var(--text-secondary-color)]">
              Discover opportunities that match your skills and aspirations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="text-[var(--primary-500)]" />
            <span className="text-sm text-[var(--text-secondary-color)]">
              {jobs.length} jobs available
            </span>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div
          className="bg-[var(--background-secondary-color)] p-4 rounded-lg border border-[var(--grey-200)]"
          style={{ boxShadow: "var(--shadow-1)" }}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-stretch">
            {/* Search Input - 66% width on large screens */}
            <div className="flex-1 lg:w-2/3">
              <div className="relative">
                <Search className="absolute left-1 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary-color)]" />
                <input
                  type="text"
                  placeholder="Search jobs by position, company, or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10  "
                />
              </div>
            </div>

            {/* Filter Controls - 33% width on large screens */}
            <div className="flex flex-col sm:flex-row gap-2 lg:w-1/3">
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn-hipster flex items-center justify-center gap-2 whitespace-nowrap ${
                  showFilters
                    ? "bg-[var(--primary-100)] text-[var(--primary-700)]"
                    : ""
                }`}
              >
                <FilterList />
                Filters
              </button>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select flex-1"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="company">Company A-Z</option>
                <option value="position">Position A-Z</option>
              </select>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-[var(--grey-200)]">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="form-row">
                  <label className="form-label">Job Type</label>
                  <select
                    value={filters.jobType}
                    onChange={(e) =>
                      setFilters({ ...filters, jobType: e.target.value })
                    }
                    className="form-select"
                  >
                    <option value="">All Types</option>
                    {uniqueJobTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <label className="form-label">Specialization</label>
                  <select
                    value={filters.specialization}
                    onChange={(e) =>
                      setFilters({ ...filters, specialization: e.target.value })
                    }
                    className="form-select"
                  >
                    <option value="">All Specializations</option>
                    {uniqueSpecializations.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={filters.location}
                    onChange={(e) =>
                      setFilters({ ...filters, location: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button onClick={clearFilters} className="btn-hipster">
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid gap-6">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <Work className="mx-auto mb-4 text-6xl text-[var(--grey-400)]" />
            <h3 className="text-xl font-semibold text-[var(--text-secondary-color)] mb-2">
              No jobs found
            </h3>
            <p className="text-[var(--text-secondary-color)] mb-4">
              {searchTerm || Object.values(filters).some((f) => f)
                ? "Try adjusting your search terms or filters"
                : "Check back later for new opportunities"}
            </p>
            {(searchTerm || Object.values(filters).some((f) => f)) && (
              <button onClick={clearFilters} className="btn">
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job._id}
              className="bg-[var(--background-secondary-color)] p-6 rounded-lg border border-[var(--grey-200)] hover:shadow-lg transition-all duration-300 hover:border-[var(--primary-200)]"
              style={{ boxShadow: "var(--shadow-1)" }}
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-[var(--primary-100)] p-3 rounded-lg flex-shrink-0">
                      <Work className="text-[var(--primary-500)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-xl font-bold text-[var(--text-color)] truncate">
                          {job.position}
                        </h3>
                        <button
                          onClick={() => toggleSaveJob(job._id)}
                          className="text-[var(--text-secondary-color)] hover:text-[var(--primary-500)] transition-colors flex-shrink-0"
                        >
                          {savedJobs.has(job._id) ? (
                            <Bookmark />
                          ) : (
                            <BookmarkBorder />
                          )}
                        </button>
                      </div>

                      <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-2">
                          <Business className="text-[var(--text-secondary-color)] text-sm flex-shrink-0" />
                          <span className="text-[var(--text-secondary-color)] font-medium truncate">
                            {job.company}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <LocationOn className="text-[var(--text-secondary-color)] text-sm flex-shrink-0" />
                          <span className="text-[var(--text-secondary-color)] truncate">
                            {job.jobLocation || "Remote"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AccessTime className="text-[var(--text-secondary-color)] text-sm flex-shrink-0" />
                          <span className="text-[var(--text-secondary-color)] text-sm">
                            Posted{" "}
                            {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-[var(--primary-100)] text-[var(--primary-700)] rounded-full text-sm font-medium">
                      {job.specialization}
                    </span>
                    <span className="px-3 py-1 bg-[var(--grey-100)] text-[var(--grey-700)] rounded-full text-sm">
                      {job.jobType}
                    </span>
                    <span className="px-3 py-1 bg-[var(--grey-100)] text-[var(--grey-700)] rounded-full text-sm flex items-center gap-1">
                      <Category className="text-xs" />
                      {job.jobCategory}
                    </span>
                  </div>

                  {job.description && (
                    <p className="text-[var(--text-secondary-color)] mb-4 line-clamp-3 leading-relaxed">
                      {job.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-3 lg:ml-4 lg:min-w-[140px]">
                  <button
                    className="btn flex items-center justify-center gap-2"
                    onClick={() => apply(job._id)}
                    style={{
                      padding: "0.75rem 1.5rem",
                    }}
                  >
                    <Work className="text-sm" />
                    Apply Now
                  </button>

                  <div className="text-center">
                    <div className="text-xs text-[var(--text-secondary-color)] mb-1">
                      Salary Range
                    </div>
                    <div className="flex items-center justify-center gap-1 text-sm font-medium text-[var(--text-color)]">
                      <AttachMoney className="text-xs" />
                      {job.salary || "Negotiable"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Results Summary */}
      {filteredJobs.length > 0 && (
        <div className="mt-8 p-4 bg-[var(--background-secondary-color)] rounded-lg border border-[var(--grey-200)] text-center">
          <p className="text-[var(--text-secondary-color)]">
            Showing{" "}
            <span className="font-semibold text-[var(--text-color)]">
              {filteredJobs.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[var(--text-color)]">
              {jobs.length}
            </span>{" "}
            available jobs
            {savedJobs.size > 0 && (
              <span className="ml-4">
                •{" "}
                <span className="font-semibold text-[var(--primary-600)]">
                  {savedJobs.size}
                </span>{" "}
                jobs saved
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

export default JobsJobSeeker;
