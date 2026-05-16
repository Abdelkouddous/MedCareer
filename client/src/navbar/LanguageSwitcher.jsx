import React from "react";
import i18n from "../i18n";

const LanguageSwitcher = () => {
  const currentLanguage = i18n.language || "en";

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng).then(() => {
      // Since we are using the prototype `.tr` mapping (which bypasses React context updates),
      // we need to strictly force a browser refresh when the user dynamically selects a new language 
      // so the entire DOM translations compile down natively with the new bundle.
      window.location.reload();
    });
  };

  return (
    <div className="relative group z-50">
      <button className="flex items-center gap-1 text-[var(--text-secondary-color)] hover:text-[var(--text-color)] text-sm font-semibold transition-all border border-[var(--border-color)] px-3 py-1.5 rounded-full bg-[var(--surface-secondary)]">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.026 18.026 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        {currentLanguage.toUpperCase().substring(0, 2)}
      </button>

      {/* Dropdown Menu */}
      <div className="absolute right-0 mt-2 w-32 bg-[var(--surface-primary)] border border-[var(--border-color)] rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <ul className="py-2 text-sm text-[var(--text-color)] font-medium">
          <li>
            <button
              onClick={() => changeLanguage("en")}
              className={`w-full text-left px-4 py-2 hover:bg-[var(--surface-secondary)] transition-colors ${currentLanguage.startsWith("en") ? "text-[var(--primary-600)]" : ""}`}
            >
              English
            </button>
          </li>
          <li>
            <button
              onClick={() => changeLanguage("fr")}
              className={`w-full text-left px-4 py-2 hover:bg-[var(--surface-secondary)] transition-colors ${currentLanguage.startsWith("fr") ? "text-[var(--primary-600)]" : ""}`}
            >
              Français
            </button>
          </li>
          <li>
            <button
              onClick={() => changeLanguage("ar")}
              className={`w-full text-left px-4 py-2 hover:bg-[var(--surface-secondary)] transition-colors ${currentLanguage.startsWith("ar") ? "text-[var(--primary-600)]" : ""}`}
            >
              العربية
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
