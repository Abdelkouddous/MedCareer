import { useState, useEffect } from "react";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import {
  Print,
  Email,
  Phone,
  LocationOn,
  Person,
  Edit,
  Save,
  Cancel,
  CloudUpload,
  Description,
  LocalHospital,
  School,
  Work,
  Translate,
  Psychology,
} from "@mui/icons-material";
import { MEDICAL_SPECIALIZATION } from "../../../../backend/utils/constants";
const SPECIALIZATIONS = Object.values(MEDICAL_SPECIALIZATION);

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

// Map every specialization to a category
const specToCategory = {
  Nurse: "nurse",
  Biologist: "biologist",
  Pathologist: "biologist",
  Pharmacist: "pharmacist",
  Dentist: "dentist",
};
// All others (GP, Cardiologist, Neurologist, etc.) default to "doctor"

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

function CVTemplate() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState("generated");
  const [editForm, setEditForm] = useState({});
  const [skillInput, setSkillInput] = useState("");
  const [langInput, setLangInput] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleEdit = () => {
    setEditing(true);
    setEditForm({ ...profile });
  };

  const handleCancel = () => {
    setEditing(false);
    setEditForm({ ...profile });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await customFetch.patch("/jobseekers/me", editForm);
      setProfile(response.data.jobSeeker);
      setEditing(false);
      toast.success("CV Details updated successfully!");
    } catch (error) {
      toast.error("Failed to update CV details");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("cv", file);
      const response = await customFetch.post("/cv/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updatedProfile = { ...profile, curriculumVitae: response.data.cv.cvUrl };
      setProfile(updatedProfile);
      setEditForm(updatedProfile);
      toast.success("PDF CV uploaded successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to upload PDF CV");
    } finally {
      setUploading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !(editForm.skills || []).includes(skillInput.trim())) {
      setEditForm({ ...editForm, skills: [...(editForm.skills || []), skillInput.trim()] });
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setEditForm({ ...editForm, skills: (editForm.skills || []).filter((s) => s !== skill) });
  };

  const addLang = () => {
    if (langInput.trim() && !(editForm.languages || []).includes(langInput.trim())) {
      setEditForm({ ...editForm, languages: [...(editForm.languages || []), langInput.trim()] });
      setLangInput("");
    }
  };

  const removeLang = (lang) => {
    setEditForm({ ...editForm, languages: (editForm.languages || []).filter((l) => l !== lang) });
  };

  const updateActiveCV = async (type) => {
    try {
      if (type === "uploaded" && !profile.curriculumVitae) {
        toast.error("You must upload a PDF in your Profile first.");
        return;
      }
      await customFetch.patch("/jobseekers/me", { activeCV: type });
      setProfile({ ...profile, activeCV: type });
      toast.success(`Active CV set to ${type} successfully`);
    } catch {
      toast.error("Failed to update active CV");
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await customFetch.get("/jobseekers/me");
        setProfile(data.jobSeeker);
        setEditForm(data.jobSeeker);
      } catch {
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="loading"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-16 text-[var(--text-secondary-color)]">
        Could not load profile. Please try again later.
      </div>
    );
  }

  const theme = getTheme(profile.specialization) || defaultTheme;

  return (
    <div>
      {/* ── CV Manager Dashboard ── */}
      <div className="bg-[var(--surface-primary)] p-6 rounded-xl shadow-sm border border-[var(--border-color)] mb-8 print:hidden">
        <h2 className="text-xl font-bold mb-4 text-[var(--text-color)]">CV Manager: Choose Your Active CV</h2>
        <p className="text-sm text-[var(--text-secondary-color)] mb-6">Select which format employers will see when you apply to jobs or they visit your profile.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={`border-2 rounded-xl p-5 cursor-pointer transition ${
              profile.activeCV === "generated"
                ? "border-[var(--primary-500)] bg-[var(--background-color)] shadow-sm"
                : "border-[var(--border-color)] hover:border-[var(--primary-300)]"
            }`}
            onClick={() => updateActiveCV("generated")}
          >
            <h3 className="font-bold flex items-center justify-between text-[var(--text-color)]">
              Generated Template
              {profile.activeCV === "generated" && <span className="bg-[var(--primary-500)] text-white text-xs px-2 py-1 rounded-full">Active</span>}
            </h3>
            <p className="text-sm text-[var(--text-secondary-color)] mt-2">ATS-friendly format built automatically from your profile data.</p>
          </div>

          <div
            className={`border-2 rounded-xl p-5 cursor-pointer transition ${
              profile.activeCV === "uploaded"
                ? "border-[var(--primary-500)] bg-[var(--background-color)] shadow-sm"
                : "border-[var(--border-color)] hover:border-[var(--primary-300)]"
            }`}
            onClick={() => updateActiveCV("uploaded")}
          >
            <h3 className="font-bold flex items-center justify-between text-[var(--text-color)]">
              Uploaded PDF
              {profile.activeCV === "uploaded" && <span className="bg-[var(--primary-500)] text-white text-xs px-2 py-1 rounded-full">Active</span>}
            </h3>
            <p className="text-sm text-[var(--text-secondary-color)] mt-2">
              Use the classic PDF file you uploaded in your Profile settings.
            </p>
            {profile.curriculumVitae ? (
              <div className="mt-3 flex items-center justify-between">
                <a href={profile.curriculumVitae} target="_blank" rel="noreferrer" className="text-sm font-semibold hover:underline" style={{ color: "var(--primary-600)" }} onClick={(e) => e.stopPropagation()}>View PDF</a>
                <label className="text-sm font-semibold cursor-pointer hover:underline text-[var(--text-secondary-color)]" onClick={(e) => e.stopPropagation()}>
                  Update PDF
                  <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => handleFileUpload(e.target.files[0])} disabled={uploading} />
                </label>
              </div>
            ) : (
              <label className="btn-hipster text-sm mt-3 px-3 py-1 cursor-pointer inline-block" onClick={(e) => e.stopPropagation()}>
                  <CloudUpload className="mr-1" style={{ fontSize: 16 }} /> Upload PDF
                  <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => handleFileUpload(e.target.files[0])} disabled={uploading} />
              </label>
            )}
          </div>
        </div>
      </div>

      {/* ── CV Builder Form ── */}
      <div className="bg-[var(--surface-primary)] p-6 rounded-xl shadow-sm border border-[var(--border-color)] mb-8 print:hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[var(--text-color)]">CV Builder</h2>
          {!editing ? (
            <button onClick={handleEdit} className="btn flex items-center gap-2">
              <Edit style={{ fontSize: 18 }} /> Edit CV Details
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button onClick={handleCancel} className="btn-hipster flex items-center gap-2" disabled={loading}>
                <Cancel style={{ fontSize: 18 }} /> Cancel
              </button>
              <button onClick={handleSave} className="btn flex items-center gap-2" disabled={loading}>
                <Save style={{ fontSize: 18 }} /> {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        <div className={editing ? "block" : "hidden"}>
          {/* Professional Details */}
          <Section title="Professional Details" icon={<LocalHospital />}>
            <div className="mb-4">
              <label className="form-label flex items-center gap-2 mb-1.5"><LocalHospital style={{ fontSize: 16 }} />Specialization</label>
              <select className="form-select" value={editForm.specialization || ""} onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })}>
                <option value="">Select specialization...</option>
                {SPECIALIZATIONS.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>
            <div className="mb-4">
              <label className="form-label flex items-center gap-2 mb-1.5"><Description style={{ fontSize: 16 }} />Professional Summary</label>
              <textarea className="form-textarea" value={editForm.bio || ""} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} placeholder="Brief professional summary..." maxLength={500} rows={3} />
            </div>
            <Field label="Experience" icon={<Work style={{ fontSize: 16 }} />} value={profile?.experience} editing={editing} editValue={editForm.experience || ""} onChange={(v) => setEditForm({ ...editForm, experience: v })} placeholder="e.g. 5 years in cardiology" />
            <Field label="Education" icon={<School style={{ fontSize: 16 }} />} value={profile?.education} editing={editing} editValue={editForm.education || ""} onChange={(v) => setEditForm({ ...editForm, education: v })} placeholder="e.g. MD, University of Algiers" />
          </Section>

          {/* Skills */}
          <Section title="Skills" icon={<Psychology />}>
            <div className="flex flex-wrap gap-2 mb-3">
              {(editForm.skills || []).map((skill) => (
                <span key={skill} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium" style={{ background: "var(--primary-500)", color: "white" }}>
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="ml-1 hover:opacity-70 text-white" style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 1 }}>×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" className="form-input flex-1" placeholder="Add a skill..." value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} />
              <button onClick={addSkill} className="btn" type="button">Add</button>
            </div>
          </Section>

          {/* Languages */}
          <Section title="Languages" icon={<Translate />}>
            <div className="flex flex-wrap gap-2 mb-3">
              {(editForm.languages || []).map((lang) => (
                <span key={lang} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-[var(--background-secondary-color)] text-[var(--text-color)] border border-[var(--border-color)]">
                  {lang}
                  <button onClick={() => removeLang(lang)} className="ml-1 hover:opacity-70" style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 1, color: "var(--text-secondary-color)" }}>×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" className="form-input flex-1" placeholder="Add a language..." value={langInput} onChange={(e) => setLangInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLang())} />
              <button onClick={addLang} className="btn" type="button">Add</button>
            </div>
          </Section>
        </div>
        {!editing && (
          <p className="text-sm text-[var(--text-secondary-color)]">
            Click "Edit CV Details" to modify your Specialization, Bio, Experience, Education, Skills, and Languages.
          </p>
        )}
      </div>

      {/* ── Preview Mode Toggle ── */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-color)] mb-2">Live Preview</h1>
          <div className="flex bg-[var(--surface-secondary)] p-1 rounded-lg border border-[var(--border-color)] w-max">
            <button
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
                previewMode === "generated"
                  ? "bg-white text-[var(--primary-600)] shadow-sm"
                  : "text-[var(--text-secondary-color)] hover:text-[var(--text-color)]"
              }`}
              onClick={() => setPreviewMode("generated")}
            >
              Generated Template
            </button>
            <button
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
                previewMode === "uploaded"
                  ? "bg-white text-[var(--primary-600)] shadow-sm"
                  : "text-[var(--text-secondary-color)] hover:text-[var(--text-color)]"
              }`}
              onClick={() => setPreviewMode("uploaded")}
            >
              Uploaded PDF
            </button>
          </div>
        </div>
        {previewMode === "generated" && (
          <button onClick={() => window.print()} className="btn flex items-center gap-2 h-10">
            <Print style={{ fontSize: 18 }} /> Print / Save Template
          </button>
        )}
      </div>

      {/* ── CV Document ── */}
      {previewMode === "uploaded" ? (
        <div className="bg-white rounded-xl shadow-lg border border-[var(--border-color)] overflow-hidden print:hidden" style={{ minHeight: "800px", width: "100%", maxWidth: "800px", margin: "0 auto" }}>
          {profile.curriculumVitae ? (
            <iframe 
              src={profile.curriculumVitae} 
              width="100%" 
              height="800px" 
              title="PDF CV Viewer"
              className="border-none bg-gray-50"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-12 h-[800px] bg-gray-50 text-[var(--text-secondary-color)]">
              <Description style={{ fontSize: 64, opacity: 0.2, marginBottom: "1rem" }} />
              <p className="text-lg font-semibold text-[var(--text-color)]">No PDF CV Uploaded</p>
              <p className="text-sm mt-2">Please upload a PDF in the CV Manager above to view it here.</p>
            </div>
          )}
        </div>
      ) : (
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
            {/* Avatar */}
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
              <h1 className="text-3xl font-bold mb-1" style={{ color: "white", letterSpacing: "-0.02em" }}>
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
                    <p className="text-xs mt-1 opacity-60 font-normal">
                      Add in profile
                    </p>
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
      )}

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
}

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

// ── Reusable Section Component ──
function Section({ title, icon, children }) {
  return (
    <div
      className="rounded-2xl p-6 mb-5"
      style={{
        background: "var(--surface-primary)",
        border: "1px solid var(--border-color)",
        boxShadow: "var(--shadow-1)",
      }}
    >
      <h3 className="text-lg font-semibold text-[var(--text-color)] flex items-center gap-2 mb-5">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

// ── Reusable Field Component ──
function Field({ label, icon, value, editing, editValue, onChange, placeholder }) {
  return (
    <div className="mb-4">
      <label className="form-label flex items-center gap-2 mb-1.5">
        {icon}
        {label}
      </label>
      {editing ? (
        <textarea
          className="form-textarea"
          value={editValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
        />
      ) : (
        <p className="p-3 rounded-lg bg-[var(--background-secondary-color)] border border-[var(--border-color)] text-[var(--text-color)] whitespace-pre-wrap">
          {value || "Not provided"}
        </p>
      )}
    </div>
  );
}

export default CVTemplate;
