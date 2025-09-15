// app.jsx

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  HomeLayout,
  Landing,
  Register,
  Login,
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
} from "./pages";

// for job seekers

// imported actions necessary
import { action as registerAction } from "./pages/Register";
import { action as loginAction } from "./pages/Login";
// for job operations
import { action as addJobAction } from "./pages/jobs-operations/AddJob";
import { action as editJobAction } from "./pages/jobs-operations/EditJob";
import { action as deleteJobAction } from "./pages/jobs-operations/DeleteJob";
// for user operations
import { action as updateProfileAction } from "./pages/Profile";
// import { action as deleteProfileAction } from "./pages/Profile";
// imported loaders necessary
import { loader as dashboardLoader } from "./pages/DashboardLayout";
// for job operations==
import { loader as allJobsLoader } from "./pages/jobs-operations/AllJobs";
import { loader as editJobLoader } from "./pages/jobs-operations/EditJob";

// imported loaders for admin page
import { loader as adminLoader } from "./pages/Admin";

//create a function that that adds the dark model
export const checkDefaultTheme = () => {
  const isDarkTheme = localStorage.getItem("darkTheme") === "true";
  document.body.classList.toggle("dark-theme", isDarkTheme);
  return isDarkTheme;
};

// const isDarkThemeEnabled = checkDefaultTheme();
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
        path: "job-seekers",
        element: <JobSeekers />,
      },
      {
        path: "register",
        element: <Register></Register>,
        action: registerAction,
      },
      //add more routes as needed
      {
        path: "login",
        element: (
          <div>
            <Login></Login>
          </div>
        ),
        action: loginAction,
      },
      {
        path: "landing",
        element: (
          <div>
            <Landing></Landing>
          </div>
        ),
      },
      // {
      //   path: "error",
      //   element: <Error></Error>,
      // },
    ],
  },

  //add more routes as needed
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
        index: true,
        path: "stats",
        element: <Stats></Stats>,
      },
      {
        //do not use /all-jobs  because it is not working properly
        index: true,
        path: "all-jobs",
        element: <AllJobs />,
        loader: allJobsLoader,
      },

      {
        index: true,
        element: <AddJob></AddJob>,
      },
      {
        index: true,
        path: "edit-job/:id",
        element: <EditJob></EditJob>,
        loader: editJobLoader,
        action: editJobAction,
      },
      {
        index: true,
        path: "delete-job/:id",
        element: <DeleteJob></DeleteJob>,
        action: deleteJobAction,
      },
      {
        index: true,
        path: "profile",
        element: <Profile></Profile>,
        // edit profile
        action: updateProfileAction,
        // deleteProfileAction,
        // delete profile
      },

      {},
      {
        path: "admin",
        element: <Admin></Admin>,
        loader: adminLoader,
      },
    ],
  },

  {
    path: "*",
    element: <Error></Error>,
  },
]);
//================================================================
//starting point of the react project
const App = () => {
  return <RouterProvider router={router}></RouterProvider>;
};

export default App;
