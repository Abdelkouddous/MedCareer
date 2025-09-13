import { FaUserCircle, FaCaretDown } from "react-icons/fa";
import { useState } from "react";
import { useDashboardContext } from "../DashboardLayout";
import Wrapper from "../../assets/wrappers/LogoutContainer";

const LogoutContainer = () => {
  const [showLogout, setShowLogout] = useState(false);
  const { user, logoutUser, navigateToProfile, navigateToApplications } =
    useDashboardContext();

  return (
    <Wrapper>
      <button
        type="button"
        className="btn logout-btn"
        onClick={() => setShowLogout(!showLogout)}
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="avatar"
            className="img"
            onError={(e) => {
              console.log("Failed to load avatar image");
            }}
          />
        ) : (
          <FaUserCircle />
        )}
        {user?.name || "Unnamed"}
        <FaCaretDown />
      </button>
      <div className={showLogout ? "dropdown show-dropdown" : "dropdown"}>
        <button
          type="button"
          className="dropdown-btn"
          onClick={() => {
            navigateToProfile();
            setShowLogout(false);
          }}
        >
          Profile
        </button>

        <button
          type="button"
          className="dropdown-btn"
          onClick={() => {
            navigateToApplications();
            setShowLogout(false);
          }}
        >
          My applications
        </button>
        <button
          type="button"
          className="dropdown-btn"
          onClick={() => {
            logoutUser();
            setShowLogout(false);
          }}
        >
          Logout
        </button>
      </div>
    </Wrapper>
  );
};

export default LogoutContainer;
