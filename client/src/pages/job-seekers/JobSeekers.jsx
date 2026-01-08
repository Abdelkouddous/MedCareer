import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Work, Person, BarChart, Email, Logout, Assignment } from "@mui/icons-material";
import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch";
import Wrapper from "../../assets/wrappers/Dashboard";
import { Sun, Moon } from "lucide-react";
import { checkDefaultTheme } from "../../App";

const JobSeekers = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme());
  const navigate = useNavigate();

  const toggleTheme = () => {
    const newDarkTheme = !isDarkTheme;
    setIsDarkTheme(newDarkTheme);
    document.body.classList.toggle("dark-theme", newDarkTheme);
    localStorage.setItem("darkTheme", newDarkTheme);
  };

  const navItems = [
    { text: "Jobs", path: "/job-seekers/jobs", icon: <Work /> },
    { text: "Applications", path: "/job-seekers/applications", icon: <Assignment /> },
    { text: "Stats", path: "/job-seekers/stats", icon: <BarChart /> },
    { text: "Inbox", path: "/job-seekers/inbox", icon: <Email /> },
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
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--grey-200)]">
          <h1 className="text-xl font-bold text-[var(--primary-500)] m-0">
            Job Seekers
          </h1>
          <button onClick={toggleSidebar} className="btn-hipster md:hidden p-2">
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
                    isActive ? "btn btn-block" : "btn-hipster btn-block"
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem 1rem",
                    textDecoration: "none",
                    borderRadius: "var(--border-radius)",
                    transition: "var(--transition)",
                  }}
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
              MedCareer Connect
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
