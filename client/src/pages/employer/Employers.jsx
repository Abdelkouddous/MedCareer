
import { Link } from "react-router-dom";

const Employers = () => {
  return (
    <div className="min-h-screen bg-[var(--background-color)]">
      {/* Hero */}
      <section id="post-job" className="bg-[var(--background-secondary-color)] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-color)] mb-4">
            Hire Qualified Medical Professionals Faster
          </h1>
          <p className="text-[var(--text-secondary-color)] max-w-3xl mx-auto">
            MedCareer Connect helps hospitals, clinics, and healthcare providers
            attract and hire verified medical talent with streamlined job
            posting, smart matching, and applicant tracking.
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Link
              to="/register"
              className="bg-[var(--primary-500)] text-white px-6 py-3 rounded-md font-semibold hover:bg-[var(--primary-700)] transition-all"
            >
              Register as Employer
            </Link>
            <Link
              to="/login"
              className="border border-[var(--primary-500)] text-[var(--primary-700)] px-6 py-3 rounded-md font-semibold hover:bg-[var(--primary-100)] transition-all"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Product Highlights */}
      <section id="recruitment-solutions" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-[var(--text-color)] mb-8 text-center">
            Why MedCareer Connect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div id="talent-search" className="p-6 rounded-lg border bg-white/60">
              <h3 className="font-semibold text-[var(--text-color)] mb-2">
                Targeted Reach
              </h3>
              <p className="text-[var(--text-secondary-color)]">
                Reach verified medical professionals across specialties with smart
                search and filters.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-white/60">
              <h3 className="font-semibold text-[var(--text-color)] mb-2">
                Streamlined Posting
              </h3>
              <p className="text-[var(--text-secondary-color)]">
                Post jobs in minutes and manage applications in a simple dashboard.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-white/60">
              <h3 className="font-semibold text-[var(--text-color)] mb-2">
                Insights & Controls
              </h3>
              <p className="text-[var(--text-secondary-color)]">
                Track stats, manage quotas, and collaborate with your hiring team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing (Landing-style cards) */}
      <section id="pricing" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-color)]">
              Pricing Plans
            </h2>
            <p className="text-[var(--text-secondary-color)] mt-3">
              Choose a plan that fits your hiring needs. Upgrade anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter Plan */}
            <div className="relative bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-[var(--background-secondary-color)] text-[var(--text-color)] rounded-full">
                  Starter
                </span>
              </div>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-3xl font-bold text-[var(--text-color)]">$0</span>
                <span className="text-[var(--text-secondary-color)]">/month</span>
              </div>
              <p className="text-[var(--text-secondary-color)] mb-6">
                Best for new employers. Post up to 1 job while pending approval.
              </p>
              <ul className="text-[var(--text-secondary-color)] space-y-2 mb-6">
                <li>• Basic job posting</li>
                <li>• Standard listing visibility</li>
                <li>• Dashboard access</li>
              </ul>
              <Link
                to="/register?role=employer"
                className="w-full inline-block text-center bg-[var(--primary-500)] text-white px-6 py-3 rounded-md font-semibold hover:bg-[var(--primary-700)] transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Professional Plan */}
            <div className="relative bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow ring-2 ring-[var(--primary-200)]">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-[var(--primary-100)] text-[var(--primary-700)] rounded-full">
                  Professional
                </span>
                <span className="text-xs font-semibold text-[var(--primary-700)] bg-[var(--primary-100)] px-2 py-1 rounded">
                  Most Popular
                </span>
              </div>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-3xl font-bold text-[var(--text-color)]">$49</span>
                <span className="text-[var(--text-secondary-color)]">/month</span>
              </div>
              <p className="text-[var(--text-secondary-color)] mb-6">
                Increased quota and priority placements for growing teams.
              </p>
              <ul className="text-[var(--text-secondary-color)] space-y-2 mb-6">
                <li>• Higher job quota</li>
                <li>• Priority listing</li>
                <li>• Basic analytics</li>
              </ul>
              <Link
                to="/register?role=employer"
                className="w-full inline-block text-center bg-[var(--primary-500)] text-white px-6 py-3 rounded-md font-semibold hover:bg-[var(--primary-700)] transition-colors"
              >
                Choose Professional
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="relative bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-[var(--background-secondary-color)] text-[var(--text-color)] rounded-full">
                  Enterprise
                </span>
              </div>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-3xl font-bold text-[var(--text-color)]">Custom</span>
                <span className="text-[var(--text-secondary-color)]">pricing</span>
              </div>
              <p className="text-[var(--text-secondary-color)] mb-6">
                Tailored solutions for large organizations and hiring teams.
              </p>
              <ul className="text-[var(--text-secondary-color)] space-y-2 mb-6">
                <li>• Unlimited postings</li>
                <li>• Dedicated support</li>
                <li>• Advanced analytics</li>
              </ul>
              <Link
                to="/register?role=employer"
                className="w-full inline-block text-center border border-[var(--primary-500)] text-[var(--primary-700)] px-6 py-3 rounded-md font-semibold hover:bg-[var(--primary-100)] transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-[var(--text-color)] mb-4">
            Ready to hire?
          </h2>
          <p className="text-[var(--text-secondary-color)] mb-6">
            Create an account to post your first job or log in to continue.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/register"
              className="bg-[var(--primary-500)] text-white px-6 py-3 rounded-md font-semibold hover:bg-[var(--primary-700)] transition-all"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="border border-[var(--primary-500)] text-[var(--primary-700)] px-6 py-3 rounded-md font-semibold hover:bg-[var(--primary-100)] transition-all"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Employers;