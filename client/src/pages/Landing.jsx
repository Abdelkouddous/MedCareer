import { Link } from "react-router-dom";
import missionImg from "../assets/images/main-alternative.svg";
import featuredLogo from "../assets/images/00-dis--logo.svg";
import professionImg from "../assets/images/avatar-2.jpg";
import heroBg from "../assets/images/image.png";

import { useEffect, useRef, useState } from "react";

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
    about: useRef(null),
    mission: useRef(null),
    featured: useRef(null),
    profession: useRef(null),
    quickReg: useRef(null),
    latestJobs: useRef(null),
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

  const fetchLatestJobs = async (query = "") => {
    try {
      setLoadingJobs(true);
      const params = new URLSearchParams();
      params.set("limit", "10");
      params.set("sort", "newest");
      if (query) {
        const extra = new URLSearchParams(query);
        extra.forEach((value, key) => params.set(key, value));
      }
      const response = await customFetch.get(`/jobs?${params.toString()}`);
      setLatestJobs(response.data.jobs || []);
    } catch (error) {
      console.error("Failed to fetch latest jobs:", error);
      toast.error("Failed to load latest jobs");
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchallEmployers = async () => {
    try {
      const response = await customFetch.get("/all-employers");
      setallEmployers(response.data.users || []);
    } catch (error) {
      console.error("Failed to fetch employers:", error);
    }
  };

  const fetchAllCandidates = async () => {
    try {
      const response = await customFetch.get("/all-seekers");
      setAllCandidates(response.data.jobSeekers || []);
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
    }
  };

  const fetchLatestBlogs = async () => {
    try {
      const response = await customFetch.get("/blogs?limit=3&sort=newest");
      setLatestBlogs(response.data.blogs || []);
    } catch (error) {
      console.error("Failed to fetch latest blogs:", error);
    }
  };

  useEffect(() => {
    fetchLatestJobs();
    fetchAllJobs();
    fetchallEmployers();
    fetchAllCandidates();
    fetchLatestBlogs();
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
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

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, []);

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLatestJobs(buildQueryParams());
  };

  const handleSearchChange = (field, value) => {
    setSearchData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (autoSearchTimerRef.current) clearTimeout(autoSearchTimerRef.current);
    autoSearchTimerRef.current = setTimeout(() => {
      fetchLatestJobs(buildQueryParams());
    }, 500);
    return () => {
      if (autoSearchTimerRef.current) clearTimeout(autoSearchTimerRef.current);
    };
  }, [searchData]);

  return (
    <>
      <div
        className="min-h-screen"
        style={{ background: "var(--background-color)" }}
      >
        {/* ========== HERO SECTION ========== */}
        <section
          ref={sectionRefs.hero}
          className="fade-in-section relative overflow-hidden"
          style={{ paddingTop: "6rem", paddingBottom: "5rem" }}
        >
          {/* Background */}
          <div className="absolute inset-0">
            <img
              src={heroBg}
              alt=""
              className="w-full h-full object-cover"
              style={{ opacity: 0.15 }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, var(--background-color) 0%, transparent 30%, transparent 70%, var(--background-color) 100%)",
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-[980px] mx-auto px-6 text-center">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8"
              style={{
                background: "var(--surface-secondary)",
                color: "var(--primary-500)",
                border: "1px solid var(--border-color)",
              }}
            >
              <FaFire className="text-xs" />
              <CountUpNumber end={allJobs.length || 0} /> open positions
            </div>

            <h1
              className="mb-6"
              style={{
                color: "var(--text-color)",
                lineHeight: 1.06,
                letterSpacing: "-0.045em",
              }}
            >
              The{" "}
              <span style={{ color: "var(--primary-500)" }}>largest</span>{" "}
              healthcare job portal in{" "}
              <span style={{ color: "var(--primary-500)" }}>Algeria.</span>
            </h1>

            <p
              className="text-lg md:text-xl max-w-2xl mx-auto mb-10"
              style={{
                color: "var(--text-secondary-color)",
                lineHeight: 1.5,
                fontWeight: 300,
              }}
            >
              Find your dream medical career. Connect with top healthcare
              employers across the country.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                to="/job-seekers/register"
                className="px-8 py-3 rounded-full text-base font-medium transition-all duration-300 hover:scale-105"
                style={{
                  background: "var(--primary-500)",
                  color: "#ffffff",
                }}
              >
                Get Started — It&apos;s Free
              </Link>
              <Link
                to="/register?role=employer"
                className="px-8 py-3 rounded-full text-base font-medium transition-all duration-300 hover:opacity-80 flex items-center gap-2"
                style={{
                  background: "transparent",
                  color: "var(--primary-500)",
                  border: "1px solid var(--primary-500)",
                }}
              >
                <FaBriefcase className="text-sm" />
                Post a Job
              </Link>
            </div>

            {/* Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-3xl mx-auto rounded-2xl p-4 md:p-5"
              style={{
                background: "var(--surface-primary)",
                boxShadow: "var(--shadow-3)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div className="relative">
                  <FaSearch
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                    style={{ color: "var(--grey-400)" }}
                  />
                  <input
                    type="text"
                    placeholder="Job title or keyword..."
                    value={searchData.keywords}
                    onChange={(e) =>
                      handleSearchChange("keywords", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none"
                    style={{
                      background: "var(--background-secondary-color)",
                      color: "var(--text-color)",
                      border: "1px solid var(--border-color)",
                    }}
                  />
                </div>

                <div className="relative">
                  <FaMapMarkerAlt
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                    style={{ color: "var(--grey-400)" }}
                  />
                  <input
                    type="text"
                    placeholder="City or region..."
                    value={searchData.location}
                    onChange={(e) =>
                      handleSearchChange("location", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none"
                    style={{
                      background: "var(--background-secondary-color)",
                      color: "var(--text-color)",
                      border: "1px solid var(--border-color)",
                    }}
                  />
                </div>

                <div className="relative">
                  <FaStethoscope
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                    style={{ color: "var(--grey-400)" }}
                  />
                  <select
                    value={searchData.specialization}
                    onChange={(e) =>
                      handleSearchChange("specialization", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none appearance-none cursor-pointer"
                    style={{
                      background: "var(--background-secondary-color)",
                      color: "var(--text-color)",
                      border: "1px solid var(--border-color)",
                    }}
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

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:opacity-90 flex items-center justify-center gap-2"
                style={{
                  background: "var(--primary-500)",
                  color: "#ffffff",
                }}
              >
                <FaSearch className="text-xs" />
                Search {latestJobs.length || 0} positions
              </button>
            </form>
          </div>
        </section>

        {/* ========== STATISTICS SECTION ========== */}
        <section
          ref={sectionRefs.statistics}
          className="fade-in-section stagger-children py-20 px-6"
          style={{ background: "var(--background-secondary-color)" }}
        >
          <div className="max-w-[980px] mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                {
                  value: allJobs.length || 0,
                  label: "Active Jobs",
                },
                {
                  value: allEmployers.length || 0,
                  label: "Companies",
                },
                {
                  value: allCandidates.length || 0,
                  label: "Candidates",
                },
                { value: 95, label: "Success Rate", suffix: "%" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div
                    className="text-4xl md:text-5xl font-bold mb-2"
                    style={{ color: "var(--text-color)", letterSpacing: "-0.04em" }}
                  >
                    <CountUpNumber
                      end={stat.value}
                      suffix={stat.suffix || ""}
                    />
                  </div>
                  <p
                    className="text-sm font-normal"
                    style={{ color: "var(--text-secondary-color)" }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== FEATURED MEDICAL JOBS ========== */}
        <section
          ref={sectionRefs.featuredJobs}
          className="fade-in-section py-20 px-6"
          style={{ background: "var(--background-color)" }}
        >
          <div className="max-w-[980px] mx-auto">
            <div className="text-center mb-12">
              <h2 style={{ color: "var(--text-color)" }}>
                Featured{" "}
                <span style={{ color: "var(--primary-500)" }}>
                  Medical Jobs
                </span>
              </h2>
              <p
                className="mt-4 text-base max-w-lg mx-auto"
                style={{ color: "var(--text-secondary-color)", fontWeight: 300 }}
              >
                Discover top opportunities from leading healthcare institutions.
              </p>
            </div>

            {loadingJobs ? (
              <div className="flex items-center justify-center min-h-32">
                <div className="loading"></div>
              </div>
            ) : latestJobs.length === 0 ? (
              <div className="text-center py-8">
                <p style={{ color: "var(--text-secondary-color)" }}>
                  No featured jobs available at the moment.
                </p>
              </div>
            ) : (
              <Wrapper className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {latestJobs.slice(0, 5).map((job) => (
                  <JobInLanding key={job._id} {...job} to="/job-seekers/jobs" />
                ))}
              </Wrapper>
            )}
          </div>
        </section>

        {/* ========== LATEST JOBS ========== */}
        <section
          ref={sectionRefs.latestJobs}
          className="fade-in-section py-20 px-6"
          style={{ background: "var(--background-secondary-color)" }}
        >
          <h2
            className="text-center mb-12"
            style={{ color: "var(--text-color)" }}
          >
            Latest{" "}
            <span style={{ color: "var(--primary-500)" }}>Opportunities</span>
          </h2>
          <div className="max-w-[980px] mx-auto">
            {loadingJobs ? (
              <div className="flex items-center justify-center min-h-64">
                <div className="loading"></div>
              </div>
            ) : latestJobs.length === 0 ? (
              <div className="text-center py-12">
                <p style={{ color: "var(--text-secondary-color)" }}>
                  No job opportunities available at the moment.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {latestJobs.slice(0, 5).map((job) => (
                  <div
                    key={job._id}
                    className="rounded-2xl p-6 transition-all duration-300 hover-lift flex flex-col md:flex-row md:items-center md:justify-between"
                    style={{
                      background: "var(--surface-primary)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <FaBriefcase
                          className="text-sm"
                          style={{ color: "var(--primary-500)" }}
                        />
                        <span
                          className="text-base font-semibold"
                          style={{ color: "var(--text-color)" }}
                        >
                          {job.position}
                        </span>
                      </div>
                      <div
                        className="flex items-center gap-2 mb-3"
                        style={{ color: "var(--text-secondary-color)" }}
                      >
                        <FaHospital className="text-xs" />
                        <span className="text-sm">{job.company}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs">
                        <div
                          className="flex items-center gap-1"
                          style={{ color: "var(--text-secondary-color)" }}
                        >
                          <FaMapMarkerAlt />
                          <span>{job.jobLocation}</span>
                        </div>
                        <div
                          className="flex items-center gap-1"
                          style={{ color: "var(--text-secondary-color)" }}
                        >
                          <FaStethoscope />
                          <span>{job.specialization}</span>
                        </div>
                        <span
                          className="px-3 py-0.5 rounded-full text-xs font-medium capitalize"
                          style={{
                            background: "var(--surface-secondary)",
                            color: "var(--primary-500)",
                          }}
                        >
                          {job.jobType}
                        </span>
                      </div>
                      <p
                        className="text-xs mt-3"
                        style={{ color: "var(--grey-400)" }}
                      >
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-6">
                      <Link
                        to="/job-seekers/jobs"
                        className="inline-block px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
                        style={{
                          background: "var(--primary-500)",
                          color: "#ffffff",
                        }}
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

        {/* ========== ABOUT US ========== */}
        <section
          ref={sectionRefs.about}
          className="fade-in-section py-24 px-6"
          style={{ background: "var(--background-color)" }}
        >
          <div className="max-w-[680px] mx-auto text-center">
            <h2 className="mb-6" style={{ color: "var(--text-color)" }}>
              Who we are.
            </h2>
            <p
              className="text-lg leading-relaxed mb-6"
              style={{
                color: "var(--text-secondary-color)",
                lineHeight: 1.6,
                fontWeight: 300,
              }}
            >
              Tired of recruiters who think Java is a detergent brand? That HTML
              is a programming language? Trust your healthcare career to the
              &apos;MedCareer&apos; community that speaks the same language(s)
              as you.
            </p>
            <Link
              to="/contact"
              className="text-base font-medium transition-opacity duration-200 hover:opacity-70"
              style={{ color: "var(--primary-500)" }}
            >
              Learn more →
            </Link>
          </div>
        </section>

        {/* ========== MISSION SECTION ========== */}
        <section
          ref={sectionRefs.mission}
          className="fade-in-section py-24 px-6"
          style={{ background: "var(--background-secondary-color)" }}
        >
          <div className="max-w-[980px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1">
                <h2
                  className="mb-6"
                  style={{ color: "var(--text-color)" }}
                >
                  Our mission.
                </h2>
                <p
                  className="text-base leading-relaxed mb-4"
                  style={{
                    color: "var(--text-secondary-color)",
                    lineHeight: 1.6,
                    fontWeight: 300,
                  }}
                >
                  Enable healthcare professionals — doctors, nurses,
                  pharmacists, and more — to find the job that matches their
                  medical specializations and preferred methodologies.
                </p>
                <p
                  className="text-base leading-relaxed mb-6"
                  style={{
                    color: "var(--text-secondary-color)",
                    lineHeight: 1.6,
                    fontWeight: 300,
                  }}
                >
                  We help startups, healthcare service companies and any
                  organization requiring medical professionals to strengthen
                  their teams with the best-suited profiles.
                </p>
                <Link
                  to="/employers"
                  className="text-base font-medium transition-opacity duration-200 hover:opacity-70"
                  style={{ color: "var(--primary-500)" }}
                >
                  Learn more →
                </Link>
              </div>
              <div className="order-1 md:order-2 flex justify-center">
                <img
                  src={missionImg}
                  alt="MedCareer mission illustration"
                  className="w-full max-w-[380px] object-contain"
                  style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.08))" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ========== FEATURED COMPANY ========== */}
        <section
          ref={sectionRefs.featured}
          className="fade-in-section py-24 px-6"
          style={{ background: "var(--background-color)" }}
        >
          <div className="max-w-[980px] mx-auto">
            <h2
              className="text-center mb-14"
              style={{ color: "var(--text-color)" }}
            >
              Featured Company
            </h2>
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center rounded-2xl p-8 md:p-12"
              style={{
                background: "var(--surface-primary)",
                border: "1px solid var(--border-color)",
                boxShadow: "var(--shadow-2)",
              }}
            >
              <div className="md:col-span-2">
                <h3
                  className="text-2xl font-semibold mb-4"
                  style={{ color: "var(--text-color)" }}
                >
                  MedTech Solutions
                </h3>
                <p
                  className="leading-relaxed mb-4"
                  style={{
                    color: "var(--text-secondary-color)",
                    fontWeight: 300,
                  }}
                >
                  MedTech Solutions is a healthcare technology platform
                  connecting patients with medical professionals:
                </p>
                <ul
                  className="space-y-2 text-sm"
                  style={{ color: "var(--text-secondary-color)" }}
                >
                  <li className="flex items-start gap-2">
                    <span style={{ color: "var(--primary-500)" }}>•</span>
                    Find specialists by specialty
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: "var(--primary-500)" }}>•</span>
                    Build reliable medical strategies
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: "var(--primary-500)" }}>•</span>
                    Analyze medical documents
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: "var(--primary-500)" }}>•</span>
                    Relevant connections in medical big data
                  </li>
                </ul>
              </div>
              <div className="md:col-span-1 text-center">
                <img
                  src={featuredLogo}
                  alt="Featured company logo"
                  className="w-32 h-32 mx-auto object-contain mb-3"
                  style={{ opacity: 0.9 }}
                />
                <p
                  className="text-xs"
                  style={{ color: "var(--text-secondary-color)" }}
                >
                  Trusted partner for digital health innovation
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========== PROFESSION OF THE DAY ========== */}
        <section
          ref={sectionRefs.profession}
          className="fade-in-section py-24 px-6"
          style={{ background: "var(--background-secondary-color)" }}
        >
          <div className="max-w-[980px] mx-auto">
            <h2
              className="text-center mb-14"
              style={{ color: "var(--text-color)" }}
            >
              Profession of the day
            </h2>
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center rounded-2xl p-8 md:p-12"
              style={{
                background: "var(--surface-primary)",
                border: "1px solid var(--border-color)",
                boxShadow: "var(--shadow-2)",
              }}
            >
              <div className="md:col-span-2">
                <h3
                  className="text-xl font-semibold mb-4"
                  style={{ color: "var(--text-color)" }}
                >
                  Nurse Practitioner
                </h3>
                <p
                  className="text-sm leading-relaxed mb-3"
                  style={{
                    color: "var(--text-secondary-color)",
                    fontWeight: 300,
                    lineHeight: 1.7,
                  }}
                >
                  A specialized profession in advanced nursing practice.
                  The Nurse Practitioner ensures that care is compliant with
                  requirements and meets quality criteria in terms of both
                  functionality and safety standards.
                </p>
                <Link
                  to="/job-seekers/jobs"
                  className="text-sm font-medium transition-opacity duration-200 hover:opacity-70"
                  style={{ color: "var(--primary-500)" }}
                >
                  Read more →
                </Link>
              </div>
              <div className="md:col-span-1 text-center">
                <img
                  src={professionImg}
                  alt="Nurse practitioner"
                  className="w-36 h-36 rounded-2xl object-cover mx-auto"
                  style={{ boxShadow: "var(--shadow-2)" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ========== QUICK REGISTRATION ========== */}
        <section
          ref={sectionRefs.quickReg}
          className="fade-in-section py-24 px-6"
          style={{ background: "var(--primary-500)" }}
        >
          <div className="max-w-[680px] mx-auto text-center">
            <h2
              className="text-white mb-4"
              style={{ letterSpacing: "-0.03em" }}
            >
              No time? We&apos;ll handle it.
            </h2>
            <p
              className="text-white/80 text-base mb-10"
              style={{ fontWeight: 300, lineHeight: 1.6 }}
            >
              Upload your CV and let our team fill out your profile and
              subscribe you to alerts for the medical specialties you master.
            </p>
            <div
              className="rounded-2xl p-8 max-w-sm mx-auto"
              style={{ background: "var(--surface-primary)" }}
            >
              <div
                className="border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-300"
                style={{ borderColor: "var(--border-color)" }}
              >
                <div className="mb-4">
                  <svg
                    className="w-10 h-10 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: "var(--grey-400)" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
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
                  <p
                    className="text-sm mb-1"
                    style={{ color: "var(--text-color)" }}
                  >
                    Drop your CV here
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--grey-400)" }}
                  >
                    .pdf, .doc, .docx
                  </p>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* ========== HOW IT WORKS ========== */}
        <section
          ref={sectionRefs.howItWorks}
          className="fade-in-section stagger-children py-24 px-6"
          style={{ background: "var(--background-color)" }}
        >
          <div className="max-w-[980px] mx-auto">
            <h2
              className="text-center mb-16"
              style={{ color: "var(--text-color)" }}
            >
              How it{" "}
              <span style={{ color: "var(--primary-500)" }}>works.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  step: "01",
                  title: "Create Your Profile",
                  desc: "Sign up and build your professional medical profile with qualifications and experience.",
                },
                {
                  step: "02",
                  title: "Browse Opportunities",
                  desc: "Search through verified medical job listings from top healthcare institutions.",
                },
                {
                  step: "03",
                  title: "Apply & Connect",
                  desc: "Apply to positions that match your skills and connect directly with employers.",
                },
              ].map(({ step, title, desc }) => (
                <div key={step} className="text-center">
                  <div
                    className="text-5xl font-bold mb-4"
                    style={{
                      color: "var(--primary-500)",
                      opacity: 0.3,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {step}
                  </div>
                  <h3
                    className="text-lg font-semibold mb-3"
                    style={{ color: "var(--text-color)" }}
                  >
                    {title}
                  </h3>
                  <p
                    className="text-sm"
                    style={{
                      color: "var(--text-secondary-color)",
                      lineHeight: 1.6,
                      fontWeight: 300,
                    }}
                  >
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== TESTIMONIALS ========== */}
        <section
          ref={sectionRefs.testimonials}
          className="fade-in-section stagger-children py-24 px-6"
          style={{ background: "var(--background-secondary-color)" }}
        >
          <div className="max-w-[980px] mx-auto">
            <h2
              className="text-center mb-16"
              style={{ color: "var(--text-color)" }}
            >
              What professionals{" "}
              <span style={{ color: "var(--primary-500)" }}>say.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "Dr. Sarah Johnson",
                  role: "Cardiologist",
                  quote:
                    "Found my dream position at a leading hospital through MedCareer Connect. The process was smooth and professional.",
                },
                {
                  name: "James Wilson",
                  role: "Registered Nurse",
                  quote:
                    "The platform made it easy to find and apply to relevant nursing positions. I'm now working at an amazing facility.",
                },
                {
                  name: "Dr. Emily Chen",
                  role: "Pediatrician",
                  quote:
                    "Excellent platform for medical professionals. Found great opportunities and the support team was very helpful.",
                },
              ].map(({ name, role, quote }) => (
                <div
                  key={name}
                  className="rounded-2xl p-6"
                  style={{
                    background: "var(--surface-primary)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div className="flex items-center mb-4 gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                      style={{
                        background: "var(--primary-500)",
                        color: "#ffffff",
                      }}
                    >
                      {name.charAt(0)}
                      {name.split(" ").pop().charAt(0)}
                    </div>
                    <div>
                      <h4
                        className="text-sm font-semibold"
                        style={{ color: "var(--text-color)" }}
                      >
                        {name}
                      </h4>
                      <p
                        className="text-xs"
                        style={{ color: "var(--primary-500)" }}
                      >
                        {role}
                      </p>
                    </div>
                  </div>
                  <p
                    className="text-sm italic"
                    style={{
                      color: "var(--text-secondary-color)",
                      lineHeight: 1.7,
                      fontWeight: 300,
                    }}
                  >
                    &ldquo;{quote}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== LATEST BLOG POSTS ========== */}
        <section
          ref={sectionRefs.blog}
          className="fade-in-section py-24 px-6"
          style={{ background: "var(--background-color)" }}
        >
          <div className="max-w-[980px] mx-auto">
            <h2
              className="text-center mb-16"
              style={{ color: "var(--text-color)" }}
            >
              From the{" "}
              <span style={{ color: "var(--primary-500)" }}>blog.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestBlogs.length > 0
                ? latestBlogs.map((blog) => (
                    <Link
                      key={blog._id}
                      to={`/blogs/${blog._id}`}
                      className="group"
                    >
                      <div
                        className="rounded-2xl overflow-hidden transition-all duration-300 hover-lift"
                        style={{
                          background: "var(--surface-primary)",
                          border: "1px solid var(--border-color)",
                        }}
                      >
                        {blog.featuredImage ? (
                          <div className="h-44 overflow-hidden">
                            <img
                              src={blog.featuredImage}
                              alt={blog.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        ) : (
                          <div
                            className="h-44 flex items-center justify-center"
                            style={{
                              background: "var(--surface-secondary)",
                            }}
                          >
                            <FaStethoscope
                              className="text-3xl"
                              style={{ color: "var(--primary-500)", opacity: 0.5 }}
                            />
                          </div>
                        )}
                        <div className="p-5">
                          <span
                            className="text-xs font-medium"
                            style={{ color: "var(--primary-500)" }}
                          >
                            {blog.category}
                          </span>
                          <h3
                            className="text-base font-semibold mt-2 group-hover:opacity-70 transition-opacity duration-200"
                            style={{ color: "var(--text-color)" }}
                          >
                            {blog.title}
                          </h3>
                          <p
                            className="text-xs mt-2"
                            style={{ color: "var(--text-secondary-color)" }}
                          >
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
                : /* Fallback cards */
                  [
                    {
                      icon: FaStethoscope,
                      cat: "Coming Soon",
                      title: "Medical Career Insights",
                      sub: "Stay tuned for expert advice",
                    },
                    {
                      icon: FaBriefcase,
                      cat: "Coming Soon",
                      title: "Industry News",
                      sub: "Latest healthcare updates",
                    },
                    {
                      icon: FaHospital,
                      cat: "Coming Soon",
                      title: "Professional Tips",
                      sub: "Expert guidance for your career",
                    },
                  ].map(({ icon: Icon, cat, title, sub }) => (
                    <div
                      key={title}
                      className="rounded-2xl overflow-hidden"
                      style={{
                        background: "var(--surface-primary)",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      <div
                        className="h-44 flex items-center justify-center"
                        style={{ background: "var(--surface-secondary)" }}
                      >
                        <Icon
                          className="text-3xl"
                          style={{ color: "var(--primary-500)", opacity: 0.5 }}
                        />
                      </div>
                      <div className="p-5">
                        <span
                          className="text-xs font-medium"
                          style={{ color: "var(--primary-500)" }}
                        >
                          {cat}
                        </span>
                        <h3
                          className="text-base font-semibold mt-2"
                          style={{ color: "var(--text-color)" }}
                        >
                          {title}
                        </h3>
                        <p
                          className="text-xs mt-2"
                          style={{ color: "var(--text-secondary-color)" }}
                        >
                          {sub}
                        </p>
                      </div>
                    </div>
                  ))}
            </div>
            <div className="text-center mt-10">
              <Link
                to="/blogs"
                className="inline-block px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
                style={{
                  background: "var(--primary-500)",
                  color: "#ffffff",
                }}
              >
                View All Posts
              </Link>
            </div>
          </div>
        </section>

        {/* ========== NEWSLETTER ========== */}
        <section
          ref={sectionRefs.newsletter}
          className="fade-in-section py-24 px-6"
          style={{ background: "var(--background-secondary-color)" }}
        >
          <div className="max-w-[680px] mx-auto text-center">
            <div
              className="rounded-3xl p-10 md:p-14"
              style={{
                background: "var(--primary-500)",
              }}
            >
              <h2 className="text-white mb-4" style={{ letterSpacing: "-0.03em" }}>
                Stay updated.
              </h2>
              <p
                className="text-white/80 text-base mb-8"
                style={{ fontWeight: 300, lineHeight: 1.6 }}
              >
                Subscribe for the latest medical jobs, career advice, and
                healthcare industry insights.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-5 py-3 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    color: "#ffffff",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:opacity-90"
                  style={{
                    background: "#ffffff",
                    color: "var(--primary-500)",
                  }}
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
