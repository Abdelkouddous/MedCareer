import { Link } from "react-router-dom";
import main from "../assets/images/main.svg";

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();

    const search = (formData.get("search") || "").trim();
    const jobType = formData.get("jobType");
    const jobStatus = formData.get("jobStatus");
    const specialization = formData.get("specialization");
    const sort = formData.get("sort");

    if (search) params.set("search", search);
    if (jobType && jobType !== "all") params.set("jobType", jobType);
    if (jobStatus && jobStatus !== "all") params.set("jobStatus", jobStatus);
    if (specialization && specialization !== "all")
      params.set("specialization", specialization);
    if (sort) params.set("sort", sort);

    navigate(`/dashboard/all-jobs?${params.toString()}`);
  };

  return (
    <>
      <div className="min-h-screen bg-[var(--background-color)]">
        {/* Hero Section */}
        <section ref={sectionRefs.hero} className="pt-24 pb-16 px-4">
          <div className="container mx-auto flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
              <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  to="/job-seekers"
                  className="w-full text-center bg-[var(--primary-500)] text-[var(--white)] px-6 py-3 rounded-md font-semibold hover:bg-[var(--primary-700)] transition-all duration-200"
                >
                  Job Seeker
                </Link>
                <Link
                  to="/register?role=employer"
                  className="w-full text-center border-2 border-[var(--primary-500)] text-[var(--primary-500)] px-6 py-3 rounded-md font-semibold hover:bg-[var(--primary-500)] hover:text-[var(--white)] transition-all duration-200"
                >
                  Employer
                </Link>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-color)] mb-6">
                Find Your Perfect{" "}
                <span className="text-[var(--primary-500)]">
                  Medical Career
                </span>
              </h1>
              <p className="text-[var(--text-secondary-color)] text-lg md:text-xl mb-8">
                Connecting healthcare professionals with top medical
                institutions. Discover thousands of opportunities in hospitals,
                clinics, and private practices.
              </p>

              {/* Quick Job Search */}
              {/* <form
                onSubmit={handleHeroSearchSubmit}
                className="bg-[var(--background-secondary-color)] p-4 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
              >
                <input
                  type="text"
                  name="search"
                  placeholder="Job title or company"
                  className="form-input"
                />
                <div className="flex items-center justify-center">
                  <button
                    type="submit"
                    className="btn sm:col-span-2 lg:col-span-4 flex items-center"
                  >
                    <span>
                      {" "}
                      <FaSearch className="mr-2" />
                      Search Jobs
                    </span>
                  </button>
                </div>
              </form> */}

              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                <Link
                  to="/login"
                  className="bg-[var(--primary-500)] text-[var(--white)] px-8 py-3 rounded-md font-bold text-lg hover:bg-[var(--primary-700)] transition-all duration-200"
                >
                  Explore the App
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src={main}
                alt="Healthcare professionals"
                className="w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          ref={sectionRefs.features}
          className="py-16 px-4 bg-[var(--background-secondary-color)]"
        >
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-color)] text-center mb-12">
              Why Choose{" "}
              <span className="text-[var(--primary-500)]">
                MedCareer Connect
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-lg bg-[var(--background-color)] hover:transform hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="text-[var(--primary-500)] mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-color)] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--text-secondary-color)]">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Job Categories */}
        <section ref={sectionRefs.jobCategories} className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-color)] text-center mb-12">
              Popular{" "}
              <span className="text-[var(--primary-500)]">Categories</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {jobCategories.map((category, index) => (
                <Link
                  key={index}
                  to={`/jobs/category/${category.slug}`}
                  className="p-6 rounded-lg bg-[var(--background-secondary-color)] hover:bg-[var(--primary-500)] group transition-all duration-300"
                >
                  <div className="text-[var(--primary-500)] group-hover:text-white mb-3">
                    {category.icon}
                  </div>
                  <h3 className="text-[var(--text-color)] group-hover:text-white font-bold mb-2">
                    {category.title}
                  </h3>
                  <p className="text-[var(--text-secondary-color)] group-hover:text-white/90">
                    {category.count} jobs
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          ref={sectionRefs.cta}
          className="py-16 px-4 bg-[var(--background-secondary-color)]"
        >
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-color)] mb-6">
              Ready to Advance Your Medical Career?
            </h2>
            <p className="text-[var(--text-secondary-color)] text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of healthcare professionals who have found their
              dream jobs. Create your profile today and get matched with top
              medical employers.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="bg-[var(--primary-500)] text-[var(--white)] px-8 py-3 rounded-md font-bold text-lg hover:bg-[var(--primary-700)] transition-all duration-200"
              >
                Create Account
              </Link>
              <Link
                to="/contact"
                className="border-2 border-[var(--primary-500)] text-[var(--primary-500)] px-8 py-3 rounded-md font-bold text-lg hover:bg-[var(--primary-500)] hover:text-[var(--white)] transition-all duration-200"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section ref={sectionRefs.pricing} className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-color)] text-center mb-4">
              Choose Your{" "}
              <span className="text-[var(--primary-500)]">Membership</span>
            </h2>
            <p className="text-[var(--text-secondary-color)] text-center mb-12 max-w-2xl mx-auto">
              Select the perfect plan for your recruitment needs. All plans
              include access to our verified healthcare professional database.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Silver Plan */}
              <div className="p-6 rounded-lg bg-[var(--background-secondary-color)] hover:transform hover:-translate-y-2 transition-all duration-300">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-[var(--text-color)] mb-4">
                    Silver
                  </h3>
                  <div className="text-4xl font-bold text-[var(--primary-500)] mb-4">
                    $199
                    <span className="text-lg text-[var(--text-secondary-color)]">
                      /month
                    </span>
                  </div>
                  <p className="text-[var(--text-secondary-color)]">
                    Perfect for small practices
                  </p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-[var(--primary-500)] mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                    Post up to 10 jobs monthly
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-[var(--primary-500)] mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                    Basic candidate search
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-[var(--primary-500)] mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                    Email support
                  </li>
                </ul>
                <Link
                  to="/register?plan=silver"
                  className="block text-center bg-[var(--primary-500)] text-[var(--white)] px-6 py-3 rounded-md font-semibold hover:bg-[var(--primary-700)] transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>

              {/* Gold Plan */}
              <div className="p-6 rounded-lg bg-[var(--primary-500)] text-white transform scale-105">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--primary-700)] text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4">Gold</h3>
                  <div className="text-4xl font-bold mb-4">
                    $399<span className="text-lg opacity-75">/month</span>
                  </div>
                  <p className="opacity-75">For growing medical facilities</p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                    Unlimited job posts
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                    Advanced candidate search
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                    Priority support
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                    Featured job listings
                  </li>
                </ul>
                <Link
                  to="/register?plan=gold"
                  className="block text-center bg-white text-[var(--primary-500)] px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>

              {/* Platinum Plan */}
              <div className="p-6 rounded-lg bg-[var(--background-secondary-color)] hover:transform hover:-translate-y-2 transition-all duration-300">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-[var(--text-color)] mb-4">
                    Platinum
                  </h3>
                  <div className="text-4xl font-bold text-[var(--primary-500)] mb-4">
                    $799
                    <span className="text-lg text-[var(--text-secondary-color)]">
                      /month
                    </span>
                  </div>
                  <p className="text-[var(--text-secondary-color)]">
                    Enterprise solution
                  </p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-[var(--primary-500)] mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                    Everything in Gold
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-[var(--primary-500)] mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                    Dedicated account manager
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-[var(--primary-500)] mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                    Custom branding
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-[var(--primary-500)] mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                    API access
                  </li>
                </ul>
                <Link
                  to="/register?plan=platinum"
                  className="block text-center bg-[var(--primary-500)] text-[var(--white)] px-6 py-3 rounded-md font-semibold hover:bg-[var(--primary-700)] transition-all duration-200"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Jobs Section */}
        <section ref={sectionRefs.featuredJobs} className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-color)] text-center mb-12">
              Featured{" "}
              <span className="text-[var(--primary-500)]">Medical Jobs</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sample featured jobs */}
              <div className="bg-[var(--background-secondary-color)] rounded-lg p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-color)] mb-2">
                      Senior Nurse Practitioner
                    </h3>
                    <p className="text-[var(--primary-500)] font-semibold">
                      Mayo Clinic
                    </p>
                  </div>
                  <span className="bg-[var(--primary-100)] text-[var(--primary-500)] px-3 py-1 rounded-full text-sm font-semibold">
                    Full-time
                  </span>
                </div>
                <div className="mb-4">
                  <p className="text-[var(--text-secondary-color)] mb-2">
                    📍 New York, NY
                  </p>
                  <p className="text-[var(--text-secondary-color)] mb-2">
                    💰 $80,000 - $120,000
                  </p>
                </div>
                <Link
                  to="/jobs/1"
                  className="text-[var(--primary-500)] font-semibold hover:text-[var(--primary-700)] transition-colors duration-200"
                >
                  View Details ➞
                </Link>
              </div>
              <div className="bg-[var(--background-secondary-color)] rounded-lg p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-color)] mb-2">
                      Cardiologist
                    </h3>
                    <p className="text-[var(--primary-500)] font-semibold">
                      Cleveland Clinic
                    </p>
                  </div>
                  <span className="bg-[var(--primary-100)] text-[var(--primary-500)] px-3 py-1 rounded-full text-sm font-semibold">
                    Full-time
                  </span>
                </div>
                <div className="mb-4">
                  <p className="text-[var(--text-secondary-color)] mb-2">
                    📍 Cleveland, OH
                  </p>
                  <p className="text-[var(--text-secondary-color)] mb-2">
                    💰 $250,000 - $350,000
                  </p>
                </div>
                <Link
                  to="/jobs/2"
                  className="text-[var(--primary-500)] font-semibold hover:text-[var(--primary-700)] transition-colors duration-200"
                >
                  View Details ➞
                </Link>
              </div>
              <div className="bg-[var(--background-secondary-color)] rounded-lg p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-color)] mb-2">
                      Pharmacist
                    </h3>
                    <p className="text-[var(--primary-500)] font-semibold">
                      CVS Health
                    </p>
                  </div>
                  <span className="bg-[var(--primary-100)] text-[var(--primary-500)] px-3 py-1 rounded-full text-sm font-semibold">
                    Part-time
                  </span>
                </div>
                <div className="mb-4">
                  <p className="text-[var(--text-secondary-color)] mb-2">
                    📍 Boston, MA
                  </p>
                  <p className="text-[var(--text-secondary-color)] mb-2">
                    💰 $60,000 - $80,000
                  </p>
                </div>
                <Link
                  to="/jobs/3"
                  className="text-[var(--primary-500)] font-semibold hover:text-[var(--primary-700)] transition-colors duration-200"
                >
                  View Details ➞
                </Link>
              </div>
            </div>
            <div className="text-center mt-8">
              <Link
                to="/jobs"
                className="inline-block border-2 border-[var(--primary-500)] text-[var(--primary-500)] px-8 py-3 rounded-md font-bold text-lg hover:bg-[var(--primary-500)] hover:text-[var(--white)] transition-all duration-200"
              >
                View All Jobs
              </Link>
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
                  "Found my dream position at a leading hospital through
                  MedCareer Connect. The process was smooth and professional."
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
                  "The platform made it easy to find and apply to relevant
                  nursing positions. I'm now working at an amazing facility."
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
                  "Excellent platform for medical professionals. Found great
                  opportunities and the support team was very helpful."
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

const features = [
  {
    icon: (
      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
      </svg>
    ),
    title: "Verified Employers",
    description:
      "All healthcare employers are thoroughly vetted to ensure legitimate opportunities.",
  },
  {
    icon: (
      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
      </svg>
    ),
    title: "Expert Matching",
    description:
      "Our advanced matching system connects you with the most relevant medical positions.",
  },
  {
    icon: (
      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
        <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
      </svg>
    ),
    title: "Fast Placement",
    description:
      "Streamlined application process to help you secure your next medical position quickly.",
  },
];

const jobCategories = [
  {
    title: "Nursing",
    slug: "nursing",
    count: 1245,
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
      </svg>
    ),
  },
  {
    title: "Physicians",
    slug: "physicians",
    count: 853,
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Dentistry",
    slug: "dentistry",
    count: 426,
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
      </svg>
    ),
  },
  {
    title: "Pharmacy",
    slug: "pharmacy",
    count: 317,
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
      </svg>
    ),
  },
];

export default Landing;
