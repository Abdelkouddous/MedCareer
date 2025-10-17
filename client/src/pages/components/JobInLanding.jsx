import { Link } from "react-router-dom";
import {
  FaBriefcase,
  FaHospital,
  FaMapMarkerAlt,
  FaStethoscope,
} from "react-icons/fa";
import day from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

day.extend(advancedFormat);

// Lightweight Job card for Landing page, based on components/Job.jsx
// - No edit/delete actions
// - Shows core job info and a CTA link
// - Accepts optional className to customize container styling
export default function JobInLanding({
  _id,
  position,
  company,
  jobLocation,
  jobType,
  createdAt,
  specialization,
  className = "",
  to = "/job-seekers/jobs",
}) {
  const date = createdAt ? day(createdAt).format("MMM DD, YYYY") : null;
  const jobTypeLabel = (jobType || "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div
      className={`bg-gradient-to-tr from-[var(--cta-gradient-from)] to-[var(--cta-gradient-to)] rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row md:items-center md:justify-between ${className}`}
    >
      <div className="flex-1">
        <div className="flex items-start justify-between mb-1">
          <div className="flex flex-wrap items-center gap-2 text-lg text-[var(--text-primary-50)] mb-1">
            <FaBriefcase />
            <span>{position}</span>
          </div>
          {jobType && (
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                jobType === "full-time"
                  ? "bg-[var(--primary-100)] text-[var(--primary-700)]"
                  : "bg-[var(--background-secondary-color)] text-[var(--text-color)]"
              }`}
            >
              {jobTypeLabel}
            </span>
          )}
        </div>

        <div className="flex items-center mb-1 gap-2 text-[var(--text-primary-50)]">
          <FaHospital />
          <span className="text-base">{company}</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-primary-700)] mb-2">
          <div className="flex items-center">
            <FaMapMarkerAlt className="mr-1" />
            <span>{jobLocation}</span>
          </div>
          <div className="flex items-center">
            <FaStethoscope className="mr-1" />
            <span>{specialization}</span>
          </div>
        </div>

        {date && (
          <div className="text-xs text-[var(--text-primary-300)]">
            Posted on {date}
          </div>
        )}
      </div>

      <div className="mt-4 md:mt-0 md:ml-6"></div>
    </div>
  );
}
