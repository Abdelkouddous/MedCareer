import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa"; // Make sure to install react-icons

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const getInitialTheme = () => {
    try {
      const saved = localStorage.getItem("darkTheme");
      if (saved !== null) return saved === "true";
    } catch (error) {
      // localStorage might be unavailable (e.g., privacy mode or SSR). Fallback to system preference.
      if (typeof window !== "undefined" && window.matchMedia) {
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
    }
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  };
  const [isDarkTheme, setIsDarkTheme] = useState(getInitialTheme());

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDarkTheme = () => {
    setIsDarkTheme((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("darkTheme", String(next));
      } catch (error) {
        // If persisting preference fails, continue without saving and optionally warn.
        // eslint-disable-next-line no-console
        console.warn("Failed to persist theme preference", error);
      }
      return next;
    });
  };

  useEffect(() => {
    document.body.classList.toggle("dark-theme", isDarkTheme);
  }, [isDarkTheme]);

  return (
    <header className="bg-[var(--background-secondary-color)] shadow-lg sticky w-full top-0 z-50">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between relative">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-[var(--primary-500)] text-2xl font-bold">
              MedCareer
            </span>
            <span className="text-[var(--text-color)] text-xl">Connect</span>
          </Link>

          {/* Main Navigation - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-[var(--text-color)] hover:text-[var(--primary-500)] transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/jobs"
              className="text-[var(--text-color)] hover:text-[var(--primary-500)] transition-colors duration-200"
            >
              Find Jobs
            </Link>
            <Link
              to="/employers"
              className="text-[var(--text-color)] hover:text-[var(--primary-500)] transition-colors duration-200"
            >
              For Employers
            </Link>
          </div>

          {/* CTA Buttons & Theme Toggle - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/job-seekers/login"
              className="text-[var(--primary-500)] hover:text-[var(--primary-700)] transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              to="/job-seekers/register"
              className="bg-[var(--primary-500)] text-[var(--white)] px-6 py-2 rounded-md font-semibold hover:bg-[var(--primary-700)] transition-all duration-200"
            >
              Sign Up
            </Link>
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              onClick={toggleDarkTheme}
              aria-label={
                isDarkTheme ? "Switch to light mode" : "Switch to dark mode"
              }
              title={isDarkTheme ? "Light mode" : "Dark mode"}
            >
              {isDarkTheme ? (
                <FaSun className="text-[var(--text-color)]" />
              ) : (
                <FaMoon className="text-[var(--text-color)]" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-[var(--text-color)] hover:text-[var(--primary-500)] transition-colors duration-200"
          >
            {isMenuOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:hidden absolute left-0 right-0 top-full bg-[var(--background-secondary-color)] shadow-lg`}
        >
          <div className="flex flex-col p-4 space-y-4">
            <Link
              to="/"
              onClick={toggleMenu}
              className="text-[var(--text-color)] hover:text-[var(--primary-500)] transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/jobs"
              onClick={toggleMenu}
              className="text-[var(--text-color)] hover:text-[var(--primary-500)] transition-colors duration-200"
            >
              Find Jobs
            </Link>
            <Link
              to="/employers"
              onClick={toggleMenu}
              className="text-[var(--text-color)] hover:text-[var(--primary-500)] transition-colors duration-200"
            >
              For Employers
            </Link>

            <Link
              to="/contact"
              onClick={toggleMenu}
              className="text-[var(--text-color)] hover:text-[var(--primary-500)] transition-colors duration-200"
            >
              Contact
            </Link>
            {/* Theme Toggle - Mobile */}
            <div className="flex items-center justify-between">
              <button
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                onClick={toggleDarkTheme}
                aria-label={
                  isDarkTheme ? "Switch to light mode" : "Switch to dark mode"
                }
                title={isDarkTheme ? "Light mode" : "Dark mode"}
              >
                {isDarkTheme ? (
                  <FaSun className="text-[var(--text-color)]" />
                ) : (
                  <FaMoon className="text-[var(--text-color)]" />
                )}
              </button>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <Link
                to="/login"
                onClick={toggleMenu}
                className="block w-full text-center text-[var(--primary-500)] hover:text-[var(--primary-700)] transition-colors duration-200 mb-3"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={toggleMenu}
                className="block w-full text-center bg-[var(--primary-500)] text-[var(--white)] px-6 py-2 rounded-md font-semibold hover:bg-[var(--primary-700)] transition-all duration-200"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
