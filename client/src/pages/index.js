/**
 * Main export file that centralizes all component imports/exports
 * Contains exports for:
 * - Layout components (Dashboard, Home)
 * - Authentication pages (Login, Register)
 * - Core pages (Landing, Error, Profile, Admin, Stats)
 * - Job operation pages (Add, View, Delete, Edit jobs)
 * - UI components (Footer, Navbar, FormRow)
 * - Navigation components (Sidebars, Logout)
 * - Admin-specific components (AdminCard, RecentActivity)
 */

export { default as DashboardLayout } from "./DashboardLayout";
export { default as Landing } from "./Landing";
export { default as HomeLayout } from "./HomeLayout";
export { default as Login } from "./Login";
export { default as Error } from "./Error";
export { default as Profile } from "./Profile";
export { default as Register } from "./Register";
export { default as Admin } from "./Admin";
export { default as Stats } from "./Stats";
// job operations
export { default as AddJob } from "./jobs-operations/AddJob";
export { default as AllJobs } from "./jobs-operations/AllJobs";
export { default as DeleteJob } from "./jobs-operations/DeleteJob";
export { default as EditJob } from "./jobs-operations/EditJob";
//header and footer
export { default as Footer } from "../footer/Footer";
export { default as Navbar } from "../navbar/Navbar";
//sidebars
export { default as SmallSideBar } from "../pages/components/SmallSideBar";
export { default as BigSideBar } from "../pages/components/BigSideBar";
export { default as FormRow } from "../pages/components/FormRow";
export { default as LogoutContainer } from "../pages/components/LogoutContainer";
//
export { default as AdminCard } from "../pages/components/Admin/AdminCard";
export { default as RecentActivityItem } from "../pages/components/Admin/RecentActivity";
// job seekers
export { default as JobSeekers } from "./job-seekers/JobSeekers";
