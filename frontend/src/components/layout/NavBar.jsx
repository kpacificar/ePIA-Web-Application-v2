import React from "react";
import { Link } from "react-router-dom";
import "../../styles/layout/NavBar.css";

const NavBar = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light pl-0 pt-0 pb-0">
      <nav className="navbar bg-body-tertiary p-0">
        <div className="container p-0">
          <Link className="navbar-brand p-0 m-0" to="/">
            <img
              src="/static/images/moward-epia-logo.jpg"
              alt="Moward E-PIA"
              width="auto"
              height="80"
            />
          </Link>
        </div>
      </nav>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div
        className="collapse navbar-collapse justify-content-end"
        id="navbarSupportedContent"
      >
        <div className="nav-item-list">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item d-flex justify-content-center mx-2">
              <a
                className="nav-link"
                href="#package"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("package");
                }}
              >
                Package
              </a>
            </li>
            <li className="nav-item d-flex justify-content-center mx-2">
              <a
                className="nav-link"
                href="#faq"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("faq");
                }}
              >
                FAQs
              </a>
            </li>
            <li className="nav-item d-flex justify-content-center mx-2">
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
            <Link className="btn btn-primary" to="/signup">
              Get Started
            </Link>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
