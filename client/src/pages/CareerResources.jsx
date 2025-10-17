import { Link } from "react-router-dom";

const CareerResources = () => {
  return (
    <div className="min-h-screen bg-[var(--background-color)]">
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-[var(--text-color)] mb-4">
            Career Resources
          </h1>
          <p className="text-[var(--text-secondary-color)] mb-6">
            Practical guides and curated tips to help healthcare professionals
            find, land, and grow in the right roles.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[var(--background-secondary-color)] border border-[var(--grey-200)] rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[var(--text-color)] mb-2">
                Resume Tips
              </h3>
              <p className="text-[var(--text-secondary-color)] mb-4">
                Structure your resume for clinical roles and highlight impact.
              </p>
              <Link to="/resume-tips" className="btn">
                View Tips
              </Link>
            </div>

            <div className="bg-[var(--background-secondary-color)] border border-[var(--grey-200)] rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[var(--text-color)] mb-2">
                Salary Guide
              </h3>
              <p className="text-[var(--text-secondary-color)] mb-4">
                Explore compensation ranges across specialties and experience.
              </p>
              <Link to="/salary-guide" className="btn-hipster">
                Explore Salaries
              </Link>
            </div>

            <div className="bg-[var(--background-secondary-color)] border border-[var(--grey-200)] rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[var(--text-color)] mb-2">
                Interview Preparation
              </h3>
              <p className="text-[var(--text-secondary-color)] mb-4">
                Common questions, scenario-based prompts, and behavioral tips.
              </p>
              <Link to="/jobs" className="btn">
                Browse Jobs
              </Link>
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            <Link to="/register" className="btn">Create Account</Link>
            <Link to="/login" className="btn-hipster">Employer Login</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareerResources;