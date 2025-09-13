import { createContext, useContext, useState } from "react";
import { Outlet, redirect, useLoaderData, useNavigate } from "react-router";
import Wrapper from "../assets/wrappers/Dashboard";
import { BigSideBar, LogoutContainer, SmallSideBar } from ".";
import { checkDefaultTheme } from "../App";
import {
  FaUserCircle,
  FaCaretDown,
  FaAlignLeft,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";

const DashboardContext = createContext();
// middleware to block access to the dashboard
export const loader = async () => {
  try {
    const { data } = await customFetch.get("/users/current-user");
    return data;
  } catch (error) {
    toast.error("You must be logged in to access the dashboard");
    console.log(error?.data?.msg);
    return redirect("/login");
  }
};

const DashboardNavbar = () => {
  const { toggleSidebar, toggleDarkTheme, isDarkTheme } = useDashboardContext();

  return (
    <nav className="bg-primary-500 sticky">
      <div className="px-4 h-12 flex items-center justify-between">
        <button
          type="button"
          className="bg-transparent border-transparent text-primary-500 flex items-center"
          onClick={toggleSidebar}
        >
          <FaAlignLeft className="h-6 w-6" />
        </button>

        <div className="flex-1 mx-4">
          <h2 className="text-xl font-semibold hidden md:block">Dashboard</h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme toggle button */}
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            onClick={toggleDarkTheme}
            aria-label={
              isDarkTheme ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {isDarkTheme ? <FaSun /> : <FaMoon />}
          </button>
          {/* Logout container */}
          <LogoutContainer />
        </div>
      </div>
    </nav>
  );
};

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { user } = useLoaderData();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme);

  const toggleDarkTheme = () => {
    const newDarkTheme = !isDarkTheme;
    setIsDarkTheme(newDarkTheme);
    document.body.classList.toggle("dark-theme", newDarkTheme);
    localStorage.setItem("darkTheme", newDarkTheme);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Logout function
  const logoutUser = async () => {
    try {
      await customFetch.get("/auth/logout");
      navigate("/login", { replace: true });
      toast.success(`See you soon ${user.name}`);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("There was an error logging out");
    }
  };

  // Navigation functions for the LogoutContainer
  const navigateToProfile = () => {
    navigate("/dashboard/profile");
  };

  const navigateToApplications = () => {
    navigate("/dashboard/stats");
  };

  return (
    <DashboardContext.Provider
      value={{
        user,
        showSidebar,
        isDarkTheme,
        toggleDarkTheme,
        toggleSidebar,
        logoutUser,
        navigateToProfile,
        navigateToApplications,
      }}
    >
      <Wrapper>
        <main className="dashboard">
          <SmallSideBar />
          <BigSideBar />
          <div className="dashboard-content">
            <DashboardNavbar />
            <div className="dashboard-page">
              <Outlet context={{ user }} />
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => useContext(DashboardContext);
export default DashboardLayout;
