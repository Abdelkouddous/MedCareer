// app.jsx

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  HomeLayout,
  Landing,
  DashboardLayout,
  Error,
  AddJob,
  Stats,
  AllJobs,
  Profile,
  DeleteJob,
  EditJob,
  Admin,
  JobSeekers,
  Employers,
  SalaryGuide,
  ResumeTips, 
  CareerResources,
  Login,
  Register,
} from "./pages";

// for job seekers
import RegisterJobSeeker from "./pages/job-seekers/RegisterJobSeeker";
import ConfirmAccount from "./pages/job-seekers/ConfirmAccount";
import LoginJobSeeker from "./pages/job-seekers/LoginJobSeeker";
import JobsJobSeeker from "./pages/job-seekers/JobsJobSeeker";
import StatsJobSeeker from "./pages/job-seekers/StatsJobSeeker";
import InboxJobSeeker from "./pages/job-seekers/InboxJobSeeker";
import ProfileJobSeeker from "./pages/job-seekers/ProfileJobSeeker";
import Dashboard from "./pages/job-seekers/Dashboard";
import ProtectedJobSeekerRoute from "./pages/components/ProtectedJobSeekerRoute";
// imported actions necessary
// removed actions for default auth routes; job seeker pages handle submit locally
// for job operations
import { action as addJobAction } from "./pages/jobs-operations/AddJob";
import { action as editJobAction } from "./pages/jobs-operations/EditJob";
import { action as deleteJobAction } from "./pages/jobs-operations/DeleteJob";
// for user operations
import { action as updateProfileAction } from "./pages/employer/Profile";
// imported loaders necessary
import { loader as dashboardLoader } from "./pages/DashboardLayout";
// for job operations
import { loader as allJobsLoader } from "./pages/jobs-operations/AllJobs";
import { loader as editJobLoader } from "./pages/jobs-operations/EditJob";
// imported loaders for admin page
import { loader as adminLoader } from "./pages/Admin";

// Add employer auth actions
import { action as loginAction } from "./pages/employer/Login";
import { action as registerAction } from "./pages/employer/Register";
// Add employer OTP confirm page
import ConfirmAccountEmployer from "./pages/employer/ConfirmAccount";

// Create a function that determines and applies the default theme.
// Prefers saved user preference (localStorage) and falls back to system preference.
export const checkDefaultTheme = () => {
  let isDarkTheme = false;
  try {
    const saved = localStorage.getItem("darkTheme");
    if (saved !== null) {
      isDarkTheme = saved === "true";
    } else if (typeof window !== "undefined" && window.matchMedia) {
      isDarkTheme = window
        .matchMedia("(prefers-color-scheme: dark)")
        .matches;
    }
  } catch {
    if (typeof window !== "undefined" && window.matchMedia) {
      isDarkTheme = window
        .matchMedia("(prefers-color-scheme: dark)")
        .matches;
    }
  }
  document.body.classList.toggle("dark-theme", isDarkTheme);
  return isDarkTheme;
};

//================================================================
//VARIABLES & functions
const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Error></Error>,
    element: <HomeLayout></HomeLayout>,
    children: [
      // they are relative to the parent path "/"
      {
        index: true,
        element: <Landing></Landing>,
      },
      {
        path: "jobs",
        element: <JobsJobSeeker />,
      },
      {
        path: "register",
        element: <Register />,
        action: registerAction,
      },
      {
        path: "login",
        element: <Login />,
        action: loginAction,
      },
      // Employer/admin OTP confirmation page
      {
        path: "confirm-account",
        element: <ConfirmAccountEmployer />,
      },
      {
        path: "landing",
        element: (
          <div>
            <Landing></Landing>
          </div>
        ),
      },
      {
        path: "employers",
        element: <Employers />,
      },
      {
        path: "salary-guide",
        element: <SalaryGuide />,
      },
      {
        path: "resume-tips",
        element: <ResumeTips />,
      },
      {
        path: "career-resources",
        element: <CareerResources />,
      },
    ],
  },

  // Dashboard routes for employers
  {
    path: "dashboard",
    element: (
      <>
        <DashboardLayout></DashboardLayout>
      </>
    ),
    loader: dashboardLoader,
    children: [
      { index: true, element: <AddJob />, action: addJobAction },
      {
        path: "stats",
        element: <Stats></Stats>,
      },
      {
        path: "all-jobs",
        element: <AllJobs />,
        loader: allJobsLoader,
      },
      {
        path: "add-job",
        element: <AddJob></AddJob>,
        action: addJobAction,
      },
      {
        path: "edit-job/:id",
        element: <EditJob></EditJob>,
        loader: editJobLoader,
        action: editJobAction,
      },
      {
        path: "delete-job/:id",
        element: <DeleteJob></DeleteJob>,
        action: deleteJobAction,
      },
      {
        path: "profile",
        element: <Profile></Profile>,
        action: updateProfileAction,
      },
      {
        path: "admin",
        element: <Admin></Admin>,
        loader: adminLoader,
      },
    ],
  },

  // Public job seeker auth routes
  {
    path: "job-seekers/login",
    element: <LoginJobSeeker />,
  },

  {
    path: "job-seekers/confirm-account",
    element: <ConfirmAccount />,
  },
  {
    path: "job-seekers/register",
    element: <RegisterJobSeeker />,
  },

  // Job Seekers routes (authenticated area)
  {
    // Job Seekers routes - PROTECTED STRUCTURE

    path: "job-seekers",
    element: (
      <ProtectedJobSeekerRoute>
        <JobSeekers />
      </ProtectedJobSeekerRoute>
    ),
    children: [
      // Default route - redirect to dashboard
      { index: true, element: <Dashboard /> },
      // Nested routes (relative to /job-seekers)
      { path: "dashboard", element: <Dashboard /> },
      { path: "jobs", element: <JobsJobSeeker /> },
      { path: "stats", element: <StatsJobSeeker /> },
      { path: "inbox", element: <InboxJobSeeker /> },
      { path: "profile", element: <ProfileJobSeeker /> },
    ],
  },

  // Public job seeker auth routes
  // {
  //   path: "job-seekers/login",
  //   element: <LoginJobSeeker />,
  // },
  // {
  //   path: "job-seekers/register",
  //   element: <RegisterJobSeeker />,
  // },

  // Keep the old routes for backward compatibility (optional)
  {
    path: "login-jobseeker",
    element: <LoginJobSeeker />,
  },
  {
    path: "register-jobseeker",
    element: <RegisterJobSeeker />,
  },

  // Catch all route
  {
    path: "*",
    element: <Error></Error>,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
