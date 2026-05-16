import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";

const HomeLayout = () => {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "var(--nav-height)" }}></div>
      <Outlet></Outlet>
      <Footer />
    </>
  );
};

export default HomeLayout;
