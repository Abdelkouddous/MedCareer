import { IoBarChartSharp } from "react-icons/io5";
import { MdQueryStats } from "react-icons/md";
import { FaWpforms } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { MdAdminPanelSettings } from "react-icons/md";

const links = [
  {
    text: "add job",
    path: "/dashboard", // naviage to dashboard with /dashboard as if we use dashboard it will link to /dashbarod/dashboard
    icon: <FaWpforms />,
  },

  {
    text: "my jobs",
    path: "my-jobs",
    icon: <FaWpforms />,
  },
  {
    text: "candidates",
    path: "candidates",
    icon: <ImProfile />,
  },
  {
    text: "stats",
    path: "stats",
    icon: <IoBarChartSharp />,
  },
  {
    text: "profile",
    path: "profile",
    icon: <ImProfile />,
  },
  {
    text: "admin",
    path: "admin",
    icon: <MdAdminPanelSettings />,
  },
];

export default links;
