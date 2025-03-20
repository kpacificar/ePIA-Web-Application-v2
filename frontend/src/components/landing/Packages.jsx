import React from "react";
import { Link } from "react-router-dom";
import "../../styles/landing/Packages.css";

const Packages = () => {
  return (
    <div className="moward-packages" id="package">
      <h2>Packages</h2>
      <p>
        Are you ready to make data privacy compliance easier? Choose a package
        that works for your organization.
      </p>

      <div className="package-col">
        <div className="package-item">
          <h3>Monthly</h3>
          <p>
            Covers sign up fee of PHP 20,000 and first monthly fee of PHP
            10,000. Succeeding monthly fees at PHP 10,000.
          </p>
          <p>
            <b>Php 30,000</b>
          </p>
          <Link to="/signup" className="btn btn-outline-primary">
            Apply for this package
          </Link>
          <hr />
          <div className="inclusions">
            <h4>Includes:</h4>
            <ul>
              <li>Up to 1GB allocation per subscription</li>
              <li>Up to 10 concurrent users</li>
              <li>Access to application upgrades</li>
              <li>Customer Support during business hours</li>
              <li>Free tutorial</li>
            </ul>
          </div>
        </div>

        <div className="package-item">
          <h3>Annual</h3>
          <p>Covers sign up fee of PHP 20,000 and annual fee of PHP 100,000.</p>
          <p>
            <b>Php 120,000</b>
          </p>
          <Link to="/signup" className="btn btn-outline-primary">
            Apply for this package
          </Link>
          <hr />
          <div className="inclusions">
            <h4>Includes:</h4>
            <ul>
              <li>Up to 1GB allocation per subsciption</li>
              <li>Up to 10 concurrent users</li>
              <li>Access to application upgrades</li>
              <li>Customer support during business hours</li>
              <li>Free tutorial</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Packages;
