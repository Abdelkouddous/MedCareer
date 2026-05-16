import { Link } from "react-router-dom";
import Wrapper from "../assets/wrappers/Dashboard";

const SalaryGuide = () => {
  return (
    <Wrapper className="min-h-screen bg-[var(--background-color)]">
      <section className="py-16 px-4 bg-[var(--surface-primary)] border-b border-[var(--grey-200)]">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-color)] mb-3">
            Salary Guide for Medical Professionals
          </h1>
          <p className="text-[var(--text-secondary-color)] max-w-3xl">
            Explore typical salary ranges for common healthcare roles. Values
            are indicative and vary by location, seniority, and employer.
          </p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Registered Nurse",
              range: "50,000 DA – 80,000 DA",
              notes: "Hospital, clinic, home care",
            },
            {
              title: "General Practitioner",
              range: "150,000 DA – 250,000 DA",
              notes: "Public and private practice",
            },
            {
              title: "Pharmacist",
              range: "80,000 DA – 150,000 DA",
              notes: "Retail, hospital, industry",
            },
            {
              title: "Radiology Technician",
              range: "40,000 DA – 70,000 DA",
              notes: "Hospitals and imaging centers",
            },
            {
              title: "Dental Surgeon",
              range: "120,000 DA – 220,000 DA",
              notes: "Clinics and private practice",
            },
            {
              title: "Physiotherapist",
              range: "60,000 DA – 100,000 DA",
              notes: "Rehab centers and private practice",
            },
          ].map((role) => (
            <div
              key={role.title}
              className="bg-[var(--surface-primary)] border rounded-lg p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-[var(--text-color)] mb-2">
                {role.title}
              </h3>
              <p className="text-[var(--primary-700)] font-medium mb-1">
                {role.range}
              </p>
              <p className="text-[var(--text-secondary-color)]">{role.notes}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 px-4 bg-[var(--background-secondary-color)] border-t border-[var(--grey-200)]">
        <div className="container mx-auto text-center">
          <p className="text-[var(--text-secondary-color)] mb-4">
            Salary data is for guidance only. For tailored insights, explore
            active job listings.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/jobs" className="btn">
              Browse Jobs
            </Link>
            <Link to="/register" className="btn-hipster">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </Wrapper>
  );
};

export default SalaryGuide;
