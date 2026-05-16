import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Work, Person, BarChart, Email, Logout, Assignment, Description } from "@mui/icons-material";
import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch";
import Wrapper from "../../assets/wrappers/Dashboard";
import { Sun, Moon, Home } from "lucide-react";
import { checkDefaultTheme } from "../../App";

const JobSeekers = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme());
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await customFetch.get("/jobseekers/me");
        setUser(data.jobSeeker || data);
      } catch (err) {
        console.log("Could not fetch user for sidebar");
      }
    };
    fetchUser();
  }, []);

  const toggleTheme = () => {
    const newDarkTheme = !isDarkTheme;
    setIsDarkTheme(newDarkTheme);
    document.body.classList.toggle("dark-theme", newDarkTheme);
    localStorage.setItem("darkTheme", newDarkTheme);
  };

  const navItems = [ 
    {text: "Dashboard", path: "/job-seekers/dashboard", icon: <Home />},
    { text: "Jobs", path: "/job-seekers/jobs", icon: <Work /> },
    { text: "Applications", path: "/job-seekers/applications", icon: <Assignment /> },
    { text: "Stats", path: "/job-seekers/stats", icon: <BarChart /> },
    { text: "Inbox", path: "/job-seekers/inbox", icon: <Email /> },
    { text: "My CV", path: "/job-seekers/cv-template", icon: <Description /> },
    { text: "Profile", path: "/job-seekers/profile", icon: <Person /> },
  ];

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleLogout = async () => {
    try {
      // Call the logout endpoint to clear server-side session (cookies)
      const response = await customFetch.post("/jobseekers/logout");

      if (response.status === 200) {
        // No localStorage usage; rely on server to clear cookies
        toast.success("Logged out successfully");
        navigate("/job-seekers/login", { replace: true });
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <Wrapper>
      <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static top-0 left-0 z-50 w-60 h-full bg-[var(--background-secondary-color)] border-r border-[var(--grey-200)] transition-transform duration-300 ease-in-out`}
        style={{ boxShadow: "var(--shadow-1)" }}
      >
        {/* Header with Avatar */}
        <div className="px-4 py-5 border-b border-[var(--grey-200)]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: "var(--primary-500)", color: "#ffffff" }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-[var(--text-color)] truncate m-0">
                {user?.name || "Job Seeker"}
              </h3>
              {user?.specialization && (
                <span
                  className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium"
                  style={{ background: "rgba(0,194,168,0.15)", color: "var(--primary-500)" }}
                >
                  {user.specialization}
                </span>
              )}
            </div>
          </div>
          <button onClick={toggleSidebar} className="btn-hipster md:hidden p-2 mt-2">
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 flex-1">
          <ul className="px-2">
            {navItems.map((item) => (
              <li key={item.text} className="mb-2">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-[var(--primary-500)] bg-[rgba(0,194,168,0.1)]"
                        : "text-[var(--text-secondary-color)] hover:text-[var(--text-color)] hover:bg-[var(--surface-secondary)]"
                    }`
                  }
                  style={({ isActive }) => ({
                    borderLeft: isActive ? "3px solid var(--primary-500)" : "3px solid transparent",
                    textDecoration: "none",
                  })}
                  onClick={() => setShowSidebar(false)}
                >
                  {item.icon}
                  <span>{item.text}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button in Sidebar */}
        <div className="p-2 border-t border-[var(--grey-200)]">
          <button
            onClick={handleLogout}
            className="danger-btn btn-block flex items-center gap-3 px-4 py-3"
            style={{
              borderRadius: "var(--border-radius)",
              transition: "var(--transition)",
            }}
          >
            <Logout />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-0">
        {/* Top Navbar */}
        <header
          className="h-16 bg-[var(--background-secondary-color)] border-b border-[var(--grey-200)] flex items-center justify-between px-6"
          style={{ boxShadow: "var(--shadow-1)" }}
        >
          <div className="flex items-center gap-4">
            <button
              className="btn-hipster md:hidden p-2"
              onClick={toggleSidebar}
            >
              ☰
            </button>
            <h2 className="text-2xl font-semibold text-[var(--text-color)] m-0">
              VitalWork Connect
            </h2>
          </div>

          {/* New Container for Theme and Logout */}
          <div className="flex items-center gap-4">
             {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme} 
              className="btn-hipster p-2 rounded-full"
              aria-label="Toggle Theme"
            >
              {isDarkTheme ? <Sun /> : <Moon />}
            </button>

            {/* Logout Button in Navbar */}
            <button
              onClick={handleLogout}
              className="danger-btn flex items-center gap-2 px-4 py-2"
              style={{
                borderRadius: "var(--border-radius)",
                transition: "var(--transition)",
              }}
            >
              <Logout />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-[var(--background-color)] overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}
      </div>
    </Wrapper>
  );
};

export default JobSeekers;
