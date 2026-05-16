import { useLocation, useNavigate } from "react-router-dom";
import {
  Print,
  Email,
  Phone,
  LocationOn,
  Person,
  ArrowBack,
} from "@mui/icons-material";

// Category-based theme mapping for all specializations
const categoryThemes = {
  nurse: {
    color: "#0D9488",
    gradient: "linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)",
    sections: ["Clinical Rotations", "Certifications", "Patient Care"],
  },
  biologist: {
    color: "#16A34A",
    gradient: "linear-gradient(135deg, #16A34A 0%, #22C55E 100%)",
    sections: ["Research Publications", "Lab Techniques", "Field Work"],
  },
  pharmacist: {
    color: "#7C3AED",
    gradient: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)",
    sections: ["Dispensing Experience", "Drug Knowledge", "Regulatory"],
  },
  doctor: {
    color: "#0071E3",
    gradient: "linear-gradient(135deg, #0071E3 0%, #3B82F6 100%)",
    sections: ["Residency", "Board Certifications", "Clinical Practice"],
  },
  dentist: {
    color: "#D97706",
    gradient: "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)",
    sections: ["Clinical Procedures", "Certifications", "Patient Care"],
  },
};

const specToCategory = {
  Nurse: "nurse",
  Biologist: "biologist",
  Pathologist: "biologist",
  Pharmacist: "pharmacist",
  Dentist: "dentist",
};

function getTheme(specialization) {
  if (!specialization) return null;
  const cat = specToCategory[specialization] || "doctor";
  return categoryThemes[cat];
}

const defaultTheme = {
  color: "#6B7280",
  gradient: "linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)",
  sections: [],
};

const ApplicantGeneratedCV = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = location.state?.profile;

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-bold mb-4">Applicant Profile Not Found</h2>
        <button onClick={() => navigate(-1)} className="btn">
          Go Back
        </button>
      </div>
    );
  }

  const theme = getTheme(profile.specialization) || defaultTheme;

  return (
    <div className="p-6">
      {/* ── Navigation & Actions ── */}
      <div className="flex items-center justify-between mb-8 print:hidden max-w-[800px] mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[var(--text-secondary-color)] hover:text-[var(--text-color)] transition-colors"
        >
          <ArrowBack fontSize="small" />
          Back to Candidates
        </button>
        <button
          onClick={() => window.print()}
          className="btn flex items-center gap-2"
        >
          <Print style={{ fontSize: 18 }} />
          Print CV
        </button>
      </div>

      {/* ── CV Document ── */}
      <div
        id="cv-document"
        className="mx-auto bg-white text-gray-900 rounded-xl overflow-hidden"
        style={{
          maxWidth: "800px",
          boxShadow: "var(--shadow-3)",
          fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
        }}
      >
        {/* ── Header ── */}
        <div
          className="px-10 py-8 text-white"
          style={{ background: theme.gradient }}
        >
          <div className="flex items-center gap-6">
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt=""
                className="w-20 h-20 rounded-full object-cover border-4 border-white/30"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30">
                <Person style={{ fontSize: 36, color: "white" }} />
              </div>
            )}
            <div>
              <h1
                className="text-3xl font-bold mb-1"
                style={{ color: "white", letterSpacing: "-0.02em" }}
              >
                {profile.name} {profile.lastName}
              </h1>
              <p className="text-lg font-medium opacity-90">
                {profile.specialization || "Healthcare Professional"}
              </p>
            </div>
          </div>

          {/* Contact Row */}
          <div className="flex flex-wrap gap-6 mt-5 text-sm opacity-90">
            {profile.email && (
              <span className="flex items-center gap-1.5">
                <Email style={{ fontSize: 16 }} />
                {profile.email}
              </span>
            )}
            {profile.phoneNumber && (
              <span className="flex items-center gap-1.5">
                <Phone style={{ fontSize: 16 }} />
                {profile.phoneNumber}
              </span>
            )}
            {profile.location && (
              <span className="flex items-center gap-1.5">
                <LocationOn style={{ fontSize: 16 }} />
                {profile.location}
              </span>
            )}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="px-10 py-8">
          {/* Professional Summary */}
          {profile.bio && (
            <CVSection title="Professional Summary" color={theme.color}>
              <p className="text-sm leading-relaxed text-gray-700">
                {profile.bio}
              </p>
            </CVSection>
          )}

          {/* Experience */}
          {profile.experience && (
            <CVSection title="Experience" color={theme.color}>
              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                {profile.experience}
              </p>
            </CVSection>
          )}

          {/* Education */}
          {profile.education && (
            <CVSection title="Education" color={theme.color}>
              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                {profile.education}
              </p>
            </CVSection>
          )}

          {/* Skills */}
          {profile.skills?.length > 0 && (
            <CVSection title="Skills" color={theme.color}>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{ background: theme.color }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </CVSection>
          )}

          {/* Languages */}
          {profile.languages?.length > 0 && (
            <CVSection title="Languages" color={theme.color}>
              <div className="flex flex-wrap gap-2">
                {profile.languages.map((lang) => (
                  <span
                    key={lang}
                    className="px-3 py-1 rounded-full text-xs font-medium border"
                    style={{ borderColor: theme.color, color: theme.color }}
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </CVSection>
          )}

          {/* Specialization-Specific Sections */}
          {theme.sections.length > 0 && (
            <CVSection
              title={`${profile.specialization} Details`}
              color={theme.color}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {theme.sections.map((s) => (
                  <div
                    key={s}
                    className="p-3 rounded-lg text-center text-sm font-medium"
                    style={{
                      background: `${theme.color}10`,
                      color: theme.color,
                      border: `1px dashed ${theme.color}40`,
                    }}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </CVSection>
          )}
        </div>

        {/* ── Footer ── */}
        <div
          className="px-10 py-4 text-center text-xs"
          style={{ background: `${theme.color}08`, color: theme.color }}
        >
          Generated by VitalWork — {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Print-specific styles */}
      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            #cv-document, #cv-document * { visibility: visible; }
            #cv-document {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              max-width: 100% !important;
              box-shadow: none !important;
              border-radius: 0 !important;
            }
            .print\\:hidden { display: none !important; }
          }
        `}
      </style>
    </div>
  );
};

function CVSection({ title, color, children }) {
  return (
    <div className="mb-6">
      <h3
        className="text-sm font-bold uppercase tracking-wider mb-3 pb-2"
        style={{ color, borderBottom: `2px solid ${color}20` }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

export default ApplicantGeneratedCV;
