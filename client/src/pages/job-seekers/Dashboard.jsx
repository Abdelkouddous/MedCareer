import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiBriefcase,
  FiUser,
  FiMail,
  FiBarChart2,
  FiBookmark,
  FiMessageSquare,
} from "react-icons/fi";
import customFetch from "../../utils/customFetch";
import day from "dayjs";

const Dashboard = () => {
  const [jobSeeker, setJobSeeker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    offers: 0,
  });
  const [recentApps, setRecentApps] = useState([]);

  // Determine greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    const fetchJobSeekerData = async () => {
      try {
        const response = await customFetch.get("/jobseekers/me");
        setJobSeeker(response.data.jobSeeker || response.data);

        try {
          const statsResponse = await customFetch.get("/jobseekers/stats");
          setStats(statsResponse.data);
        } catch (error) {
          console.log("Stats not available yet:", error.message);
        }

        // Fetch recent applications
        try {
          const appsResponse = await customFetch.get("/jobseekers/applications");
          setRecentApps((appsResponse.data.applications || []).slice(0, 5));
        } catch (error) {
          console.log("Applications not available:", error.message);
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
        <div className="loading"></div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Applications",
      value: stats.applications || recentApps.length,
      icon: <FiBriefcase />,
      color: "var(--primary-500)",
      bgAlpha: "rgba(0,194,168,0.12)",
    },
    {
      label: "Interviews",
      value: stats.interviews || 0,
      icon: <FiMessageSquare />,
      color: "#8B5CF6",
      bgAlpha: "rgba(139,92,246,0.12)",
    },
    {
      label: "Saved Jobs",
      value: stats.offers || 0,
      icon: <FiBookmark />,
      color: "#F59E0B",
      bgAlpha: "rgba(245,158,11,0.12)",
    },
    {
      label: "New Messages",
      value: 0,
      icon: <FiMail />,
      color: "#EF4444",
      bgAlpha: "rgba(239,68,68,0.12)",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "interview":
        return { background: "rgba(0,194,168,0.15)", color: "#00C2A8", border: "1px solid rgba(0,194,168,0.3)" };
      case "declined":
        return { background: "rgba(239,68,68,0.15)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.3)" };
      default:
        return { background: "rgba(245,158,11,0.15)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.3)" };
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Personalized Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-color)" }}>
          {getGreeting()},{" "}
          <span style={{ color: "var(--primary-500)" }}>
            {jobSeeker?.name || "there"}
          </span>{" "}
          👋
        </h1>
        <p style={{ color: "var(--text-secondary-color)" }}>
          Here's what's happening with your career today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="glass-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                style={{ background: card.bgAlpha, color: card.color }}
              >
                {card.icon}
              </div>
            </div>
            <p
              className="text-2xl font-bold mb-1"
              style={{ color: "var(--text-color)" }}
            >
              {card.value}
            </p>
            <p
              className="text-sm"
              style={{ color: "var(--text-secondary-color)" }}
            >
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Applications Table */}
      <div className="glass-card p-6 mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold m-0" style={{ color: "var(--text-color)" }}>
            Recent Applications
          </h2>
          <Link
            to="/job-seekers/applications"
            className="text-sm font-medium"
            style={{ color: "var(--primary-500)" }}
          >
            View All →
          </Link>
        </div>

        {recentApps.length === 0 ? (
          <div className="text-center py-8">
            <FiBriefcase
              className="mx-auto mb-3 text-3xl"
              style={{ color: "var(--text-secondary-color)", opacity: 0.5 }}
            />
            <p style={{ color: "var(--text-secondary-color)" }}>
              No applications yet.{" "}
              <Link to="/job-seekers/jobs" style={{ color: "var(--primary-500)" }}>
                Browse jobs
              </Link>
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="text-left"
                  style={{ color: "var(--text-secondary-color)", borderBottom: "1px solid var(--border-color)" }}
                >
                  <th className="pb-3 font-medium">Position</th>
                  <th className="pb-3 font-medium">Company</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Date</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.map((app) => (
                  <tr
                    key={app._id}
                    className="transition-colors duration-200"
                    style={{ borderBottom: "1px solid var(--border-color)" }}
                  >
                    <td className="py-3" style={{ color: "var(--text-color)" }}>
                      <span className="font-medium">
                        {app.job?.position || "Position unavailable"}
                      </span>
                    </td>
                    <td className="py-3" style={{ color: "var(--text-secondary-color)" }}>
                      {app.job?.company || "—"}
                    </td>
                    <td
                      className="py-3 hidden md:table-cell"
                      style={{ color: "var(--text-secondary-color)" }}
                    >
                      {day(app.createdAt).format("MMM D, YYYY")}
                    </td>
                    <td className="py-3">
                      <span
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold capitalize"
                        style={getStatusStyle(app.status)}
                      >
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4 m-0" style={{ color: "var(--text-color)" }}>
          Quick Links
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { to: "/job-seekers/jobs", icon: <FiBriefcase />, label: "Browse Jobs", color: "var(--primary-500)" },
            { to: "/job-seekers/applications", icon: <FiBarChart2 />, label: "My Applications", color: "#8B5CF6" },
            { to: "/job-seekers/inbox", icon: <FiMail />, label: "Messages", color: "#F59E0B" },
            { to: "/job-seekers/profile", icon: <FiUser />, label: "My Profile", color: "#EF4444" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-3 p-4 rounded-xl transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: "var(--surface-secondary)",
                border: "1px solid var(--border-color)",
                color: "var(--text-color)",
                textDecoration: "none",
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                style={{ background: `${link.color}20`, color: link.color }}
              >
                {link.icon}
              </div>
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
