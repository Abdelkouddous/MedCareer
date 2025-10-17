import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Person,
  Email,
  Phone,
  LocationOn,
  CloudUpload,
  Edit,
  Save,
  Cancel,
  Description,
} from "@mui/icons-material";
import customFetch from "../../utils/customFetch";
import { PageWrapper } from "../../assets/wrappers/AllJobsWrapper";

const ProfileJobSeeker = () => {
  const [profile, setProfile] = useState({
    name: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    location: "",
    profilePicture: "",
    curriculumVitae: "",
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // Rely on cookie-based auth; no localStorage token
      const response = await customFetch.get("/jobseekers/me");
      setProfile(response.data.jobSeeker);
      setEditForm(response.data.jobSeeker);
    } catch (error) {
      toast.error("Failed to load profile");
      console.error("Profile fetch error:", error);
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
      const response = await customFetch.patch(
        "/jobseekers/profile",
        editForm
      );
      setProfile(response.data.jobSeeker);
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Profile update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file, type) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append(type, file);

      const response = await customFetch.post(
        `/jobseekers/upload-${type}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedProfile = { ...profile };
      updatedProfile[type] = response.data.fileUrl;
      setProfile(updatedProfile);
      setEditForm(updatedProfile);

      toast.success(
        `${
          type === "curriculumVitae" ? "CV" : "Profile picture"
        } uploaded successfully!`
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          `Failed to upload ${
            type === "curriculumVitae" ? "CV" : "profile picture"
          }`
      );
    } finally {
      setUploading(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
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

  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--text-color)] mb-2">
          My Profile
        </h1>
        <p className="text-[var(--text-secondary-color)]">
          Manage your personal information and documents
        </p>
      </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Picture & Basic Info */}
          <div className="lg:col-span-1">
            <div
              className="bg-[var(--background-secondary-color)] p-6 rounded-lg border border-[var(--grey-200)]"
              style={{ boxShadow: "var(--shadow-1)" }}
            >
              <div className="text-center mb-6">
                <div className="relative inline-block mb-4">
                  {profile?.profilePicture && !imageError ? (
                    <img
                      src={profile?.profilePicture}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-[var(--primary-200)]"
                      onError={handleImageError}
                      onLoad={handleImageLoad}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-[var(--primary-100)] flex items-center justify-center border-4 border-[var(--primary-200)]">
                      <Person className="text-4xl text-[var(--primary-500)]" />
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 bg-[var(--primary-500)] text-white p-2 rounded-full cursor-pointer hover:bg-[var(--primary-600)] transition-colors">
                    <CloudUpload className="text-sm" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file, "profilePicture");
                        }
                      }}
                      disabled={uploading}
                    />
                  </label>
                </div>
                <h2 className="text-xl font-bold text-[var(--text-color)]">
                  {profile?.name || "Unknown"} {profile?.lastName || "User"}
                </h2>
                <p className="text-[var(--text-secondary-color)]">
                  {profile?.email || "No email provided"}
                </p>
              </div>

              {/* CV Upload */}
              <div className="border-t border-[var(--grey-200)] pt-4">
                <h3 className="font-semibold text-[var(--text-color)] mb-3 flex items-center gap-2">
                  <Description />
                  Curriculum Vitae
                </h3>
                {profile?.curriculumVitae ? (
                  <div className="flex items-center justify-between p-3 bg-[var(--primary-50)] rounded-lg border border-[var(--primary-200)]">
                    <span className="text-sm text-[var(--primary-700)]">
                      CV Uploaded
                    </span>
                    <a
                      href={profile?.curriculumVitae}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-hipster text-xs px-3 py-1"
                    >
                      View
                    </a>
                  </div>
                ) : (
                  <p className="text-[var(--text-secondary-color)] text-sm mb-3">
                    No CV uploaded
                  </p>
                )}
                <label className="btn btn-block cursor-pointer">
                  <CloudUpload className="mr-2" />
                  {profile?.curriculumVitae ? "Update CV" : "Upload CV"}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(e.target.files[0], "curriculumVitae")
                    }
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div
              className="bg-[var(--background-secondary-color)] p-6 rounded-lg border border-[var(--grey-200)]"
              style={{ boxShadow: "var(--shadow-1)" }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[var(--text-color)]">
                  Personal Information
                </h3>
                {!editing ? (
                  <button
                    onClick={handleEdit}
                    className="btn-hipster flex items-center gap-2"
                  >
                    <Edit />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="btn flex items-center gap-2"
                      disabled={loading}
                    >
                      <Save />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="btn-hipster flex items-center gap-2"
                    >
                      <Cancel />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* First Name */}
                <div className="form-row">
                  <label className="form-label flex items-center gap-2">
                    <Person className="text-sm" />
                    First Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      className="form-input"
                      value={editForm.name || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                    />
                  ) : (
                    <p className="p-3 bg-[var(--grey-50)] rounded border border-[var(--grey-200)]">
                      {profile?.name || "Not provided"}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="form-row">
                  <label className="form-label flex items-center gap-2">
                    <Person className="text-sm" />
                    Last Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      className="form-input"
                      value={editForm.lastName || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, lastName: e.target.value })
                      }
                    />
                  ) : (
                    <p className="p-3 bg-[var(--grey-50)] rounded border border-[var(--grey-200)]">
                      {profile?.lastName || "Not provided"}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="form-row">
                  <label className="form-label flex items-center gap-2">
                    <Email className="text-sm" />
                    Email Address
                  </label>
                  <p className="p-3 bg-[var(--grey-50)] rounded border border-[var(--grey-200)] text-[var(--text-secondary-color)]">
                    {profile?.email} (Cannot be changed)
                  </p>
                </div>

                {/* Phone Number */}
                <div className="form-row">
                  <label className="form-label flex items-center gap-2">
                    <Phone className="text-sm" />
                    Phone Number
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      className="form-input"
                      value={editForm.phoneNumber || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="p-3 bg-[var(--grey-50)] rounded border border-[var(--grey-200)]">
                      {profile?.phoneNumber || "Not provided"}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="form-row md:col-span-2">
                  <label className="form-label flex items-center gap-2">
                    <LocationOn className="text-sm" />
                    Location
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      className="form-input"
                      value={editForm.location || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, location: e.target.value })
                      }
                      placeholder="City, Country"
                    />
                  ) : (
                    <p className="p-3 bg-[var(--grey-50)] rounded border border-[var(--grey-200)]">
                      {profile?.location || "Not provided"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div
          className="mt-6 bg-[var(--background-secondary-color)] p-6 rounded-lg border border-[var(--grey-200)]"
          style={{ boxShadow: "var(--shadow-1)" }}
        >
          <h3 className="text-xl font-bold text-[var(--text-color)] mb-4">
            Account Information
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="form-label">Member Since</label>
              <p className="p-3 bg-[var(--grey-50)] rounded border border-[var(--grey-200)]">
                {profile?.createdAt
                  ? new Date(profile?.createdAt).toLocaleDateString()
                  : "Unknown"}
              </p>
            </div>
            <div>
              <label className="form-label">Last Updated</label>
              <p className="p-3 bg-[var(--grey-50)] rounded border border-[var(--grey-200)]">
                {profile?.updatedAt
                  ? new Date(profile?.updatedAt).toLocaleDateString()
                  : "Unknown"}
              </p>
            </div>
          </div>
        </div>
    </PageWrapper>
  );
};

export default ProfileJobSeeker;
