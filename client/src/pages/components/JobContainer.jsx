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
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-color)]">
          Our Recent
          <span className="text-[var(--primary-500)]"> Jobs</span>
        </h1>
        <h4 className="text-md md:text-lg font-medium text-[var(--text-secondary)]">
          Showing <span className="text-[var(--primary-500)]">{jobs.length}</span> out of{" "}
          <span className="text-[var(--primary-500)]">{totalJobs}</span> found
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {jobs.map((job) => {
          return <Job key={job._id} {...job} />;
        })}
      </div>
    </div>
  );
};

export default JobContainer;
