import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const getInitialTheme = () => {
    try {
      const saved = localStorage.getItem("darkTheme");
      if (saved !== null) return saved === "true";
    } catch {
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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleDarkTheme = () => {
    setIsDarkTheme((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("darkTheme", String(next));
      } catch (error) {
        console.warn("Failed to persist theme preference", error);
      }
      return next;
    });
  };

  useEffect(() => {
    document.body.classList.toggle("dark-theme", isDarkTheme);
  }, [isDarkTheme]);

  // Track scroll for glass effect intensity change
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/jobs", label: "Find Jobs" },
    { to: "/employers", label: "For Employers" },
    { to: "/blogs", label: "Blog" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "glass shadow-sm"
          : "bg-transparent"
      }`}
      style={{
        borderBottom: isScrolled
          ? "1px solid var(--glass-border)"
          : "1px solid transparent",
      }}
    >
      <nav className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 group">
            <span
              className="text-lg font-semibold tracking-tight"
              style={{ color: "var(--text-color)" }}
            >
              MedCareer
            </span>
            <span
              className="text-lg font-light tracking-tight"
              style={{ color: "var(--text-secondary-color)" }}
            >
              Connect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-xs font-normal tracking-wide transition-opacity duration-200 hover:opacity-70"
                style={{ color: "var(--text-color)" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA & Theme Toggle */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/job-seekers/login"
              className="text-xs font-normal tracking-wide transition-opacity duration-200 hover:opacity-70"
              style={{ color: "var(--text-color)" }}
            >
              Sign In
            </Link>
            <Link
              to="/job-seekers/register"
              className="text-xs font-medium px-4 py-1.5 rounded-full transition-all duration-300 hover:opacity-90"
              style={{
                backgroundColor: "var(--primary-500)",
                color: "#ffffff",
              }}
            >
              Get Started
            </Link>
            <button
              className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 hover:opacity-70"
              onClick={toggleDarkTheme}
              aria-label={
                isDarkTheme ? "Switch to light mode" : "Switch to dark mode"
              }
              title={isDarkTheme ? "Light mode" : "Dark mode"}
              style={{
                transform: isDarkTheme ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              {isDarkTheme ? (
                <FaSun className="w-3.5 h-3.5" style={{ color: "var(--text-color)" }} />
              ) : (
                <FaMoon className="w-3.5 h-3.5" style={{ color: "var(--text-color)" }} />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 hover:opacity-70"
              onClick={toggleDarkTheme}
              aria-label={
                isDarkTheme ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkTheme ? (
                <FaSun className="w-3.5 h-3.5" style={{ color: "var(--text-color)" }} />
              ) : (
                <FaMoon className="w-3.5 h-3.5" style={{ color: "var(--text-color)" }} />
              )}
            </button>
            <button
              onClick={toggleMenu}
              className="transition-opacity duration-200 hover:opacity-70"
              style={{ color: "var(--text-color)" }}
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? (
                <FaTimes className="h-5 w-5" />
              ) : (
                <FaBars className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu — Slide Down with Glass */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={toggleMenu}
                className="block py-2 text-sm font-normal transition-opacity duration-200 hover:opacity-70"
                style={{ color: "var(--text-color)" }}
              >
                {link.label}
              </Link>
            ))}
            <div
              className="pt-4 mt-3 space-y-3"
              style={{ borderTop: "1px solid var(--border-color)" }}
            >
              <Link
                to="/job-seekers/login"
                onClick={toggleMenu}
                className="block text-center text-sm font-normal py-2 transition-opacity duration-200 hover:opacity-70"
                style={{ color: "var(--primary-500)" }}
              >
                Sign In
              </Link>
              <Link
                to="/job-seekers/register"
                onClick={toggleMenu}
                className="block text-center text-sm font-medium py-2.5 rounded-lg transition-all duration-300 hover:opacity-90"
                style={{
                  backgroundColor: "var(--primary-500)",
                  color: "#ffffff",
                }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
