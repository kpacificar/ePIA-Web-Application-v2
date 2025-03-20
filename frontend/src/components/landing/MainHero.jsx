import React from "react";
import { Link } from "react-router-dom";
import "../../styles/landing/MainHero.css";

const MainHero = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="moward-epia">
      <div className="color-overlay d-flex flex-column justify-content-center align-items-center">
        <h1>Moward's ePIA</h1>
        <p>
          Say goodbye to long spreadsheets and avoid human gaps during the
          assessment. With Moward's e-PIA system, you can potentially cut at
          least 50% of the time compared to manual assessment. The e-PIA system
          is your new virtual "team" that will help you monitor and shorten the
          impact and risk assessment timeframe exponentially.
        </p>
        <div className="button d-flex">
          <a
            href="#package"
            className="btn btn-lg btn-primary"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("package");
            }}
          >
            Go to Pricing
          </a>
          <Link to="/signup" className="btn btn-lg btn-primary">
            Register Now!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainHero;
