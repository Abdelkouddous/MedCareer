import { Link } from "react-router-dom";

const JobSeekers = () => {
  return (
    <div className="min-h-[60vh] container mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-color)] mb-4">
        Job Seekers
      </h1>
      <p className="text-[var(--text-secondary-color)] mb-8">
        This is a placeholder page for the Job Seekers section. You can build
        out profile creation, resume upload, saved jobs, and application
        tracking here.
      </p>
      <div className="flex gap-3">
        <Link
          to="/dashboard/all-jobs"
          className="bg-[var(--primary-500)] text-[var(--white)] px-6 py-3 rounded-md font-semibold hover:bg-[var(--primary-700)] transition-all duration-200"
        >
          Browse Jobs
        </Link>
        <Link
          to="/register"
          className="border-2 border-[var(--primary-500)] text-[var(--primary-500)] px-6 py-3 rounded-md font-semibold hover:bg-[var(--primary-500)] hover:text-[var(--white)] transition-all duration-200"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default JobSeekers;
