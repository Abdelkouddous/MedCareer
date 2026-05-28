import React from "react";
import BigSidebarWrapper from "../../assets/wrappers/BigSidebar";
import SmallSidebarWrapper from "../../assets/wrappers/SmallSidebar";
import { useAdminContext } from "../AdminLayout";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import {
  Activity,
  DollarSign,
  Users,
  UserCheck,
  TrendingUp,
  ExternalLink,
} from "lucide-react";

const adminTabs = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "financials", label: "Financial Engine", icon: DollarSign },
  { id: "recruiters", label: "Recruiters", icon: Users },
  { id: "seekers", label: "Professionals", icon: UserCheck },
  { id: "insights", label: "Health & Insights", icon: TrendingUp },
];

export const AdminBigSidebar = () => {
  const { showSidebar, activeTab, setActiveTab } = useAdminContext();

  return (
    <BigSidebarWrapper>
      <div
        className={
          showSidebar
            ? "sidebar-container"
            : "sidebar-container show-sidebar"
        }
      >
        <div className="content">
          <header>
            <Logo />
          </header>
          <div className="nav-links">
            {adminTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`nav-link bg-transparent border-transparent text-left w-full flex items-center cursor-pointer ${
                    isActive ? "active" : ""
                  }`}
                  style={{ outline: "none", border: "none" }}
                >
                  <span className="icon">
                    <Icon className="h-5 w-5" />
                  </span>
                  {tab.label}
                </button>
              );
            })}
            <Link to="/dashboard" className="nav-link">
              <span className="icon">
                <ExternalLink className="h-5 w-5" />
              </span>
              Recruiter Portal
            </Link>
          </div>
        </div>
      </div>
    </BigSidebarWrapper>
  );
};

export const AdminSmallSidebar = () => {
  const { showSidebar, toggleSidebar, activeTab, setActiveTab } = useAdminContext();

  return (
    <SmallSidebarWrapper>
      <div
        className={
          showSidebar
            ? "sidebar-container show-sidebar"
            : "sidebar-container"
        }
      >
        <div className="content">
          <button type="button" className="close-btn" onClick={toggleSidebar}>
            <FaTimes />
          </button>
          <header>
            <Logo />
          </header>
          <div className="nav-links">
            {adminTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    toggleSidebar();
                  }}
                  className={`nav-link bg-transparent border-transparent text-left w-full flex items-center cursor-pointer ${
                    isActive ? "active" : ""
                  }`}
                  style={{ outline: "none", border: "none" }}
                >
                  <span className="icon">
                    <Icon className="h-5 w-5" />
                  </span>
                  {tab.label}
                </button>
              );
            })}
            <Link to="/dashboard" className="nav-link">
              <span className="icon">
                <ExternalLink className="h-5 w-5" />
              </span>
              Recruiter Portal
            </Link>
          </div>
        </div>
      </div>
    </SmallSidebarWrapper>
  );
};
