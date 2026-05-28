import React, { useState } from "react";
import { useAdminContext } from "../AdminLayout";
import { FaAlignLeft, FaSun, FaMoon, FaUserCircle, FaCaretDown } from "react-icons/fa";
import { ShieldCheck } from "lucide-react";

export const AdminNavbar = () => {
  const {
    user,
    toggleSidebar,
    isDarkTheme,
    toggleDarkTheme,
    logoutUser,
  } = useAdminContext();

  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b transition-colors duration-300"
         style={{
           height: "var(--nav-height)",
           background: "var(--background-secondary-color)",
           borderColor: "var(--border-color)"
         }}>
      <div className="flex items-center gap-4">
        {/* Toggle Sidebar Button */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="bg-transparent border-transparent cursor-pointer flex items-center p-1"
          style={{ color: "var(--primary-500)", outline: "none" }}
        >
          <FaAlignLeft className="h-5 w-5" />
        </button>

        {/* Title & Badge */}
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold tracking-tight hidden sm:flex items-center gap-2"
              style={{ color: "var(--text-color)" }}>
            VitalWork CEO Hub
          </h2>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e6faf7] text-[#00a892] dark:bg-emerald-950/30 dark:text-emerald-400 border border-[#00C2A8]/20">
            <ShieldCheck className="h-3 w-3" />
            Admin Mode
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleDarkTheme}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors border-transparent cursor-pointer bg-transparent"
          style={{ color: "var(--text-color)", outline: "none" }}
          aria-label={isDarkTheme ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkTheme ? <FaSun className="h-4.5 w-4.5" /> : <FaMoon className="h-4.5 w-4.5" />}
        </button>

        {/* User Profile / Dropdown */}
        <div className="relative">
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all"
            style={{
              background: "var(--background-color)",
              color: "var(--text-color)",
              borderColor: "var(--border-color)",
              outline: "none"
            }}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                className="w-5 h-5 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle className="w-5 h-5" style={{ color: "var(--text-secondary-color)" }} />
            )}
            <span>{user?.name || "CEO"}</span>
            <FaCaretDown style={{ color: "var(--text-secondary-color)" }} />
          </button>

          {showDropdown && (
            <div
              className="absolute right-0 mt-2 w-40 rounded-lg shadow-lg border py-1 z-55"
              style={{
                background: "var(--background-color)",
                borderColor: "var(--border-color)",
              }}
            >
              <button
                type="button"
                className="w-full text-left px-4 py-2 text-xs font-medium cursor-pointer transition-colors bg-transparent border-transparent hover:bg-transparent"
                style={{
                  color: "var(--text-color)",
                  outline: "none"
                }}
                onClick={() => {
                  setShowDropdown(false);
                  logoutUser();
                }}
              >
                Logout Session
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
