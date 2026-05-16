import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { PageWrapper } from "../../assets/wrappers/AllJobsWrapper";

function JobsJobSeeker() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [isGuest, setIsGuest] = useState(false);
  const [filters, setFilters] = useState({
    jobType: "",
    specialization: "",
    location: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const jobsPerPage = 10;

  const locationHook = useLocation();
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filters.jobType) params.jobType = filters.jobType;
      if (filters.specialization)
        params.specialization = filters.specialization;
      if (filters.location) params.jobLocation = filters.location;
      if (sortBy) params.sort = sortBy;

      const res = await customFetch.get("/jobs", { params });
      setJobs(res.data.jobs || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const apply = async (jobId) => {
    try {
      // Check cookie-based auth
      await customFetch.get("/jobseekers/me");
      // Authenticated; apply without manual headers
      await customFetch.post(`/jobseekers/apply/${jobId}`);
      toast.success("Application sent successfully!");
    } catch (e) {
      if (e?.response?.status === 401) {
        toast.info("Please create an account or log in to apply");
        navigate("/job-seekers/register");
      } else {
        toast.error(e?.response?.data?.message || "Failed to apply");
      }
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

  // Initialize state from URL params on first render or when URL changes
  useEffect(() => {
    const params = new URLSearchParams(locationHook.search);
    const initialSearch = params.get("search") || "";
    const initialLocation = params.get("jobLocation") || "";
    const initialSpec = params.get("specialization") || "";
    const initialJobType = params.get("jobType") || "";
    const initialSort = params.get("sort") || "newest";

    setSearchTerm(initialSearch);
    setFilters({
      jobType: initialJobType,
      specialization: initialSpec,
      location: initialLocation,
    });
    setSortBy(initialSort);
  }, [locationHook.search]);

  // Detect guest by attempting cookie-authenticated call
  useEffect(() => {
    const checkGuest = async () => {
      try {
        await customFetch.get("/jobseekers/me");
        setIsGuest(false);
      } catch {
        setIsGuest(true);
      }
    };
    checkGuest();
  }, []);

  const clearFilters = () => {
    setFilters({ jobType: "", specialization: "", location: "" });
    setSearchTerm("");
    setSortBy("newest");
  };

  // Sync URL with current filters for shareable/searchable state
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (filters.location) params.set("jobLocation", filters.location);
    if (filters.jobType) params.set("jobType", filters.jobType);
    if (filters.specialization)
      params.set("specialization", filters.specialization);
    if (sortBy && sortBy !== "newest") params.set("sort", sortBy);

    const targetPath = locationHook.pathname.startsWith("/job-seekers")
      ? "/job-seekers/jobs"
      : "/jobs";
    navigate(
      {
        pathname: targetPath,
        search: params.toString() ? `?${params.toString()}` : "",
      },
      { replace: true }
    );
  }, [searchTerm, filters, sortBy, locationHook.pathname, navigate]);

  // Fetch jobs from server whenever filters/sort/search change
  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filters, sortBy]);

  // Reset to first page whenever filters/sort/search change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, filters, sortBy]);

  // Get unique values for filter options
  const uniqueJobTypes = [...new Set(jobs.map((job) => job.jobType))];
  const uniqueSpecializations = [
    ...new Set(jobs.map((job) => job.specialization)),
  ];

  // Pagination calculations
  const totalJobs = jobs.length;
  const numOfPages = Math.ceil(totalJobs / jobsPerPage) || 1;
  const indexOfLastJob = page * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const changePage = (newPage) => {
    if (newPage < 1) newPage = 1;
    if (newPage > numOfPages) newPage = numOfPages;
    setPage(newPage);
    // Scroll to top of list on page change for better UX
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="loading"></div>
      </div>
    );
  }

  return (
    <PageWrapper>
      {/* Guest CTA Banner */}
      {isGuest && (
        <div
          className="mb-6 p-4 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-3"
          style={{ background: "rgba(0,194,168,0.1)", border: "1px solid rgba(0,194,168,0.25)" }}
        >
          <p style={{ color: "var(--primary-500)", margin: 0 }}>
            You can browse jobs without an account. Create an account or log
            in to apply.
          </p>
          <div className="flex gap-2">
            <button
              className="btn-hipster"
              onClick={() => navigate("/job-seekers/register")}
            >
              Create Account
            </button>
            <button
              className="btn"
              onClick={() => navigate("/job-seekers/login")}
            >
              Log In
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-color)" }}>
              Find Your Dream Job
            </h1>
            <p style={{ color: "var(--text-secondary-color)", margin: 0 }}>
              Discover opportunities that match your skills and aspirations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp style={{ color: "var(--primary-500)" }} />
            <span className="text-sm" style={{ color: "var(--text-secondary-color)" }}>
              {jobs.length} jobs available
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div
          className="p-4 rounded-xl"
          style={{ background: "var(--surface-primary)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-1)" }}
        >
          <div className="flex flex-col lg:flex-row gap-3 items-stretch">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: "var(--text-secondary-color)" }} />
                <input
                  type="text"
                  placeholder="Search jobs by position, company, or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
              style={{ maxWidth: "180px" }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="company">Clinic A-Z</option>
              <option value="position">Position A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2-Column Layout: Filters Sidebar + Jobs Grid */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Sidebar */}
        <aside
          className="lg:w-64 flex-shrink-0"
        >
          <div
            className="glass-card p-5 lg:sticky lg:top-20"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold m-0" style={{ color: "var(--text-color)" }}>
                <FilterList className="inline mr-2 text-base" style={{ color: "var(--primary-500)" }} />
                Filters
              </h3>
              <button
                onClick={clearFilters}
                className="text-xs font-medium"
                style={{ color: "var(--primary-500)", background: "none", border: "none", cursor: "pointer" }}
              >
                Clear
              </button>
            </div>

            {/* Job Type */}
            <div className="mb-4">
              <label className="text-xs font-medium mb-2 block" style={{ color: "var(--text-secondary-color)" }}>
                Job Type
              </label>
              <select
                value={filters.jobType}
                onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                className="form-select text-sm"
              >
                <option value="">All Types</option>
                {uniqueJobTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Specialization */}
            <div className="mb-4">
              <label className="text-xs font-medium mb-2 block" style={{ color: "var(--text-secondary-color)" }}>
                Specialization
              </label>
              <select
                value={filters.specialization}
                onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
                className="form-select text-sm"
              >
                <option value="">All Specializations</option>
                {uniqueSpecializations.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="mb-2">
              <label className="text-xs font-medium mb-2 block" style={{ color: "var(--text-secondary-color)" }}>
                Location
              </label>
              <input
                type="text"
                placeholder="Enter location"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="form-input text-sm"
              />
            </div>
          </div>
        </aside>

        {/* Jobs Grid */}
        <div className="flex-1">
          {jobs.length === 0 ? (
            <div className="text-center py-16 glass-card">
              <Work className="mx-auto mb-4 text-6xl" style={{ color: "var(--text-secondary-color)", opacity: 0.3 }} />
              <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--text-secondary-color)" }}>
                No jobs found
              </h3>
              <p style={{ color: "var(--text-secondary-color)" }} className="mb-4">
                {searchTerm || Object.values(filters).some((f) => f)
                  ? "Try adjusting your search terms or filters"
                  : "Check back later for new opportunities"}
              </p>
              {(searchTerm || Object.values(filters).some((f) => f)) && (
                <button onClick={clearFilters} className="btn">Clear Filters</button>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {currentJobs.map((job) => (
                <div
                  key={job._id}
                  className="glass-card p-5"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-3">
                        {/* Hospital initial avatar */}
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold flex-shrink-0"
                          style={{ background: "rgba(0,194,168,0.15)", color: "var(--primary-500)" }}
                        >
                          {job.company?.charAt(0)?.toUpperCase() || "C"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="text-lg font-bold truncate m-0" style={{ color: "var(--text-color)" }}>
                              {job.position}
                            </h3>
                            <button
                              onClick={() => toggleSaveJob(job._id)}
                              className="flex-shrink-0"
                              style={{ background: "none", border: "none", cursor: "pointer", color: savedJobs.has(job._id) ? "var(--primary-500)" : "var(--text-secondary-color)" }}
                            >
                              {savedJobs.has(job._id) ? <Bookmark /> : <BookmarkBorder />}
                            </button>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Business className="text-sm" style={{ color: "var(--text-secondary-color)" }} />
                            <span className="text-sm" style={{ color: "var(--text-secondary-color)" }}>{job.company}</span>
                            <span style={{ color: "var(--text-secondary-color)" }}>•</span>
                            <LocationOn className="text-sm" style={{ color: "var(--text-secondary-color)" }} />
                            <span className="text-sm" style={{ color: "var(--text-secondary-color)" }}>{job.jobLocation || "Remote"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3 ml-15">
                        <span
                          className="px-3 py-1 rounded-lg text-xs font-semibold"
                          style={{ background: "rgba(0,194,168,0.12)", color: "var(--primary-500)" }}
                        >
                          {job.specialization}
                        </span>
                        <span
                          className="px-3 py-1 rounded-lg text-xs font-medium"
                          style={{ background: "var(--surface-secondary)", color: "var(--text-secondary-color)" }}
                        >
                          {job.jobType}
                        </span>
                        {job.jobCategory && (
                          <span
                            className="px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1"
                            style={{ background: "var(--surface-secondary)", color: "var(--text-secondary-color)" }}
                          >
                            <Category className="text-xs" />
                            {job.jobCategory}
                          </span>
                        )}
                      </div>

                      {job.description && (
                        <p className="text-sm line-clamp-2 leading-relaxed ml-15" style={{ color: "var(--text-secondary-color)", margin: 0 }}>
                          {job.description}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-row lg:flex-col items-center gap-3 lg:ml-4 lg:min-w-[130px]">
                      <button
                        className="btn flex items-center justify-center gap-2 text-sm"
                        onClick={() => apply(job._id)}
                        style={{ padding: "0.6rem 1.25rem" }}
                      >
                        <Work className="text-sm" />
                        Apply Now
                      </button>
                      <div className="text-center">
                        <div className="text-xs" style={{ color: "var(--text-secondary-color)" }}>Salary</div>
                        <div className="text-sm font-semibold flex items-center justify-center gap-1" style={{ color: "var(--text-color)" }}>
                          <AttachMoney className="text-xs" />
                          {job.salary || "Negotiable"}
                        </div>
                      </div>
                      <div className="text-xs" style={{ color: "var(--text-secondary-color)" }}>
                        <AccessTime className="text-xs mr-1" style={{ verticalAlign: "middle" }} />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalJobs > jobsPerPage && (
            <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
              <button
                className="btn"
                onClick={() => changePage(page - 1)}
                disabled={page === 1}
                style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
              >
                Prev
              </button>
              {Array.from({ length: numOfPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className="text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-200"
                  onClick={() => changePage(p)}
                  style={{
                    background: p === page ? "var(--primary-500)" : "transparent",
                    color: p === page ? "#fff" : "var(--text-secondary-color)",
                    border: p === page ? "none" : "1px solid var(--border-color)",
                    cursor: "pointer",
                  }}
                >
                  {p}
                </button>
              ))}
              <button
                className="btn"
                onClick={() => changePage(page + 1)}
                disabled={page === numOfPages}
                style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
              >
                Next
              </button>
            </div>
          )}

          {/* Results Summary */}
          {totalJobs > 0 && (
            <div className="mt-6 p-4 glass-card text-center">
              <p style={{ color: "var(--text-secondary-color)", margin: 0 }}>
                Showing
                <span className="font-semibold ml-1" style={{ color: "var(--text-color)" }}>
                  {totalJobs === 0
                    ? 0
                    : `${indexOfFirstJob + 1}-${Math.min(indexOfLastJob, totalJobs)}`}
                </span>
                <span className="ml-1">of</span>
                <span className="font-semibold ml-1" style={{ color: "var(--text-color)" }}>
                  {totalJobs}
                </span>
                {" "}jobs
                {savedJobs.size > 0 && (
                  <span className="ml-4">
                    •{" "}
                    <span className="font-semibold" style={{ color: "var(--primary-500)" }}>
                      {savedJobs.size}
                    </span>{" "}
                    jobs saved
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

export default JobsJobSeeker;
