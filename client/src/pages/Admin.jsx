// export default Admin;

// Description: This file contains the Admin component which serves as the dashboard for administrators. It displays various statistics, recent activities, and quick action buttons.

import { useLoaderData, redirect } from "react-router-dom";
import {
  Users,
  Briefcase,
  Calendar,
  Heart,
  TrendingUp,
  Award,
  BriefcaseBusiness,
} from "lucide-react";
import { Link } from "react-router-dom";
import customFetch from "../utils/customFetch";
import AdminCard from "./components/Admin/AdminCard";
import RecentActivityItem from "./components/Admin/RecentActivity";
import { toast } from "react-toastify";
import Wrapper from "../assets/wrappers/Dashboard";

export const loader = async () => {
  try {
    const response = await customFetch.get(`/users/admin/app-stats`);
    return response.data;
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    toast.error("You are not authorized...");
    return redirect("/dashboard");
  }
};

const Admin = () => {
  const { totalUsers, totalJobs, appliedJobs, pendingJobs } = useLoaderData();

  console.log(totalJobs, appliedJobs, pendingJobs, totalUsers);

  return (
    <Wrapper className="min-h-screen  p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold ">Medical Recruitment Dashboard</h1>
        <p className="">{`Welcome back Admin`}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AdminCard
          icon={Users}
          title="Total Medical Recruiters"
          value={`${totalUsers}`}
          description="Active healthcare workers"
          trend={{ isPositive: true, value: "+12%", text: "vs last month" }}
          bgColor={"bg-primary-200"}
          color={"bg-primary-500"}
        />

        <AdminCard
          icon={BriefcaseBusiness}
          title="Total Medical Jobs"
          value={`${totalJobs}`}
          description="Total medical jobs"
          trend={{ isPositive: true, value: "+12%", text: "vs last month" }}
          bgColor={"bg-primary-200"}
          color={"bg-primary-500"}
        />
        <AdminCard
          icon={Briefcase}
          title="Pending Applications"
          value={`${totalJobs}`}
          description="Current month applications"
          trend={{ isPositive: true, value: "+23%", text: "vs last month" }}
          color={"bg-primary-500"}
        />
        <AdminCard
          icon={Heart}
          title="Applied Jobs"
          value={`${appliedJobs}`}
          description="Healthcare professionals placed"
          trend={{ isPositive: true, value: "+8%", text: "vs last month" }}
          color={"bg-primary-500"}
        />
        <AdminCard
          icon={Calendar}
          title="Interview Schedule"
          value={`${0}`}
          description="Upcoming interviews"
          color={"bg-primary-500"}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-lg shadow-sm p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <button className="text-sm text-primary-500 hover:text-primary-600">
              View All
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            <RecentActivityItem
              title="New medical professional registered"
              time="2 minutes ago"
              status="completed"
              type="user"
            />
            <RecentActivityItem
              title="Application submitted for Cardiology position"
              time="1 hour ago"
              status="pending"
              type="order"
            />
            <RecentActivityItem
              title="Interview scheduled for Neurology specialist"
              time="3 hours ago"
              status="failed"
              type="payment"
            />
            <RecentActivityItem
              title="Placement confirmed for ICU nurse"
              time="5 hours ago"
              status="completed"
              type="product"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <Link to="/admin/medical-professionals" className="block">
              <button className="w-full btn text-left flex items-center space-x-3">
                <div className="flex flex-1 space-x-1 justify-center align-middle">
                  <Users className="h-5 w-5" />
                  <span>Manage Professionals</span>
                </div>
              </button>
            </Link>
            <Link to="/admin/applications" className="block">
              <button className="w-full btn text-left flex items-center space-x-3">
                <div className="flex flex-1 space-x-1 justify-center align-middle">
                  <Briefcase className="h-5 w-5" />
                  <span>View Applications</span>
                </div>
              </button>
            </Link>
            <Link to="/admin/analytics" className="block">
              <button className="w-full btn text-left flex items-center space-x-3">
                <div className="flex flex-1 space-x-1 justify-center align-middle">
                  <TrendingUp className="h-5 w-5" />
                  <span>Analytics</span>
                </div>
              </button>
            </Link>
            <Link to="/admin/hospitals" className="block">
              <button className="w-full btn text-left flex items-center space-x-3">
                <div className="flex flex-1 space-x-1 justify-center align-middle">
                  <Award className="h-5 w-5" />
                  <span>Manage Hospitals</span>
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Admin;
