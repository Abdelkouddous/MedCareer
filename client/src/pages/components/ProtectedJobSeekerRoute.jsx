import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch";

const ProtectedJobSeekerRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("jobseeker_token");

        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Verify token with server using customFetch with proper headers
        const response = await customFetch.get("/jobseekers/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // customFetch (axios) automatically resolves successful responses
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("jobseeker_token");
        localStorage.removeItem("jobseeker_user");
        setIsAuthenticated(false);

        // Show error message only for non-401 errors to avoid spam
        if (error.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
        } else if (error.response?.status !== 401) {
          toast.error("Authentication check failed. Please log in again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate to="/login-jobseeker" state={{ from: location }} replace />
    );
  }

  return children;
};

export default ProtectedJobSeekerRoute;
