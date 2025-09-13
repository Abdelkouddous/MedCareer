import React from "react";
import Wrapper from "../../assets/wrappers/BigSidebar";
import { useDashboardContext } from "../DashboardLayout";
import { FaTimes } from "react-icons/fa";
import Logo from "./Logo";
import NavLinks from "./NavLinks";

const BigSideBar = () => {
  const { showSidebar } = useDashboardContext();
  return (
    <Wrapper>
      <div
        className={
          showSidebar ? "sidebar-container " : "sidebar-container show-sidebar"
        }
      >
        <NavLinks isBigSidebar></NavLinks>
      </div>
    </Wrapper>
  );

  //
};

export default BigSideBar;
