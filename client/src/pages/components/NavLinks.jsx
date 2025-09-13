import { useDashboardContext } from "../DashboardLayout";
import links from "../../utils/links";
import { NavLink } from "react-router-dom";

const NavLinks = ({ isBigSidebar }) => {
  const { toggleSidebar, user } = useDashboardContext();
  return (
    <div className="nav-links">
      {links.map((link, index) => {
        const { text, path, icon } = link;
        const { role } = user;

        if (path === "admin" && role !== "admin") {
          return;
        }
        return (
          <NavLink
            to={path}
            key={text}
            className="nav-link"
            onClick={isBigSidebar ? null : toggleSidebar}
          >
            {/*  className="flex items-center px-4 py-2 text-gray-800 hover:text-gray-900"> */}
            <span className="icon">{icon}</span> {text}
          </NavLink>
        );
      })}{" "}
    </div>
  );
};

export default NavLinks;
