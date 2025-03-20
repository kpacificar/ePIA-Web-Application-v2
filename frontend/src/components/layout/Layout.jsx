import React from "react";
import NavBar from "./NavBar";
import "../../styles/layout/Layout.css";

const Layout = ({ children, isAuthenticated }) => {
  return (
    <div className="layout">
      <NavBar />
      {isAuthenticated ? (
        <div className="authenticated-content">{children}</div>
      ) : (
        <div className="main-section">{children}</div>
      )}
    </div>
  );
};

export default Layout;
