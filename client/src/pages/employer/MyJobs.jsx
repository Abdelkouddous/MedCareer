import { toast } from "react-toastify";
import { useLoaderData } from "react-router";
import { createContext, useContext } from "react";
import customFetch from "../../utils/customFetch";
import { JobCardWrapper } from "../../assets/wrappers/AllJobsWrapper";
import Job from "../components/Job";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/employers/my-jobs");
    return { data };
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return { data: { jobs: [], count: 0 } };
  }
};

const MyJobsContext = createContext();

const MyJobs = () => {
  const { data } = useLoaderData();
  const jobs = data.jobs || [];
  const totalJobs = data.count || jobs.length;

  return (
    <MyJobsContext.Provider value={{ data: { jobs, totalJobs } }}>
      <h1 className="text-center text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-color)] mb-6">
        My
        <span className="text-[var(--primary-500)]"> Jobs</span>
      </h1>
      
      {jobs.length === 0 ? (
        <JobCardWrapper>
          <h3> No jobs to display ...</h3>
        </JobCardWrapper>
      ) : (
        <JobCardWrapper>
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
      )}
    </MyJobsContext.Provider>
  );
};

export const useAllJobsContext = () => useContext(MyJobsContext);
export default MyJobs;
