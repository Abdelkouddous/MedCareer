import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "For Job Seekers",
      links: [
        { to: "/jobs", label: "Browse Jobs" },
        { to: "/career-resources", label: "Career Resources" },
        { to: "/resume-tips", label: "Resume Tips" },
        { to: "/salary-guide", label: "Salary Guide" },
      ],
    },
    {
      title: "For Employers",
      links: [
        { to: "/employers#post-job", label: "Post a Job" },
        { to: "/employers#talent-search", label: "Search Talent" },
        { to: "/employers#recruitment-solutions", label: "Solutions" },
        { to: "/employers#pricing", label: "Pricing" },
      ],
    },
    {
      title: "Clinic",
      links: [
        { to: "/contact", label: "Contact" },
        { to: "/blogs", label: "Blog" },
        { to: "/privacy", label: "Privacy" },
        { to: "/terms", label: "Terms" },
      ],
    },
  ];

  return (
    <footer
      style={{
        background: "var(--background-secondary-color)",
        borderTop: "1px solid var(--border-color)",
      }}
    >
      {/* Main Footer */}
      <div className="max-w-[980px] mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 mb-4 md:mb-0">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
              <rect x="5" y="5" width="90" height="90" rx="20" fill="var(--primary-500)" fillOpacity="0.15"/>
              <path 
                d="M 18 28 L 40 74 L 54 36 L 58 48 L 64 22 L 68 52 L 73 42 L 82 46"
                stroke="var(--primary-500)" 
                strokeWidth="7" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
              <span
                className="text-lg font-bold tracking-tight"
                style={{ color: "var(--text-color)" }}
              >
                VitalWork
              </span>
              <span
                className="text-lg font-light tracking-tight"
                style={{ color: "var(--text-secondary-color)" }}
              >
                Connect
              </span>
            </Link>
            <p
              className="text-xs leading-relaxed max-w-[200px]"
              style={{
                color: "var(--text-secondary-color)",
                lineHeight: 1.6,
              }}
            >
              Connecting healthcare professionals with their dream careers
              since 2024.
            </p>
          </div>

          {/* Link Columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4
                className="text-xs font-semibold mb-4 uppercase tracking-wider"
                style={{ color: "var(--text-secondary-color)" }}
              >
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-xs transition-opacity duration-200 hover:opacity-70"
                      style={{ color: "var(--text-color)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="max-w-[980px] mx-auto px-6 py-4"
        style={{ borderTop: "1px solid var(--border-color)" }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <p
            className="text-xs"
            style={{ color: "var(--text-secondary-color)" }}
          >
            &copy; {currentYear} VitalWork Connect. All rights reserved.
          </p>
          <p
            className="text-xs"
            style={{ color: "var(--text-secondary-color)" }}
          >
            Designed & Developed by{" "}
            <a
              href="https://aymen-hml.vercel.app"
              className="transition-opacity duration-200 hover:opacity-70"
              style={{ color: "var(--primary-500)" }}
            >
              Aymene Abdelkouddous Hamel
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
