// import { Form } from "react-router-dom";
// import { toast } from "react-toastify";
// import { FormRow, FormRowSelect } from "./components/";
// import Wrapper from "../assets/wrappers/DashboardFormPage";
// //
// import { useOutletContext } from "react-router-dom";

// import customFetch from "../utils/customFetch";
// import { MEDICAL_SPECIALIZATION } from "../../../utils/constants";
// import { SubmitBtn } from "./components/SubmitBtn";
// export const action = async ({ request }) => {
//   const formData = await request.formData();
//   // Log all fields in formData
//   for (const [key, value] of formData.entries()) {
//     console.log(`${key}:`, value);
//   }

//   // Extract the file from formData
//   const file = formData.get("avatar");

//   // Validate the file size if a file is selected
//   if (file && file.size > 500000) {
//     toast.error("Image size too large");
//     return null;
//   }
//   // Log the file to ensure it's being captured
//   // console.log("Uploaded File:", file);

//   // Remove the avatar field if no file is selected
//   if (!file) {
//     formData.delete("avatar");
//   }

//   try {
//     // Send the formData to the server with proper headers for file upload
//     await customFetch.patch("/users/update-user", formData);
//     toast.success("Profile updated successfully");
//   } catch (error) {
//     // Handle errors and display a user-friendly message
//     toast.error(error?.response?.data?.msg || "Failed to update profile");
//   }

//   return null;
// };

// const Profile = () => {
//   const { user } = useOutletContext();

//   const { name, lastName, email, location, specialty } = user;

//   // mock data
//   // const [userData, setUserData] = useState({
//   //   name: `${name}`,
//   //   lastName: `${lastName}`,
//   //   email : `${email}`,
//   //   location: `${location}`,
//   //   specialty: `${specialty}`,
//   // });
//   // const handleChange = (e) => {
//   //   const { name, value } = e.target;
//   //   setUserData({ ...userData, [name]: value });
//   // }
//   // const handleSubmit = (e) => {
//   //   e.preventDefault();
//   //   // console.log(userData);

//   // }

//   return (
//     <Wrapper>
//       <Form method="post" className="form" encType="multipart/form-data">
//         <h4 className="text-center text-4xl md:text-2xl lg:text-3xl font-bold text-[var(--text-color)] mb-6">
//           Medical Professional
//           <span className="text-[var(--primary-500)]"> Profile</span>
//         </h4>
//         <div className="form-center">
//           <h4 className="text-center text-2xl md:text-xl lg:text-2xl font-bold text-[var(--text-color)] mb-6">
//             Profile infomartions
//           </h4>
//         </div>

//         <div className="form-center">
//           <label htmlFor="avatar" className="form-label">
//             Select an image file (max 1MB)
//             <input
//               type="file"
//               id="avatar"
//               name="avatar"
//               className="form-input"
//               accept="image/*"
//             />
//           </label>
//           <FormRow
//             type="text"
//             name="name"
//             labelText="First Name"
//             defaultValue={name}
//           />

//           <FormRow
//             type="text"
//             name="lastName"
//             labelText="Last Name"
//             defaultValue={lastName}
//           />

//           <FormRow
//             type="text"
//             name="email"
//             labelText="Email"
//             defaultValue={email}
//           />

//           <FormRow
//             type="text"
//             name="location"
//             labelText="Location"
//             defaultValue={location}
//           />

//           <FormRowSelect
//             type="text"
//             name="specialty"
//             labelText="Specialty"
//             list={Object.values(MEDICAL_SPECIALIZATION)}
//             defaultValue={specialty}
//           />
//         </div>

//         <SubmitBtn formBtn />
//       </Form>
//     </Wrapper>
//   );
// };

// export default Profile;
import { Form } from "react-router-dom";
import { toast } from "react-toastify";
import { FormRow, FormRowSelect } from "../components";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { useOutletContext } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { MEDICAL_SPECIALIZATION } from "../../../../utils/constants";
import { SubmitBtn } from "../components/SubmitBtn";
import {
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUserMd,
  FaCalendarAlt,
  FaEdit,
  FaCamera,
} from "react-icons/fa";

