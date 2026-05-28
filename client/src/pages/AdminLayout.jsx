import React, { createContext, useContext, useState } from "react";
import { Outlet, redirect, useLoaderData, useNavigate } from "react-router-dom";
import Wrapper from "../assets/wrappers/Dashboard";
import { AdminBigSidebar, AdminSmallSidebar } from "./components/AdminSidebar";
import { AdminNavbar } from "./components/AdminNavbar";
import { checkDefaultTheme } from "../App";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

const AdminContext = createContext();

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/employers/current-user");
    if (data?.user?.role !== "admin") {
      toast.error("Access Denied: Administrators only.");
      return redirect("/dashboard");
    }
    return data;
  } catch (error) {
    toast.error("You must be logged in to access the administrator workspace.");
    return redirect("/login");
  }
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user } = useLoaderData();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme);
  const [activeTab, setActiveTab] = useState("overview");

  const toggleDarkTheme = () => {
    const newDarkTheme = !isDarkTheme;
    setIsDarkTheme(newDarkTheme);
    document.body.classList.toggle("dark-theme", newDarkTheme);
    localStorage.setItem("darkTheme", String(newDarkTheme));
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const logoutUser = async () => {
    try {
      await customFetch.get("/auth/logout");
      navigate("/login", { replace: true });
      toast.success(`Session ended successfully.`);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("There was an error logging out");
    }
  };

  return (
    <AdminContext.Provider
      value={{
        user,
        showSidebar,
        setShowSidebar,
        isDarkTheme,
        toggleDarkTheme,
        toggleSidebar,
        logoutUser,
        activeTab,
        setActiveTab,
      }}
    >
      <Wrapper>
        <main className="dashboard">
          <AdminSmallSidebar />
          <AdminBigSidebar />
          <div className="dashboard-content">
            <AdminNavbar />
            <div className="dashboard-page">
              <Outlet context={{ user }} />
            </div>
          </div>
        </main>
      </Wrapper>
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => useContext(AdminContext);
export default AdminLayout;
