import { Link } from "react-router-dom";
import missionImg from "../assets/images/main-alternative.svg";
import featuredLogo from "../assets/images/00-dis--logo.svg";
import professionImg from "../assets/images/avatar-2.jpg";
import heroBg from "../assets/images/image.png";

import { useEffect, useRef, useState } from "react";
// removed useNavigate import as navigation is no longer used inline

import {
  FaSearch,
  FaMapMarkerAlt,
  FaStethoscope,
  FaBriefcase,
  FaHospital,
  FaFire,
} from "react-icons/fa";
import { MEDICAL_SPECIALIZATION } from "../../../utils/constants";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import Wrapper from "../assets/wrappers/Dashboard";
import CountUpNumber from "./components/CountUpNumber";
// import Job from "./components/Job"; // Removed unused import
import JobInLanding from "./components/JobInLanding";

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
  const [allJobs, setAllJobs] = useState([]);
  const [allEmployers, setallEmployers] = useState([]);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [allCandidates, setAllCandidates] = useState([]);

  const [loadingJobs, setLoadingJobs] = useState(true);
  const autoSearchTimerRef = useRef(null);

  const fetchAllJobs = async () => {
    try {
      setLoadingJobs(true);
      const response = await customFetch.get("/jobs");
      setAllJobs(response.data.jobs || []);
    } catch (error) {
      console.error("Failed to fetch latest jobs:", error);
      toast.error("Failed to load latest jobs");
    } finally {
      setLoadingJobs(false);
    }
  };
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

  // fetch all users
  const fetchallEmployers = async () => {
    try {
      setLoadingJobs(true);
      const response = await customFetch.get("/all-employers");
      setallEmployers(response.data.users || []);
    } catch (error) {
      console.error("Failed to fetch latest employers:", error);
      toast.error("Failed to load latest employers");
    } finally {
      setLoadingJobs(false);
    }
  };

  // fetch all candidates
  const fetchAllCandidates = async () => {
    try {
      setLoadingJobs(true);
      // Use public global endpoint that returns { jobSeekers, count }
      const response = await customFetch.get("/all-seekers");
      setAllCandidates(response.data.jobSeekers || []);
    } catch (error) {
      console.error("Failed to fetch latest candidates:", error);
      toast.error("Failed to load latest candidates");
    } finally {
      setLoadingJobs(false);
    }
  };

  // fetch latest blogs
  const fetchLatestBlogs = async () => {
    try {
      const response = await customFetch.get("/blogs?limit=3&sort=newest");
      setLatestBlogs(response.data.blogs || []);
    } catch (error) {
      console.error("Failed to fetch latest blogs:", error);
      toast.error("Failed to load latest blogs");
    }
  };

  useEffect(() => {
    fetchLatestJobs();
    fetchAllJobs();
    fetchallEmployers();
    fetchAllCandidates();
    fetchLatestBlogs();
  }, []);

  useEffect(() => {
    // Add CSS for animations
    const style = document.createElement("style");
    style.textContent = `
      .fade-in-section {
        opacity: 0;
        transform: translateY(50px);
        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
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
          className="relative pt-16 pb-16 min-h-[60vh]"
        >
          {/* Background image + gradient filter */}
          <div className="absolute inset-0 bg-[url('/image.png')] bg-cover bg-center bg-no-repeat">
            {/* Gradient overlay acts as a color filter on top of the image */}
            <div className="absolute inset-0 bg-gradient-to-l from-[var(--hero-gradient-from)] to-[var(--hero-gradient-to)] opacity-70" />
            <img
              src={heroBg}
              alt="Healthcare professionals background"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Total jobs posted  */}
          <div className="relative z-10 px-4 text-xl md:text-2xl mb-2 flex items-center text-[var(--text-primary-500)] ">
            <FaFire></FaFire>
            <span className="mr-1 text-[var(--primary-500)]">
              {" "}
              <CountUpNumber end={allJobs.length || 0} />{" "}
            </span>{" "}
            jobs posted
          </div>
          {/* Content overlay */}
          <div className="relative z-10 px-4">
            {/* Content */}
            <div className="max-w-6xl mx-auto">
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold  mb-6">
                The <span className="text-[var(--primary-500)]">Largest</span>{" "}
                healthcare job portal in
                <span className="text-[var(--primary-500)]"> Algeria</span>
              </h3>
            </div>
            {/* Employer CTA: Post a Job (shown before search functionality) */}
            <div className="flex justify-center mb-6">
              <Link
                to="/register?role=employer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--cta-gradient-from)] to-[var(--cta-gradient-to)]  px-6 py-3 rounded-md font-semibold shadow-md hover:shadow-lg hover:opacity-98 transition-all duration-200"
              >
                <FaBriefcase />
                Post a job
              </Link>
            </div>

            {/* Full-width Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className=" m-2 relative left-1/2 -translate-x-1/2 bg-white/95 rounded-none shadow-lg p-4 mb-8 border border-gray-200 backdrop-blur"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 m-2">
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent"
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent"
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
                    className="w-full text-[var(--primary-900)] pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent appearance-none "
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
              <div className="w-full inline-flex items-center gap-2 bg-gradient-to-r from-[var(--primary-300)] to-[var(--primary-700)] text-[var(--white)] px-6 py-3 rounded-md font-semibold shadow-md hover:shadow-lg hover:opacity-95 transition-all duration-200 relative  justify-center bg-[var(--primary-500)] p-4  border-r-4">
                <p>See among {latestJobs.length || 0} open positions</p>
              </div>

              {/* Search Button */}
              {/* <button
                type="submit"
                className="w-full p-4 bg-[var(--primary-500)] text-[var(--white)] transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <FaSearch />
                Search
              </button> */}
            </form>
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
                  <CountUpNumber end={allJobs.length || 0} />
                </div>
                <p className="text-[var(--text-secondary-color)]">
                  Active Jobs
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[var(--primary-500)] mb-2">
                  <CountUpNumber end={allEmployers.length || 0} />
                </div>
                <p className="text-[var(--text-secondary-color)]">Companies</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[var(--primary-500)] mb-2">
                  <CountUpNumber end={allCandidates.length || 0} />
                </div>
                <p className="text-[var(--text-secondary-color)]">Candidates</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[var(--primary-500)] mb-2">
                  <CountUpNumber end={95} suffix="%" />
                </div>
                <p className="text-[var(--text-secondary-color)]">
                  Success Rate
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Featured Medical Jobs Section */}
        <section
          ref={sectionRefs.featuredJobs}
          className="py-16 px-4 bg-[var(--background-secondary-color)] fade-in-section"
        >
          <div className="container mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-color)]">
                Featured{" "}
                <span className="text-[var(--primary-500)]">Medical Jobs</span>
              </h2>
            </div>

            {loadingJobs ? (
              <div className="flex items-center justify-center min-h-32">
                <div className="loading"></div>
              </div>
            ) : latestJobs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[var(--text-secondary-color)]">
                  No featured jobs available at the moment.
                </p>
              </div>
            ) : (
              <Wrapper className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {latestJobs.slice(0, 5).map((job) => (
                  <JobInLanding key={job._id} {...job} to="/job-seekers/jobs" />
                ))}
              </Wrapper>
            )}
          </div>
        </section>

        {/* Latest Jobs Section - Moved to top after hero */}
        <section className="py-16 px-4 ">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
            Latest{" "}
            <span className="text-[var(--primary-500)]">Medical Jobs</span>
          </h2>
          <div className="container mx-auto ">
            {loadingJobs ? (
              <div className="flex items-center justify-center min-h-64">
                <div className="loading"></div>
              </div>
            ) : latestJobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[var(--text-primary-color)] text-lg">
                  No job opportunities available at the moment.
                </p>
              </div>
            ) : (
              <div className="space-y-8 ">
                {latestJobs.slice(0, 5).map((job) => (
                  <div
                    key={job._id}
                    className=" bg-gradient-to-tr from-[var(--cta-gradient-from)] to-[var(--cta-gradient-to)] rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex flex-wrap items-center gap-2 text-lg text-[var(--text-primary-50)] mb-1">
                          <FaBriefcase />
                          <span> {job.position}</span>
                        </div>
                      </div>
                      <div className="flex items-center mb-1 gap-2 text-[var(--text-primary-50)]">
                        <FaHospital />
                        <span className="text-base  ">{job.company}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-primary-700)] mb-2">
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

                      <div className="text-xs text-[var(--text-primary-300)]">
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
        <section className="py-16 px-4 bg-gradient-to-r from-[var(--cta-gradient-from)] to-[var(--cta-gradient-to)]">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
              <div className="order-2 md:order-1 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-color)] mb-6">
                  Our mission 🚀
                </h2>
                <p className="text-[var(--text-secondary-color)] text-lg leading-relaxed mb-4">
                  Enable healthcare professionals (doctors, nurses, pharmacists,
                  etc.) to find the job that matches their medical
                  specializations and preferred methodologies.
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
              <div className="order-1 md:order-2">
                <img
                  src={missionImg}
                  alt="MedCareer mission illustration"
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Company Section */}
        <section className="py-16 px-4 bg-[var(--background-secondary-color)]">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-color)] text-center mb-12">
                Featured Company
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-[var(--card-gradient-to)] rounded-lg shadow-md p-8">
                <div className="md:col-span-2">
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
                      • Find the right specialist doctor according to
                      specialties
                    </li>
                    <li>• Build reliable medical strategies</li>
                    <li>• Analyze medical documents</li>
                    <li>• Find relevant connections in the MEDICAL BIG DATA</li>
                  </ul>
                </div>
                <div className="md:col-span-1 text-center">
                  <img
                    src={featuredLogo}
                    alt="Featured company logo"
                    className="w-40 h-40 mx-auto object-contain"
                  />
                  <p className="mt-4 text-sm text-[var(--text-secondary-color)]">
                    Trusted partner for digital health innovation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Profession of the Day Section */}
        <section className="py-16 px-4 bg-gradient-to-tr from-[var(--cta-gradient-from)] to-[var(--cta-gradient-to)]">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-color)] text-center mb-12">
                Profession of the day
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-[var(--background-secondary-color)] rounded-lg p-8">
                <div className="md:col-span-2">
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
                    with requirements and meets quality criteria in terms of
                    both functionality and safety standards.
                  </p>
                  <Link
                    to="/job-seekers/jobs"
                    className="text-[var(--primary-500)] font-semibold hover:text-[var(--primary-700)] transition-colors duration-200"
                  >
                    [Read more...]
                  </Link>
                </div>
                <div className="md:col-span-1 text-center">
                  <img
                    src={professionImg}
                    alt="Nurse practitioner illustration"
                    className="w-40 h-40 rounded-lg object-cover mx-auto shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Registration Section */}
        <section className="py-16 px-4 bg-[var(--primary-700)]">
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

        {/* Latest Blog Posts */}
        <section
          ref={sectionRefs.blog}
          className="py-16 px-4 bg-gradient-to-tr from-[var(--cta-gradient-from)] to-[var(--cta-gradient-to)]"
        >
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-color)] text-center mb-12">
              Latest from our{" "}
              <span className="text-[var(--primary-500)]">Blog</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestBlogs.length > 0 ? (
                latestBlogs.map((blog) => (
                  <Link
                    key={blog._id}
                    to={`/blogs/${blog._id}`}
                    className="group"
                  >
                    <div className="bg-[var(--background-secondary-color)] rounded-lg overflow-hidden">
                      {blog.featuredImage ? (
                        <div className="h-48 overflow-hidden">
                          <img
                            src={blog.featuredImage}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="h-48 bg-[var(--primary-100)] flex items-center justify-center">
                          <FaStethoscope className="text-[var(--primary-500)] text-4xl" />
                        </div>
                      )}
                      <div className="p-6">
                        <span className="text-[var(--primary-500)] text-sm font-semibold">
                          {blog.category}
                        </span>
                        <h3 className="text-xl font-bold text-[var(--text-color)] mt-2 group-hover:text-[var(--primary-500)] transition-colors duration-200">
                          {blog.title}
                        </h3>
                        <p className="text-[var(--text-secondary-color)] mt-2">
                          {new Date(blog.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                // Fallback content when no blogs are available
                <>
                  <div className="bg-[var(--background-secondary-color)] rounded-lg overflow-hidden">
                    <div className="h-48 bg-[var(--primary-100)] flex items-center justify-center">
                      <FaStethoscope className="text-[var(--primary-500)] text-4xl" />
                    </div>
                    <div className="p-6">
                      <span className="text-[var(--primary-500)] text-sm font-semibold">
                        Coming Soon
                      </span>
                      <h3 className="text-xl font-bold text-[var(--text-color)] mt-2">
                        Medical Career Insights
                      </h3>
                      <p className="text-[var(--text-secondary-color)] mt-2">
                        Stay tuned for expert advice
                      </p>
                    </div>
                  </div>
                  <div className="bg-[var(--background-secondary-color)] rounded-lg overflow-hidden">
                    <div className="h-48 bg-[var(--primary-100)] flex items-center justify-center">
                      <FaBriefcase className="text-[var(--primary-500)] text-4xl" />
                    </div>
                    <div className="p-6">
                      <span className="text-[var(--primary-500)] text-sm font-semibold">
                        Coming Soon
                      </span>
                      <h3 className="text-xl font-bold text-[var(--text-color)] mt-2">
                        Industry News
                      </h3>
                      <p className="text-[var(--text-secondary-color)] mt-2">
                        Latest healthcare updates
                      </p>
                    </div>
                  </div>
                  <div className="bg-[var(--background-secondary-color)] rounded-lg overflow-hidden">
                    <div className="h-48 bg-[var(--primary-100)] flex items-center justify-center">
                      <FaHospital className="text-[var(--primary-500)] text-4xl" />
                    </div>
                    <div className="p-6">
                      <span className="text-[var(--primary-500)] text-sm font-semibold">
                        Coming Soon
                      </span>
                      <h3 className="text-xl font-bold text-[var(--text-color)] mt-2">
                        Professional Tips
                      </h3>
                      <p className="text-[var(--text-secondary-color)] mt-2">
                        Expert guidance for your career
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="text-center mt-8">
              <Link
                to="/blogs"
                className="inline-block border-0.5 bg-gradient-to-tr from-[var(--primary-500)] to-[var(--primary-700)] border-[var(--primary-500)] px-8 py-3 rounded-md font-bold text-lg hover:bg-[var(--primary-500)] hover:text-[var(--white)] transition-all duration-200"
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