export const action = async ({ request }) => {
  const formData = await request.formData();
  // Log all fields in formData
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  // Extract the file from formData
  const file = formData.get("avatar");

  // Validate the file size if a file is selected
  if (file && file.size > 500000) {
    toast.error("Image size too large");
    return null;
  }

  // Remove the avatar field if no file is selected
  if (!file || file.size === 0) {
    formData.delete("avatar");
  }

  try {
    // Send the formData to the server with proper headers for file upload
    await customFetch.patch("/users/update-user", formData);
    toast.success("Profile updated successfully");
  } catch (error) {
    // Handle errors and display a user-friendly message
    toast.error(error?.response?.data?.msg || "Failed to update profile");
  }

  return null;
};

const ProfileInfoCard = ({ icon, label, value, className = "" }) => (
  <div className={`profile-info-item ${className}`}>
    <div className="profile-info-icon">{icon}</div>
    <div className="profile-info-content">
      <span className="profile-info-label">{label}</span>
      <span className="profile-info-value">{value || "Not specified"}</span>
    </div>
  </div>
);

const Profile = () => {
  const { user } = useOutletContext();
  const { name, lastName, email, location, specialty, avatar, createdAt } =
    user;

  // Format join date
  const joinDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  return (
    <div className="profile-container">
      {/* Profile Display Section */}
      <div className="profile-display-section">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {avatar ? (
                <img src={avatar} alt="Profile" className="avatar-image" />
              ) : (
                <div className="avatar-placeholder">
                  <FaUser size={40} />
                </div>
              )}
            </div>
            <div className="profile-name">
              <h2>
                {`${name || ""} ${lastName || ""}`.trim() || "Anonymous User"}
              </h2>
              <p className="profile-subtitle">Medical Professional</p>
            </div>
          </div>

          <div className="profile-info-grid">
            <ProfileInfoCard
              icon={<FaUser />}
              label="Full Name"
              value={`${name || ""} ${lastName || ""}`.trim()}
            />

            <ProfileInfoCard
              icon={<FaEnvelope />}
              label="Email"
              value={email}
            />

            <ProfileInfoCard
              icon={<FaMapMarkerAlt />}
              label="Location"
              value={location}
            />

            <ProfileInfoCard
              icon={<FaUserMd />}
              label="Specialty"
              value={specialty}
            />

            <ProfileInfoCard
              icon={<FaCalendarAlt />}
              label="Member Since"
              value={joinDate}
              className="full-width"
            />
          </div>
        </div>
      </div>

      {/* Profile Edit Section */}
      <div className="profile-edit-section">
        <Wrapper>
          <Form method="post" className="form" encType="multipart/form-data">
            {/* <Wrapper>
              <h4 className="form-title">
                <FaEdit className="title-icon" />
                Edit Profile
              </h4>
              <p className="form-subtitle">
                Update your professional information
              </p>
            </Wrapper> */}
            <Wrapper>
              <h4 className="flex justify-between space-x-2 text-center text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--text-color)] mb-6">
                <FaEdit className="title-icon mr-2" />
                Edit
                <span className="text-[var(--primary-500)]"> Profile</span>
              </h4>
              <span>Update your professional information</span>
            </Wrapper>
            <div className="form-center">
              <div className="form-row">
                <label htmlFor="avatar" className="file-input-label">
                  <FaCamera className="camera-icon" />
                  <span>Update Profile Picture</span>
                  <small>(Max 500KB)</small>
                  <input
                    type="file"
                    id="avatar"
                    name="avatar"
                    className="file-input"
                    accept="image/*"
                  />
                </label>
              </div>

              <div className="form-row-grid">
                <FormRow
                  type="text"
                  name="name"
                  labelText="First Name"
                  defaultValue={name}
                />

                <FormRow
                  type="text"
                  name="lastName"
                  labelText="Last Name"
                  defaultValue={lastName}
                />
              </div>

              <FormRow
                type="email"
                name="email"
                labelText="Email"
                defaultValue={email}
              />

              <FormRow
                type="text"
                name="location"
                labelText="Location"
                defaultValue={location}
              />

              <FormRowSelect
                name="specialty"
                labelText="Medical Specialty"
                list={Object.values(MEDICAL_SPECIALIZATION)}
                defaultValue={specialty}
              />
            </div>

            <SubmitBtn formBtn />
          </Form>
        </Wrapper>
      </div>

      <style jsx>{`
        .profile-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          padding: 1.5rem;
          min-height: calc(100vh - 120px);
        }

        .profile-display-section {
          background: var(--background-secondary-color);
          border-radius: 12px;
          padding: 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .profile-card {
          background: linear-gradient(
            135deg,
            var(--primary-500),
            var(--primary-600)
          );
          color: white;
          border-radius: 12px;
          padding: 2rem;
          height: 100%;
          position: relative;
          overflow: hidden;
        }

        .profile-card::before {
          content: "";
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          transform: rotate(45deg);
        }

        .profile-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2rem;
          position: relative;
          z-index: 2;
        }

        .profile-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          margin-bottom: 1rem;
          border: 4px solid rgba(255, 255, 255, 0.3);
          overflow: hidden;
        }

        .avatar-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.8);
        }

        .profile-name h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          text-align: center;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .profile-subtitle {
          margin: 0.5rem 0 0 0;
          opacity: 0.9;
          text-align: center;
          font-size: 0.9rem;
        }

        .profile-info-grid {
          display: grid;
          gap: 1rem;
          position: relative;
          z-index: 2;
        }

        .profile-info-item {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 8px;
          padding: 1rem;
          transition: transform 0.2s ease;
        }

        .profile-info-item:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.15);
        }

        .profile-info-item.full-width {
          grid-column: 1 / -1;
        }

        .profile-info-icon {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
          flex-shrink: 0;
        }

        .profile-info-content {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .profile-info-label {
          font-size: 0.8rem;
          opacity: 0.8;
          margin-bottom: 0.25rem;
        }

        .profile-info-value {
          font-size: 1rem;
          font-weight: 500;
        }

        .profile-edit-section {
          background: var(--background-secondary-color);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .form-header {
          background: var(--primary-50);
          padding: 1.5rem;
          border-bottom: 1px solid var(--grey-200);
        }

        .form-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0 0 0.5rem 0;
          font-size: 1.5rem;
          color: var(--primary-600);
        }

        .title-icon {
          color: var(--primary-500);
        }

        .form-subtitle {
          margin: 0;
          color: var(--grey-600);
          font-size: 0.9rem;
        }

        .file-input-container {
          margin-bottom: 1.5rem;
        }

        .file-input-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
          border: 2px dashed var(--primary-300);
          border-radius: 8px;
          background: var(--primary-50);
          color: var(--primary-600);
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .file-input-label:hover {
          border-color: var(--primary-500);
          background: var(--primary-100);
        }

        .camera-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: var(--primary-500);
        }

        .file-input-label span {
          font-weight: 500;
          margin-bottom: 0.25rem;
        }

        .file-input-label small {
          font-size: 0.8rem;
          opacity: 0.7;
        }

        .file-input {
          display: none;
        }

        .form-row-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .profile-container {
            grid-template-columns: 1fr;
            gap: 1rem;
            padding: 1rem;
          }

          .profile-card {
            padding: 1.5rem;
          }

          .profile-header {
            margin-bottom: 1.5rem;
          }

          .profile-avatar {
            width: 80px;
            height: 80px;
          }

          .profile-name h2 {
            font-size: 1.3rem;
          }

          .form-row-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .file-input-label {
            padding: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .profile-container {
            padding: 0.5rem;
          }

          .profile-card {
            padding: 1rem;
          }

          .profile-info-item {
            padding: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
