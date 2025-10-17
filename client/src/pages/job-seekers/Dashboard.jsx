import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiBriefcase, FiUser, FiMail, FiBarChart2 } from "react-icons/fi";
import customFetch from "../../utils/customFetch";

const Dashboard = () => {
  const [jobSeeker, setJobSeeker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    offers: 0,
  });

  useEffect(() => {
    const fetchJobSeekerData = async () => {
      try {
        // Get job seeker profile data
        const response = await customFetch.get("/jobseekers/me");
        setJobSeeker(response.data);
        // Try to get stats if available
        try {
          const statsResponse = await customFetch.get("/jobseekers/stats");
          setStats(statsResponse.data);
        } catch (error) {
          console.log("Stats not available yet:", error.message);
        }
      } catch (fetchError) {
        console.error("Error fetching job seeker data:", fetchError);
      } finally {
        setLoading(false);
      }
    };

    fetchJobSeekerData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Job Seeker Dashboard</h1>

      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Welcome, {jobSeeker?.name || "Job Seeker"}!
        </h2>
        <p className="text-gray-600">
          Manage your job applications and career progress from this dashboard.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="bg-primary-100 p-3 rounded-full mr-4">
              <FiBriefcase className="text-primary-500 text-xl" />
            </div>
            <h3 className="text-lg font-semibold">Applications</h3>
          </div>
          <p className="text-3xl font-bold">{stats.applications}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FiMail className="text-blue-500 text-xl" />
            </div>
            <h3 className="text-lg font-semibold">Interviews</h3>
          </div>
          <p className="text-3xl font-bold">{stats.interviews}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <FiBarChart2 className="text-green-500 text-xl" />
            </div>
            <h3 className="text-lg font-semibold">Offers</h3>
          </div>
          <p className="text-3xl font-bold">{stats.offers}</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/job-seekers/jobs"
            className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiBriefcase className="text-primary-500 mr-3 text-xl" />
            <span>Browse Jobs</span>
          </Link>

          <Link
            to="/job-seekers/applications"
            className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiBarChart2 className="text-blue-500 mr-3 text-xl" />
            <span>My Applications</span>
          </Link>

          <Link
            to="/job-seekers/inbox"
            className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiMail className="text-green-500 mr-3 text-xl" />
            <span>Messages</span>
          </Link>

          <Link
            to="/job-seekers/profile"
            className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiUser className="text-purple-500 mr-3 text-xl" />
            <span>My Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
