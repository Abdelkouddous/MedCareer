// This file is being replaced by a more flexible component or handled locally in MyJobs
// To avoid breaking changes, I will leave this file alone and create a separate EmployerJobContainer
// OR I will simply inline the Job mapping in MyJobs.jsx which is cleaner.
// Reverting to previous thought: Inline logic in MyJobs.jsx.
// import { GiMedicines } from "react-icons/gi";
import { JobCardWrapper } from "../../assets/wrappers/AllJobsWrapper";
import Job from "./Job";
import { useAllJobsContext } from "../jobs-operations/AllJobs";

export const JobContainer = () => {
  const { data } = useAllJobsContext();
  //
  //
  const totalJobs = data?.totalJobs ?? 0;
  const jobs = data?.jobs || [];

  if (jobs.length === 0) {
    return (
      <JobCardWrapper>
        <h3> No jobs to display ...</h3>
      </JobCardWrapper>
    );
  }
  return (
    <JobCardWrapper>
      <h1 className="text-center text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-color)] mb-6">
        Our Recent
        <span className="text-[var(--primary-500)]"> Jobs</span>
      </h1>
      <h4 className="text-lg md:text-xl font-medium text-[var(--text-secondary)] mb-6 text-center">
        <span className="text-[var(--primary-500)]">{jobs.length}</span> job
        {jobs.length > 1 ? "s" : ""} displayed out of{" "}
        <span className="text-[var(--primary-500)]">{totalJobs}</span> job
        {totalJobs > 1 ? "s" : ""} found
      </h4>

      {jobs.map((job) => {
        return <Job key={job._id} {...job} />;
      })}
    </JobCardWrapper>
  );
};

export default JobContainer;
