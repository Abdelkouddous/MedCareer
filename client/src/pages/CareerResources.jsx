import { Link } from "react-router-dom";

const CareerResources = () => {
  return (
    <div className="min-h-screen bg-[var(--background-color)]">
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-[var(--text-color)] mb-4">Career Resources</h1>
          <p className="text-[var(--text-secondary-color)] mb-6">
            Practical guides, interview prep, and growth tips for medical careers.
          </p>
          <ul className="space-y-3 text-[var(--text-secondary-color)]">
            <li>• How to prepare for clinical interviews</li>
            <li>• Certifications to boost your profile</li>
            <li>• Networking in healthcare</li>
          </ul>
          <div className="mt-8 flex gap-4">
            <Link to="/jobs" className="btn">Browse Jobs</Link>
            <Link to="/register" className="btn-hipster">Create Account</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareerResources;