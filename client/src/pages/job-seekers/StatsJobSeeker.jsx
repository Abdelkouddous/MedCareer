import { useEffect, useState } from "react";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import {
  TrendingUp,
  Assignment,
  Visibility,
  CheckCircle,
  Cancel,
  BarChart,
} from "@mui/icons-material";
import Wrapper from "../../assets/wrappers/StatsContainer";

const barColor = (score) => {
  const r = Math.round((100 - score) * 2.55);
  const g = Math.round(score * 2.55);
  return `rgb(${r}, ${g}, 80)`;
};

function StatsJobSeeker() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await customFetch.get("/jobseekers/stats");
      setStats(res.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="loading"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <BarChart className="mx-auto mb-4 text-6xl text-[var(--grey-400)]" />
        <h3 className="text-xl font-semibold text-[var(--text-secondary-color)]">
          No stats available
        </h3>
      </div>
    );
  }

  const { counts, total, avgCompatibility } = stats;

  const statCards = [
    {
      title: "Applied",
      value: counts.applied,
      icon: Assignment,
      color: "bg-[var(--primary-100)] text-[var(--primary-700)]",
      iconBg: "bg-[var(--primary-500)]",
    },
    {
      title: "Viewed",
      value: counts.viewed,
      icon: Visibility,
      color: "bg-blue-100 text-blue-700",
      iconBg: "bg-blue-500",
    },
    {
      title: "Accepted",
      value: counts.accepted,
      icon: CheckCircle,
      color: "bg-green-100 text-green-700",
      iconBg: "bg-green-500",
    },
    {
      title: "Rejected",
      value: counts.rejected,
      icon: Cancel,
      color: "bg-red-100 text-red-700",
      iconBg: "bg-red-500",
    },
  ];

  return (
    <Wrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-color)] mb-2">
          Application Statistics
        </h1>
        <p className="text-[var(--text-secondary-color)]">
          Track your job application progress and performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-[var(--background-secondary-color)] p-6 rounded-lg border border-[var(--grey-200)] hover:shadow-lg transition-all duration-300"
              style={{ boxShadow: "var(--shadow-1)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[var(--text-secondary-color)] text-sm font-medium mb-1">
                    {stat.title}
                  </p>
                  <h3 className="text-3xl font-bold text-[var(--text-color)]">
                    {stat.value}
                  </h3>
                </div>
                <div className={`p-3 rounded-full ${stat.iconBg}`}>
                  <IconComponent className="text-white text-xl" />
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${stat.color}`}
              >
                {((stat.value / total) * 100 || 0).toFixed(1)}% of total
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Total Applications */}
        <div
          className="bg-[var(--background-secondary-color)] p-6 rounded-lg border border-[var(--grey-200)]"
          style={{ boxShadow: "var(--shadow-1)" }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[var(--primary-500)] p-3 rounded-full">
              <TrendingUp className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--text-color)]">
                Total Applications
              </h3>
              <p className="text-[var(--text-secondary-color)]">
                All time applications submitted
              </p>
            </div>
          </div>
          <div className="text-4xl font-bold text-[var(--primary-500)]">
            {total}
          </div>
        </div>

        {/* Average Compatibility */}
        <div
          className="bg-[var(--background-secondary-color)] p-6 rounded-lg border border-[var(--grey-200)]"
          style={{ boxShadow: "var(--shadow-1)" }}
        >
          <div className="mb-4">
            <h3 className="text-xl font-bold text-[var(--text-color)] mb-2">
              Average Compatibility
            </h3>
            <p className="text-[var(--text-secondary-color)]">
              How well you match job requirements
            </p>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-2xl font-bold text-[var(--text-color)]">
                {avgCompatibility}%
              </span>
              <span className="text-sm text-[var(--text-secondary-color)]">
                {avgCompatibility >= 80
                  ? "Excellent"
                  : avgCompatibility >= 60
                  ? "Good"
                  : avgCompatibility >= 40
                  ? "Fair"
                  : "Needs Improvement"}
              </span>
            </div>

            <div className="w-full h-4 rounded-full bg-[var(--grey-200)] overflow-hidden">
              <div
                className="h-4 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${avgCompatibility}%`,
                  backgroundColor: barColor(avgCompatibility),
                }}
              />
            </div>
          </div>

          <p className="text-sm text-[var(--text-secondary-color)]">
            {avgCompatibility < 60 &&
              "Consider updating your profile to improve compatibility scores"}
          </p>
        </div>
      </div>

      {/* Success Rate */}
      {total > 0 && (
        <div
          className="bg-[var(--background-secondary-color)] p-6 rounded-lg border border-[var(--grey-200)]"
          style={{ boxShadow: "var(--shadow-1)" }}
        >
          <h3 className="text-xl font-bold text-[var(--text-color)] mb-4">
            Application Success Rate
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {((counts.accepted / total) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-[var(--text-secondary-color)]">
                Acceptance Rate
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {((counts.viewed / total) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-[var(--text-secondary-color)]">
                View Rate
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {((counts.rejected / total) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-[var(--text-secondary-color)]">
                Rejection Rate
              </div>
            </div>
          </div>
        </div>
      )}
    </Wrapper>
  );
}

export default StatsJobSeeker;
