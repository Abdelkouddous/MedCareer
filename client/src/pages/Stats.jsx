import React from "react";
import {
  FaCalendarCheck,
  FaHospital,
  FaUserMd,
  FaStethoscope,
  FaXingSquare,
  FaBug,
  FaTimesCircle,
  FaClock,
  FaUserCheck,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import Wrapper from "../assets/wrappers/StatsContainer";
import customFetch from "../utils/customFetch";
import { Loader } from "lucide-react";

const StatsItem = ({ count, title, icon, color, bcg, isLoading = false }) => {
  if (isLoading) {
    return (
      <article className="stat-card loading">
        <header className="stat-header">
          <div className="stat-icon loading" style={{ background: bcg }}></div>
          <div className="stat-info">
            <div className="stat-count loading"></div>
            <h5 className="stat-title loading"></h5>
          </div>
        </header>
      </article>
    );
  }

  return (
    <article
      className="stat-card"
      style={{ borderLeft: `4px solid ${color}` }}
      aria-label={`Statistic: ${title}`}
    >
      <header className="stat-header">
        <span
          className="stat-icon"
          style={{ background: bcg }}
          aria-hidden="true"
        >
          {icon}
        </span>
        <div className="stat-info">
          <span className="stat-count">{count}</span>
          <h5 className="stat-title">{title}</h5>
        </div>
      </header>
    </article>
  );
};

const ChartsContainer = ({ statusData, monthlyData, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="charts-section loading">
        <article className="charts-container loading">
          <h4 className="section-title">Application Status Breakdown</h4>
          <div className="chart-wrapper loading"></div>
        </article>
      </div>
    );
  }

  return (
    <div className="charts-section">
      {/* Status Breakdown Chart */}
      <article className="charts-container">
        <h4 className="section-title">Application Status Breakdown</h4>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={statusData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--text-color)" }}
                axisLine={{ stroke: "#e0e0e0" }}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "var(--text-color)" }}
                axisLine={{ stroke: "#e0e0e0" }}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--background-secondary-color)",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              />
              <Bar
                dataKey="count"
                fill="var(--primary-500)"
                barSize={60}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      {/* Monthly Applications Chart */}
      <article className="charts-container">
        <h4 className="section-title">Monthly Applications</h4>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart
              data={monthlyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="date"
                tick={{ fill: "var(--text-color)" }}
                axisLine={{ stroke: "#e0e0e0" }}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "var(--text-color)" }}
                axisLine={{ stroke: "#e0e0e0" }}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--background-secondary-color)",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="var(--primary-500)"
                fill="var(--primary-200)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </article>
    </div>
  );
};

const InsightCard = ({ title, value, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="insight-card loading">
        <h5 className="insight-title loading"></h5>
        <p className="insight-value loading"></p>
      </div>
    );
  }

  return (
    <div className="insight-card">
      <h5 className="insight-title">{title}</h5>
      <p className="insight-value">{value}</p>
    </div>
  );
};

const Stats = () => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [statsData, setStatsData] = React.useState([]);
  const [statusChartData, setStatusChartData] = React.useState([]);
  const [monthlyChartData, setMonthlyChartData] = React.useState([]);
  const [insightsData, setInsightsData] = React.useState([]);

  // Function to fetch data from API
  const fetchApplicationStats = async () => {
    try {
      setLoading(true);

      // Fetch from the correct endpoint
      const response = await customFetch.get("/jobs/show-stats");
      const data = response.data;

      // Update data for statistic cards
      const updatedStatsData = [
        {
          id: 1,
          count: data.totalJobs || 0,
          title: "Total Jobs",
          icon: <FaCalendarCheck />,
          color: "var(--primary-100)", // Blue for total/overall metrics
          bcg: "var(--primary-500)", // Light blue background
        },
        {
          id: 2,
          count: data.appliedJobs || 0,
          title: "Applied Jobs",
          icon: <FaUserCheck />, // Changed from FaHospital to FaUserCheck for applied
          color: "var(--success-dark)", // Green for successful actions
          bcg: "var(--success-light)", // Light green background
        },
        {
          id: 3,
          count: data.pendingJobs || 0,
          title: "Pending Jobs",
          icon: <FaClock />, // Changed from FaUserMd to FaClock for pending
          color: "var(--warning-dark)", // Orange for pending/waiting
          bcg: "var(--warning-light)", // Light orange background
        },
        {
          id: 4,
          count: data.declinedJobs || 0,
          title: "Declined Jobs",
          icon: <FaTimesCircle />, // Changed from FaBug to FaTimesCircle for declined
          color: "var(--danger-dark)", // Red for declined/rejected
          bcg: "var(--danger-light)", // Light red background
        },
      ];

      // Update data for status chart
      const updatedStatusChartData = [
        { name: "Pending", count: data.defaultStats?.pending || 0 },
        { name: "Interview", count: data.defaultStats?.interview || 0 },
        { name: "Declined", count: data.defaultStats?.declined || 0 },
      ];

      // Update data for monthly chart
      const updatedMonthlyChartData = data.monthlyApplications || [];

      // Calculate insights based on the data
      const totalApplications = data.totalJobs || 0;
      const interviewRate =
        totalApplications > 0
          ? Math.round(
              ((data.defaultStats?.interview || 0) / totalApplications) * 100
            )
          : 0;

      const updatedInsightsData = [
        {
          title: "Interview Rate",
          value: `${interviewRate}%`,
        },
        {
          title: "Pending Applications",
          value: data.defaultStats?.pending || 0,
        },
        {
          title: "Success Rate",
          value: `${Math.round(interviewRate * 0.6)}%`, // Estimated success rate
        },
        {
          title: "Monthly Average",
          value:
            updatedMonthlyChartData.length > 0
              ? Math.round(
                  updatedMonthlyChartData.reduce(
                    (sum, item) => sum + item.count,
                    0
                  ) / updatedMonthlyChartData.length
                )
              : 0,
        },
      ];

      setStatsData(updatedStatsData);
      setStatusChartData(updatedStatusChartData);
      setMonthlyChartData(updatedMonthlyChartData);
      setInsightsData(updatedInsightsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError(err.response?.data?.message || "Failed to load statistics");
    } finally {
      console.log("🏁 fetchApplicationStats completed");
      setLoading(false);
    }
  };

  React.useEffect(() => {
    console.log("🚀 useEffect triggered, calling fetchApplicationStats");
    fetchApplicationStats();
  }, []); // Empty dependency array

  if (error) {
    return (
      <Wrapper>
        <div className="error-message">
          <p>Error loading data: {error}</p>
          <button onClick={fetchApplicationStats} className="retry-btn">
            Retry
          </button>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="dashboard-header">
        <h2 className="page-title">Job Application Dashboard</h2>
        <p className="dashboard-subtitle">
          Track your job application progress and statistics
        </p>
      </div>

      <div className="stats-grid">
        {statsData.map((item) => (
          <StatsItem key={item.id} {...item} isLoading={loading} />
        ))}
      </div>

      <ChartsContainer
        statusData={statusChartData}
        monthlyData={monthlyChartData}
        isLoading={loading}
      />

      <section className="insights-section">
        <h4 className="section-title">Application Insights</h4>
        <div className="insights-grid">
          {insightsData.map((insight, index) => (
            <InsightCard key={index} {...insight} isLoading={loading} />
          ))}
        </div>
      </section>
    </Wrapper>
  );
};

export default Stats;
