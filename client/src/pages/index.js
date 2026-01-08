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
export { default as Error } from "./Error";
export { default as Login } from "./employer/Login";
export { default as Profile } from "./employer/Profile";
export { default as Register } from "./employer/Register";
export { default as Admin } from "./Admin";
export { default as Stats } from "./Stats";
export { default as SalaryGuide } from "./SalaryGuide";
export { default as ResumeTips } from "./ResumeTips";
export { default as CareerResources } from "./CareerResources";
export { default as Employers } from "./employer/Employers";
export { default as MyJobs } from "./employer/MyJobs";
export { default as Candidates } from "./employer/Candidates";
export { default as Blogs } from "./Blogs";
export { default as BlogDetail } from "./BlogDetail";
export { default as AdminBlogs } from "./AdminBlogs";
export { default as Contact } from "./Contact";
export { default as Privacy } from "./Privacy";
export { default as Terms } from "./Terms";
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
export { default as RegisterJobSeeker } from "./job-seekers/RegisterJobSeeker";
export { default as LoginJobSeeker } from "./job-seekers/LoginJobSeeker";
export { default as JobsJobSeeker } from "./job-seekers/JobsJobSeeker";
export { default as StatsJobSeeker } from "./job-seekers/StatsJobSeeker";
export { default as InboxJobSeeker } from "./job-seekers/InboxJobSeeker";
export { default as JobSeekers } from "./job-seekers/JobSeekers";
export { default as ApplicationsJobSeeker } from "./job-seekers/ApplicationsJobSeeker";
