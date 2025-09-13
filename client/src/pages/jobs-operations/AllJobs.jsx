import { JobContainer } from "../components/JobContainer";
import { SearchContainer } from "../components";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import { useLoaderData } from "react-router";
import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PageBtnContainer from "../components/PageBtnContainer";

export const loader = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const { data } = await customFetch.get("/jobs", { params });
    return { data };
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    // keep a consistent shape on error
    return { data: { jobs: [], count: 0 } };
  }
};

const AllJobsContext = createContext();

const AllJobs = () => {
  const { data } = useLoaderData();
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [jobsPerPage] = useState(10); // You can change this to whatever number of pages you wanna display

  // Calculate pagination values
  // its better on backend
  const jobs = data?.jobs || [];
  const totalJobs = jobs.length;
  const numOfPages = Math.ceil(jobs.length / jobsPerPage);

  useEffect(() => {
    // reset to first page whenever filters/sort change
    setPage(1);
  }, [location.search]);

  // Get current jobs for the page
  const indexOfLastJob = page * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  // Change page
  const changePage = (pageNumber) => {
    // Make sure page number is within valid range
    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > numOfPages) pageNumber = numOfPages;
    setPage(pageNumber);
  };

  return (
    <AllJobsContext.Provider
      value={{
        data: { jobs: currentJobs, totalJobs },
        numOfPages,
        page,
        changePage,
      }}
    >
      <h1 className="text-center text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-color)] mb-6">
        Medical Job
        <span className="text-[var(--primary-500)]"> Applications</span>
      </h1>
      <SearchContainer />
      <JobContainer />
      {numOfPages > 1 && <PageBtnContainer />}
    </AllJobsContext.Provider>
  );
};

export const useAllJobsContext = () => useContext(AllJobsContext);
export default AllJobs;
