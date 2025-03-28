import React from "react";
import NavBar from "./NavBar";
import "../../styles/layout/Layout.css";

const Layout = ({ children, isAuthenticated }) => {
  return (
    <div className="layout">
      {!isAuthenticated && <NavBar />}

      {isAuthenticated ? <>{children}</> : <>{children}</>}
    </div>
  );
};

export default Layout;
