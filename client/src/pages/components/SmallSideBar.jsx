import React from "react";
import Wrapper from "../../assets/wrappers/SmallSidebar";
import { useDashboardContext } from "../DashboardLayout";
import { FaTimes } from "react-icons/fa";
import Logo from "./Logo";
import NavLinks from "./NavLinks";

const SmallSideBar = () => {
  const { showSidebar, toggleSidebar } = useDashboardContext();
  // console.log(data);
  return (
    <Wrapper>
      <div
        className={
          showSidebar ? "sidebar-container show-sidebar" : "sidebar-container"
        }
      >
        <div className="content">
          <button type="button" className="close-btn" onClick={toggleSidebar}>
            <FaTimes />
          </button>

          <header>
            <Logo></Logo>
          </header>
          <NavLinks></NavLinks>
        </div>
      </div>
    </Wrapper>
  );
};

export default SmallSideBar;
