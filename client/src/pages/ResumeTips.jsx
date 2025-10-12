import { Link } from "react-router-dom";

const ResumeTips = () => {
  return (
    <div className="min-h-screen bg-[var(--background-color)]">
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-[var(--text-color)] mb-4">Resume Tips</h1>
          <p className="text-[var(--text-secondary-color)] mb-6">
            Craft a resume that highlights your clinical experience and certifications.
          </p>
          <ul className="space-y-3 text-[var(--text-secondary-color)]">
            <li>• Start with a concise professional summary</li>
            <li>• List licenses and certifications prominently</li>
            <li>• Emphasize outcomes and patient impact</li>
            <li>• Include relevant EMR systems and procedures</li>
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

export default ResumeTips;