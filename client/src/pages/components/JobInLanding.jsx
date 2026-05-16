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
  className={`glass-card job-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between ${className}`}
>

      <div className="flex-1">
        <div className="flex items-start justify-between mb-1">
          <div className="flex flex-wrap items-center gap-2 text-lg text-[var(--text-primary-50)] mb-1">
           <FaBriefcase style={{ color: "var(--primary-500)" }} />
            <span className="text-base font-semibold" style={{ color: "var(--text-color)" }}>{position}</span>
            

          </div>
          {jobType && (
  <span className={`job-type-badge job-type-${jobType}`}>
    {jobTypeLabel}
  </span>
)}

        </div>

        <div className="flex items-center mb-1 gap-2 text-[var(--text-primary-50)]">
          <FaHospital style={{ color: "var(--primary-600)" }} />

          <span className="text-base">{company}</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-primary-700)] mb-2">
          <div className="flex items-center">
            <FaMapMarkerAlt className="mr-1" style={{ color: "var(--primary-500)", opacity: 0.7 }} />
            <span>{jobLocation}</span>
          </div>
          <div className="flex items-center">
            <FaStethoscope className="mr-1" style={{ color: "var(--primary-500)", opacity: 0.7 }} />
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
