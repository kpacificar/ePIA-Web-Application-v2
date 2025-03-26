import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/layout/Sidebar.css";

const Sidebar = ({ userProfile }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const location = useLocation();

  // Load sidebar state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarState");
    if (savedState !== null) {
      setIsOpen(savedState === "open");
    }
  }, []);

  const handleArrowClick = (menuId) => {
    setActiveSubmenu(activeSubmenu === menuId ? null : menuId);
  };

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    // Save to localStorage
    localStorage.setItem("sidebarState", newState ? "open" : "closed");
  };

  return (
    <>
      <div className={`sidebar ${!isOpen ? "close" : ""}`}>
        <div className="logo-details">
          <i className="bx bx-user"></i>
          <span className="logo_name">Moward ePIA</span>
        </div>
        <ul className="nav-links">
          <li
            id="dashboard"
            className={location.pathname === "/dashboard" ? "active" : ""}
          >
            <Link to="/dashboard">
              <i className="bx bx-grid-alt"></i>
              <span className="link_name">Dashboard</span>
            </Link>
            <ul className="sub-menu blank">
              <li className="menu-items">
                <span>&bull;</span>
                <Link to="/dashboard">Dashboard</Link>
              </li>
            </ul>
          </li>

          <li
            id="companies"
            className={activeSubmenu === "companies" ? "showMenu" : ""}
          >
            <div className="icon-link">
              <a href="#" onClick={(e) => e.preventDefault()}>
                <i className="bx bx-collection"></i>
                <span className="link_name">Companies</span>
              </a>
              <i
                className="bx bxs-chevron-down arrow"
                onClick={() => handleArrowClick("companies")}
              ></i>
            </div>
            <ul className="sub-menu">
              <li className="menu-items">
                <span>&bull;</span>
                <Link to="/companies">Company List</Link>
              </li>
              <li className="menu-items">
                <span>&bull;</span>
                <Link to="/companies/new">Add Company</Link>
              </li>
            </ul>
          </li>

          <li
            id="business-units"
            className={activeSubmenu === "business-units" ? "showMenu" : ""}
          >
            <div className="icon-link">
              <a href="#" onClick={(e) => e.preventDefault()}>
                <i className="bx bx-book-alt"></i>
                <span className="link_name">Business Units</span>
              </a>
              <i
                className="bx bxs-chevron-down arrow"
                onClick={() => handleArrowClick("business-units")}
              ></i>
            </div>
            <ul className="sub-menu">
              <li className="menu-items">
                <span>&bull;</span>
                <Link to="/business-units">Business Units List</Link>
              </li>
              <li className="menu-items">
                <span>&bull;</span>
                <Link to="/business-units/new">Add Business Units</Link>
              </li>
            </ul>
          </li>

          <li
            id="systems"
            className={activeSubmenu === "systems" ? "showMenu" : ""}
          >
            <div className="icon-link">
              <a href="#" onClick={(e) => e.preventDefault()}>
                <i className="bx bxs-server"></i>
                <span className="link_name">Systems</span>
              </a>
              <i
                className="bx bxs-chevron-down arrow"
                onClick={() => handleArrowClick("systems")}
              ></i>
            </div>
            <ul className="sub-menu">
              <li className="menu-items">
                <span>&bull;</span>
                <Link to="/systems">System List</Link>
              </li>
              <li className="menu-items">
                <span>&bull;</span>
                <Link to="/systems/new">Add System</Link>
              </li>
            </ul>
          </li>

          <li id="pia" className={activeSubmenu === "pia" ? "showMenu" : ""}>
            <div className="icon-link">
              <a href="#" onClick={(e) => e.preventDefault()}>
                <i className="bx bx-line-chart"></i>
                <span className="link_name">PIA</span>
              </a>
              <i
                className="bx bxs-chevron-down arrow"
                onClick={() => handleArrowClick("pia")}
              ></i>
            </div>
            <ul className="sub-menu">
              <li className="menu-items">
                <span>&bull;</span>
                <Link to="/pia">See PIA</Link>
              </li>
              <li className="menu-items">
                <span>&bull;</span>
                <Link to="/pia/new">Add New PIA</Link>
              </li>
            </ul>
          </li>

          <li id="help-support">
            <Link to="/dashboard">
              <i className="bx bx-help-circle"></i>
              <span className="link_name">Help & Support</span>
            </Link>
            <ul className="sub-menu blank">
              <li className="menu-items">
                <span>&bull;</span>
                <Link to="/dashboard">Help & Support</Link>
              </li>
            </ul>
          </li>

          <li id="feedback">
            <Link to="/dashboard">
              <i className="bx bx-comment-error"></i>
              <span className="link_name">Give Feedback</span>
            </Link>
            <ul className="sub-menu blank">
              <li className="menu-items">
                <span>&bull;</span>
                <Link to="/dashboard">Give Feedback</Link>
              </li>
            </ul>
          </li>

          <li
            id="account-settings"
            className={activeSubmenu === "account-settings" ? "showMenu" : ""}
          >
            <div className="icon-link">
              <a href="#" onClick={(e) => e.preventDefault()}>
                <i className="bx bx-cog"></i>
                <span className="link_name">Account Settings</span>
              </a>
              <i
                className="bx bxs-chevron-down arrow"
                onClick={() => handleArrowClick("account-settings")}
              ></i>
            </div>
            <ul className="sub-menu">
              <li className="menu-items">
                <span>&bull;</span>
                <Link to="/account/details">Account Details</Link>
              </li>
              <li className="menu-items">
                <span>&bull;</span>
                <Link to="/account/password">Change Password</Link>
              </li>
              <li className="menu-items">
                <span>&bull;</span>
                <Link to="/account/delete">Delete Account</Link>
              </li>
            </ul>
          </li>

          <li id="profile">
            <div className="profile-details">
              <div className="profile-content">
                <img src="/static/images/no_profile.png" alt="profile" />
              </div>
              <div className="name-job">
                <div className="profile_name">
                  {userProfile.first_name} {userProfile.last_name}
                </div>
                <div className="job">Account Type</div>
              </div>
              <Link to="/logout">
                <i className="bx bx-log-out"></i>
              </Link>
            </div>
          </li>

          <li className="collapse-btn">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toggleSidebar();
              }}
            >
              <i className="bx bx-chevron-left"></i>
              <span className="link_name">Collapse</span>
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
