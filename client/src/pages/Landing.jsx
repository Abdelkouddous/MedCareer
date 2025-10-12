import { Link } from "react-router-dom";
import main from "../assets/images/main.svg";

import { useEffect, useRef, useState } from "react";
// removed useNavigate import as navigation is no longer used inline

import {
  FaSearch,
  FaMapMarkerAlt,
  FaStethoscope,
  FaBriefcase,
} from "react-icons/fa";
import { MEDICAL_SPECIALIZATION } from "../../../utils/constants";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

const Landing = () => {
  // Create refs for each section that will have animations
  const sectionRefs = {
    hero: useRef(null),
    features: useRef(null),
    jobCategories: useRef(null),
    pricing: useRef(null),
    featuredJobs: useRef(null),
    howItWorks: useRef(null),
    testimonials: useRef(null),
    statistics: useRef(null),
    blog: useRef(null),
    newsletter: useRef(null),
    cta: useRef(null),
  };

  // State for search functionality and latest jobs
  const [searchData, setSearchData] = useState({
    keywords: "",
    location: "",
    specialization: "",
  });
  const [latestJobs, setLatestJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const autoSearchTimerRef = useRef(null);

  // Fetch latest jobs (supports optional inline filtering via query string)
  const fetchLatestJobs = async (query = "") => {
    try {
      setLoadingJobs(true);
      const base = "/jobs";
      const params = new URLSearchParams();
      params.set("limit", "10");
      params.set("sort", "newest");
      if (query) {
        const extra = new URLSearchParams(query);
        extra.forEach((value, key) => {
          params.set(key, value);
        });
      }
      const url = `${base}?${params.toString()}`;
      const response = await customFetch.get(url);
      setLatestJobs(response.data.jobs || []);
    } catch (error) {
      console.error("Failed to fetch latest jobs:", error);
      toast.error("Failed to load latest jobs");
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchLatestJobs();
  }, []);

  useEffect(() => {
    // Add CSS for animations
    const style = document.createElement("style");
    style.textContent = `
      .fade-in-section {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
      }
      .fade-in-section.is-visible {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);

    // Set up the Intersection Observer
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // Observe all section refs
    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        ref.current.classList.add("fade-in-section");
        observer.observe(ref.current);
      }
    });

    // Clean up
    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
      document.head.removeChild(style);
    };
  }, []);

  // navigation hook removed (no navigation from landing inline search)

  // Build query params string for inline search (no navigation)
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    const keywords = searchData.keywords.trim();
    const location = searchData.location.trim();
    const specialization = searchData.specialization;

    if (keywords) params.set("search", keywords);
    if (location) params.set("jobLocation", location);
    if (specialization && specialization !== "all") {
      params.set("specialization", specialization);
    }

    return params.toString();
  };

  // Handle search form submission (fetch inline results instead of navigating)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = buildQueryParams();
    fetchLatestJobs(query);
  };

  // Handle search input changes
  const handleSearchChange = (field, value) => {
    setSearchData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Debounced inline fetch on input changes for faster UX
  useEffect(() => {
    // Debounce to avoid excessive navigations while typing/selecting
    if (autoSearchTimerRef.current) {
      clearTimeout(autoSearchTimerRef.current);
    }
    autoSearchTimerRef.current = setTimeout(() => {
      const query = buildQueryParams();
      fetchLatestJobs(query);
    }, 500);

    return () => {
      if (autoSearchTimerRef.current) {
        clearTimeout(autoSearchTimerRef.current);
      }
    };
  }, [searchData]);

  return (
    <>
      <div className="min-h-screen bg-[var(--background-color)]">
        {/* Hero Section with Full-Width Background and Search */}
        <section
          ref={sectionRefs.hero}
          className="relative pt-24 pb-16 min-h-[60vh]"
        >
          {/* Background image */}
          <div className="absolute inset-0">
            <img
              src={main}
              alt="Healthcare professionals background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          {/* Content overlay */}
          <div className="relative z-10 px-4">
            <div className="max-w-6xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Find your future healthcare job in{" "}
                <span className="text-[var(--primary-500)]">Algeria</span>
              </h1>
              <p className="text-white/90 text-lg md:text-xl mb-8">
                Among more than {latestJobs.length || 0} open positions
              </p>
            </div>

            {/* Full-width Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="w-screen relative left-1/2 -translate-x-1/2 bg-white/95 rounded-none shadow-lg p-4 mb-8 border border-gray-200 backdrop-blur"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Keywords Search */}
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Keywords, skills, profession..."
                    value={searchData.keywords}
                    onChange={(e) =>
                      handleSearchChange("keywords", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Location Search */}
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Region, Province"
                    value={searchData.location}
                    onChange={(e) =>
                      handleSearchChange("location", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Specialization Select */}
                <div className="relative">
                  <FaStethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={searchData.specialization}
                    onChange={(e) =>
                      handleSearchChange("specialization", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">All specialties</option>
                    {Object.values(MEDICAL_SPECIALIZATION).map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="w-full p-4 bg-[var(--primary-500)] text-[var(--white)] transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <FaSearch />
                Search
              </button>
            </form>

            {/* Quick actions */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to="/job-seekers"
                className="w-full text-center bg-[var(--primary-500)] text-[var(--white)] px-6 py-3 rounded-md font-semibold hover:bg-[var(--primary-700)] transition-all duration-200"
              >
                Job Seeker
              </Link>
              <Link
                to="/register?role=employer"
                className="w-full text-center border-2 border-[var(--primary-500)] text-[var(--primary-500)] px-6 py-3 rounded-md font-semibold hover:bg-[var(--primary-500)] hover:text-[var(--white)] transition-all duration-200 bg-white/90"
              >
                Employer
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Medical Jobs Section */}
        <section ref={sectionRefs.featuredJobs} className="py-16 px-4 bg-[var(--background-secondary-color)] fade-in-section">
          <div className="container mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-color)]">
                Featured <span className="text-[var(--primary-500)]">Medical Jobs</span>
              </h2>
            </div>

            {loadingJobs ? (
              <div className="flex items-center justify-center min-h-32">
                <div className="loading"></div>
              </div>
            ) : latestJobs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[var(--text-secondary-color)]">No featured jobs available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {latestJobs.slice(0, 3).map((job) => (
                  <div key={job._id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-[var(--text-color)]">{job.position}</h3>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          job.jobType === "full-time"
                            ? "bg-[var(--primary-100)] text-[var(--primary-700)]"
                            : "bg-[var(--background-secondary-color)] text-[var(--text-color)]"
                        }`}
                      >
                        {job.jobType?.replace(/-/g, " ")?.replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                    </div>
                    <div className="text-[var(--primary-700)] font-medium mb-2">{job.company}</div>
                    <div className="space-y-2 text-[var(--text-secondary-color)] mb-4">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt /> <span>{job.jobLocation}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaStethoscope /> <span>{job.specialization}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaBriefcase /> <span className="capitalize">{job.jobType}</span>
                      </div>
                    </div>
                    <Link to="/job-seekers/jobs" className="text-[var(--primary-500)] font-semibold hover:text-[var(--primary-700)]">
                      View Details ➜
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Latest Jobs Section - Moved to top after hero */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            {loadingJobs ? (
              <div className="flex items-center justify-center min-h-64">
                <div className="loading"></div>
              </div>
            ) : latestJobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[var(--text-secondary-color)] text-lg">
                  No job opportunities available at the moment.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {latestJobs.slice(0, 10).map((job) => (
                  <div
                    key={job._id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-[var(--text-color)] hover:text-[var(--primary-500)] cursor-pointer">
                          {job.position}
                        </h3>
                        <span className="text-sm text-[var(--text-secondary-color)] ml-4">
                          {job.company}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary-color)] mb-2">
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="mr-1" />
                          <span>{job.jobLocation}</span>
                        </div>
                        <div className="flex items-center">
                          <FaStethoscope className="mr-1" />
                          <span>{job.specialization}</span>
                        </div>
                        <div className="flex items-center">
                          <FaBriefcase className="mr-1" />
                          <span className="capitalize">{job.jobType}</span>
                        </div>
                      </div>

                      <div className="text-xs text-[var(--text-secondary-color)]">
                        Posted on {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 md:ml-6">
                      <Link
                        to="/job-seekers/jobs"
                        className="inline-block bg-[var(--primary-500)] text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-[var(--primary-700)] transition-colors duration-200"
                      >
                        Apply Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* About Us Section */}
        <section className="py-16 px-4 bg-[var(--background-secondary-color)]">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-color)] mb-8">
                Who are we? 🧐
              </h2>
              <p className="text-[var(--text-secondary-color)] text-lg leading-relaxed mb-6">
                Tired of recruiters who think Java is a detergent brand? That
                HTML (sic) is a programming language? Trust your healthcare
                career to the &apos;MedCareer&apos; community that speaks the
                same language(s) as you.
              </p>
              <button className="text-[var(--primary-500)] font-semibold hover:text-[var(--primary-700)] transition-colors duration-200">
                Show more
              </button>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-color)] mb-8">
                Our mission 🚀
              </h2>
              <p className="text-[var(--text-secondary-color)] text-lg leading-relaxed mb-6">
                Enable healthcare professionals (doctors, nurses, pharmacists,
                etc.) to find the job that matches their medical specializations
                and preferred methodologies.
              </p>
              <p className="text-[var(--text-secondary-color)] text-lg leading-relaxed mb-6">
                We help startups, healthcare service companies and any
                organization requiring medical professionals or healthcare
                services to strengthen their teams with the best-suited
                profiles.
              </p>
              <button className="text-[var(--primary-500)] font-semibold hover:text-[var(--primary-700)] transition-colors duration-200">
                Show more
              </button>
            </div>
          </div>
        </section>

        {/* Featured Company Section */}
        <section className="py-16 px-4 bg-[var(--background-secondary-color)]">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-color)] text-center mb-12">
                Featured Company
              </h2>
              <div className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-2xl font-bold text-[var(--text-color)] mb-4">
                  MedTech Solutions
                </h3>
                <p className="text-[var(--text-secondary-color)] leading-relaxed">
                  MedTech Solutions is a healthcare technology platform that
                  aims to connect patients with medical professionals and help
                  them:
                </p>
                <ul className="mt-4 space-y-2 text-[var(--text-secondary-color)]">
                  <li>
                    • Find the right specialist doctor according to specialties
                  </li>
                  <li>• Build reliable medical strategies</li>
                  <li>• Analyze medical documents</li>
                  <li>• Find relevant connections in the MEDICAL BIG DATA</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Job of the Day Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-color)] text-center mb-12">
                Profession of the day
              </h2>
              <div className="bg-[var(--background-secondary-color)] rounded-lg p-8">
                <h3 className="text-2xl font-bold text-[var(--text-color)] mb-4">
                  Nurse Practitioner: Advanced Practice Nursing
                </h3>
                <p className="text-[var(--text-secondary-color)] leading-relaxed mb-4">
                  Nurse Practitioner (NP) is a specialized profession in
                  advanced nursing practice processes.
                </p>
                <p className="text-[var(--text-secondary-color)] leading-relaxed mb-6">
                  The NP has the responsibility to ensure, once the patient is
                  assessed and treatment is provided, that care is compliant
                  with requirements and meets quality criteria in terms of both
                  functionality and safety standards.
                </p>
                <Link
                  to="/job-seekers/jobs"
                  className="text-[var(--primary-500)] font-semibold hover:text-[var(--primary-700)] transition-colors duration-200"
                >
                  [Read more...]
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Registration Section */}
        <section className="py-16 px-4 bg-[var(--primary-500)]">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                I don&apos;t have time, sign me up!
              </h2>
              <p className="text-white/90 text-lg mb-8">
                Upload your CV and let our recruitment team fill out your
                profile and subscribe you to alerts for the medical specialties
                you master.
              </p>
              <div className="bg-white rounded-lg p-8 max-w-md mx-auto">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="w-12 h-12 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    id="cv-upload"
                  />
                  <label htmlFor="cv-upload" className="cursor-pointer">
                    <p className="text-gray-600 mb-2">
                      Drag and drop a file or click here
                    </p>
                    <p className="text-sm text-gray-400">(.pdf, .doc, .docx)</p>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          ref={sectionRefs.howItWorks}
          className="py-16 px-4 bg-[var(--background-secondary-color)]"
        >
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-color)] text-center mb-12">
              How It <span className="text-[var(--primary-500)]">Works</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[var(--primary-500)] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold text-[var(--text-color)] mb-4">
                  Create Your Profile
                </h3>
                <p className="text-[var(--text-secondary-color)]">
                  Sign up and create your professional medical profile with your
                  qualifications and experience.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[var(--primary-500)] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold text-[var(--text-color)] mb-4">
                  Browse Opportunities
                </h3>
                <p className="text-[var(--text-secondary-color)]">
                  Search through thousands of verified medical job listings from
                  top healthcare institutions.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[var(--primary-500)] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold text-[var(--text-color)] mb-4">
                  Apply & Connect
                </h3>
                <p className="text-[var(--text-secondary-color)]">
                  Apply to positions that match your skills and connect directly
                  with healthcare employers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section ref={sectionRefs.testimonials} className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-color)] text-center mb-12">
              What Medical Professionals{" "}
              <span className="text-[var(--primary-500)]">Say</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[var(--background-secondary-color)] p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                  <div>
                    <h3 className="font-bold text-[var(--text-color)]">
                      Dr. Sarah Johnson
                    </h3>
                    <p className="text-[var(--primary-500)]">Cardiologist</p>
                  </div>
                </div>
                <p className="text-[var(--text-secondary-color)] italic">
                  &quot;Found my dream position at a leading hospital through
                  MedCareer Connect. The process was smooth and
                  professional.&quot;
                </p>
              </div>
              <div className="bg-[var(--background-secondary-color)] p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                  <div>
                    <h3 className="font-bold text-[var(--text-color)]">
                      James Wilson
                    </h3>
                    <p className="text-[var(--primary-500)]">
                      Registered Nurse
                    </p>
                  </div>
                </div>
                <p className="text-[var(--text-secondary-color)] italic">
                  &quot;The platform made it easy to find and apply to relevant
                  nursing positions. I&apos;m now working at an amazing
                  facility.&quot;
                </p>
              </div>
              <div className="bg-[var(--background-secondary-color)] p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                  <div>
                    <h3 className="font-bold text-[var(--text-color)]">
                      Dr. Emily Chen
                    </h3>
                    <p className="text-[var(--primary-500)]">Pediatrician</p>
                  </div>
                </div>
                <p className="text-[var(--text-secondary-color)] italic">
                  &quot;Excellent platform for medical professionals. Found
                  great opportunities and the support team was very
                  helpful.&quot;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section
          ref={sectionRefs.statistics}
          className="py-16 px-4 bg-[var(--background-secondary-color)]"
        >
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-[var(--primary-500)] mb-2">
                  10K+
                </div>
                <p className="text-[var(--text-secondary-color)]">
                  Active Jobs
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[var(--primary-500)] mb-2">
                  5K+
                </div>
                <p className="text-[var(--text-secondary-color)]">Companies</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[var(--primary-500)] mb-2">
                  50K+
                </div>
                <p className="text-[var(--text-secondary-color)]">Candidates</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[var(--primary-500)] mb-2">
                  95%
                </div>
                <p className="text-[var(--text-secondary-color)]">
                  Success Rate
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Blog Posts */}
        <section ref={sectionRefs.blog} className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-color)] text-center mb-12">
              Latest from our{" "}
              <span className="text-[var(--primary-500)]">Blog</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link to="/blog/1" className="group">
                <div className="bg-[var(--background-secondary-color)] rounded-lg overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <span className="text-[var(--primary-500)] text-sm font-semibold">
                      Career Advice
                    </span>
                    <h3 className="text-xl font-bold text-[var(--text-color)] mt-2 group-hover:text-[var(--primary-500)] transition-colors duration-200">
                      Top Medical Career Trends in 2024
                    </h3>
                    <p className="text-[var(--text-secondary-color)] mt-2">
                      Mar 15, 2024
                    </p>
                  </div>
                </div>
              </Link>
              <Link to="/blog/2" className="group">
                <div className="bg-[var(--background-secondary-color)] rounded-lg overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <span className="text-[var(--primary-500)] text-sm font-semibold">
                      Tips & Tricks
                    </span>
                    <h3 className="text-xl font-bold text-[var(--text-color)] mt-2 group-hover:text-[var(--primary-500)] transition-colors duration-200">
                      How to Ace Your Medical Job Interview
                    </h3>
                    <p className="text-[var(--text-secondary-color)] mt-2">
                      Mar 12, 2024
                    </p>
                  </div>
                </div>
              </Link>
              <Link to="/blog/3" className="group">
                <div className="bg-[var(--background-secondary-color)] rounded-lg overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <span className="text-[var(--primary-500)] text-sm font-semibold">
                      Industry Insights
                    </span>
                    <h3 className="text-xl font-bold text-[var(--text-color)] mt-2 group-hover:text-[var(--primary-500)] transition-colors duration-200">
                      Healthcare Industry Salary Guide
                    </h3>
                    <p className="text-[var(--text-secondary-color)] mt-2">
                      Mar 10, 2024
                    </p>
                  </div>
                </div>
              </Link>
            </div>
            <div className="text-center mt-8">
              <Link
                to="/blog"
                className="inline-block border-2 border-[var(--primary-500)] text-[var(--primary-500)] px-8 py-3 rounded-md font-bold text-lg hover:bg-[var(--primary-500)] hover:text-[var(--white)] transition-all duration-200"
              >
                View All Posts
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section ref={sectionRefs.newsletter} className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-[var(--primary-500)] rounded-lg p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Stay Updated with Medical Opportunities
              </h2>
              <p className="text-white/90 mb-8">
                Subscribe to our newsletter for the latest medical jobs, career
                advice, and healthcare industry insights.
              </p>
              <form className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-md text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="submit"
                  className="bg-white text-[var(--primary-500)] px-8 py-3 rounded-md font-bold hover:bg-gray-100 transition-all duration-200"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Landing;
