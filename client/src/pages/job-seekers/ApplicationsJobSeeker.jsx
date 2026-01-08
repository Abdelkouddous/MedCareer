import { useEffect, useState } from "react";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import Wrapper from "../../assets/wrappers/JobsContainer";
import day from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { Link } from "react-router-dom";

day.extend(advancedFormat);

const ApplicationsJobSeeker = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data } = await customFetch.get("/jobseekers/applications");
      setApplications(data.applications || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <Wrapper>
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-[var(--text-color)]">No applications yet...</h2>
          <p className="mt-2 text-[var(--text-secondary-color)]">start applying to jobs to track them here!</p>
          <Link to="/job-seekers/jobs" className="btn mt-4 inline-block">Browse Jobs</Link>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <h1 className="text-3xl font-bold mb-8 text-[var(--text-color)]">My Applications</h1>
      <div className="jobs">
        {applications.map((app) => (
          <article key={app._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4">
            <header className="flex justify-between items-start mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-500 rounded text-white flex items-center justify-center text-xl font-bold uppercase">
                  {app.job.company.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[var(--text-color)]">{app.job.position}</h3>
                  <p className="text-[var(--text-secondary-color)]">{app.job.company}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                app.status === 'interview' ? 'bg-blue-100 text-blue-800' :
                app.status === 'declined' ? 'bg-red-100 text-red-800' :
                'bg-green-100 text-green-800'
              }`}>
                {app.status.toUpperCase()}
              </span>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[var(--text-secondary-color)]">
               <div className="flex items-center gap-2">
                 <span className="font-semibold">Applied:</span>
                 {day(app.createdAt).format("MMM Do, YYYY")}
               </div>
               <div className="flex items-center gap-2">
                 <span className="font-semibold">Location:</span>
                 {app.job.jobLocation}
               </div>
               <div className="flex items-center gap-2">
                 <span className="font-semibold">Type:</span>
                 {app.job.jobType}
               </div>
               <div className="flex items-center gap-2">
                 <span className="font-semibold">Compatibility:</span>
                 {app.compatibilityScore ? `${app.compatibilityScore}%` : 'N/A'}
               </div>
            </div>

            <footer className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
               {/* Could add a link to view job details if that route exists */}
               <Link to={`/job-details/${app.job._id}`} className="text-primary-500 hover:text-primary-700 font-medium">
                  View Job Details
               </Link>
            </footer>
          </article>
        ))}
      </div>
    </Wrapper>
  );
};

export default ApplicationsJobSeeker;
