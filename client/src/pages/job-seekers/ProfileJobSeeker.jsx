import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ALGERIAN_WILAYAS } from "../../utils/algeriaWilayas";
import {
  Person,
  Email,
  Phone,
  LocationOn,
  CloudUpload,
  Edit,
  Save,
  Cancel,
} from "@mui/icons-material";
import customFetch from "../../utils/customFetch";

const ProfileJobSeeker = () => {
  const [profile, setProfile] = useState({
    name: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    location: "",
    profilePicture: "",
    curriculumVitae: "",
    specialization: "",
    bio: "",
    experience: "",
    education: "",
    skills: [],
    languages: [],
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [uploading, setUploading] = useState(false); // Kept for Profile Picture
  const [imageError, setImageError] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await customFetch.get("/jobseekers/me");
      setProfile(response.data.jobSeeker);
      setEditForm(response.data.jobSeeker);
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

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
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file, type) => {
    try {
      setUploading(true);
      const formData = new FormData();

      let urlEndpoint = `/jobseekers/upload-${type}`;
      let fieldName = type;

      if (type === "curriculumVitae") {
        urlEndpoint = "/cv/upload";
        fieldName = "cv";
      }

      formData.append(fieldName, file);

      const response = await customFetch.post(
        urlEndpoint,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const updatedProfile = { ...profile };
      if (type === "curriculumVitae") {
        updatedProfile[type] = response.data.cv.cvUrl;
      } else {
        updatedProfile[type] = response.data.fileUrl;
      }

      setProfile(updatedProfile);
      setEditForm(updatedProfile);
      toast.success(
        `${type === "curriculumVitae" ? "CV" : "Profile picture"} uploaded!`
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message || `Failed to upload`
      );
    } finally {
      setUploading(false);
    }
  };


  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="loading"></div>
      </div>
    );
  }

  const getSpecColor = (spec) => {
    if (!spec) return "var(--primary-500)";
    const map = {
      Nurse: "#0D9488",
      Biologist: "#16A34A",
      Pathologist: "#16A34A",
      Pharmacist: "#7C3AED",
      Dentist: "#D97706",
    };
    return map[spec] || "#0071E3"; // All medical doctor specializations → blue
  };

  const specColor = getSpecColor(profile.specialization);

  return (
    <div className="max-w-2xl mx-auto py-4">
      {/* ── Header Card ── */}
      <div
        className="rounded-2xl p-8 mb-6 text-center"
        style={{
          background: "var(--surface-primary)",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-2)",
        }}
      >
        {/* Avatar */}
        <div className="relative inline-block mb-4">
          {profile?.profilePicture && !imageError ? (
            <img
              src={profile.profilePicture}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover"
              style={{ border: `4px solid ${specColor}` }}
              onError={() => setImageError(true)}
              onLoad={() => setImageError(false)}
            />
          ) : (
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center"
              style={{
                background: `${specColor}20`,
                border: `4px solid ${specColor}`,
              }}
            >
              <Person style={{ fontSize: 48, color: specColor }} />
            </div>
          )}
          <label
            className="absolute bottom-1 right-1 p-2 rounded-full cursor-pointer text-white transition-transform hover:scale-110"
            style={{ background: specColor }}
          >
            <CloudUpload style={{ fontSize: 16 }} />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileUpload(e.target.files[0], "profilePicture");
              }}
              disabled={uploading}
            />
          </label>
        </div>

        <h2 className="text-2xl font-bold text-[var(--text-color)] mb-1">
          {profile?.name || "Unknown"} {profile?.lastName || "User"}
        </h2>
        <p className="text-sm text-[var(--text-secondary-color)] mb-3">
          {profile?.email}
        </p>

        {profile?.specialization && (
          <span
            className="inline-block px-4 py-1.5 rounded-full text-white text-sm font-medium"
            style={{ background: specColor }}
          >
            {profile.specialization}
          </span>
        )}

        {!editing && (
          <div className="mt-5">
            <button onClick={handleEdit} className="btn-hipster flex items-center gap-2 mx-auto">
              <Edit style={{ fontSize: 18 }} />
              Edit Profile
            </button>
          </div>
        )}
      </div>

      {/* ── Edit Controls ── */}
      {editing && (
        <div className="flex gap-3 mb-6 justify-end">
          <button onClick={handleSave} className="btn flex items-center gap-2" disabled={loading}>
            <Save style={{ fontSize: 18 }} />
            Save Changes
          </button>
          <button onClick={handleCancel} className="btn-hipster flex items-center gap-2">
            <Cancel style={{ fontSize: 18 }} />
            Cancel
          </button>
        </div>
      )}

      {/* ── Personal Information ── */}
      <Section title="Personal Information" icon={<Person />}>
        <Field
          label="First Name"
          icon={<Person style={{ fontSize: 16 }} />}
          value={profile?.name}
          editing={editing}
          editValue={editForm.name || ""}
          onChange={(v) => setEditForm({ ...editForm, name: v })}
        />
        <Field
          label="Last Name"
          icon={<Person style={{ fontSize: 16 }} />}
          value={profile?.lastName}
          editing={editing}
          editValue={editForm.lastName || ""}
          onChange={(v) => setEditForm({ ...editForm, lastName: v })}
        />
        <Field
          label="Email Address"
          icon={<Email style={{ fontSize: 16 }} />}
          value={`${profile?.email} (Cannot be changed)`}
          editing={false}
          readOnly
        />
        <Field
          label="Phone Number"
          icon={<Phone style={{ fontSize: 16 }} />}
          value={profile?.phoneNumber}
          editing={editing}
          editValue={editForm.phoneNumber || ""}
          onChange={(v) => setEditForm({ ...editForm, phoneNumber: v })}
          type="tel"
        />
        <div className="mb-4">
          <label className="form-label flex items-center gap-2 mb-1.5">
            <LocationOn style={{ fontSize: 16 }} />
            Location
          </label>
          {editing ? (
            <select
              className="form-select"
              value={editForm.location || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, location: e.target.value })
              }
            >
              <option value="">Select your Wilaya...</option>
              {ALGERIAN_WILAYAS.map((wilaya) => (
                <option key={wilaya} value={wilaya}>
                  {wilaya}
                </option>
              ))}
            </select>
          ) : (
            <p className="p-3 rounded-lg bg-[var(--background-secondary-color)] border border-[var(--border-color)] text-[var(--text-color)]">
              {profile?.location || "Not provided"}
            </p>
          )}
        </div>
      </Section>



      {/* ── Account Info ── */}
      <Section title="Account Information" icon={<Person />}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label">Member Since</label>
            <p className="p-3 rounded-lg bg-[var(--background-secondary-color)] border border-[var(--border-color)] text-[var(--text-color)]">
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString()
                : "Unknown"}
            </p>
          </div>
          <div>
            <label className="form-label">Last Updated</label>
            <p className="p-3 rounded-lg bg-[var(--background-secondary-color)] border border-[var(--border-color)] text-[var(--text-color)]">
              {profile?.updatedAt
                ? new Date(profile.updatedAt).toLocaleDateString()
                : "Unknown"}
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
};

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
function Field({
  label,
  icon,
  value,
  editing,
  editValue,
  onChange,
  type = "text",
  placeholder = "",
  readOnly = false,
}) {
  return (
    <div className="mb-4">
      <label className="form-label flex items-center gap-2 mb-1.5">
        {icon}
        {label}
      </label>
      {editing && !readOnly ? (
        <input
          type={type}
          className="form-input"
          value={editValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <p className="p-3 rounded-lg bg-[var(--background-secondary-color)] border border-[var(--border-color)] text-[var(--text-color)]">
          {value || "Not provided"}
        </p>
      )}
    </div>
  );
}

export default ProfileJobSeeker;
