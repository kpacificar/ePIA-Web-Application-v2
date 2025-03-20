import React from "react";
import "../../styles/layout/Footer.css";

const Footer = () => {
  return (
    <div className="main-footer">
      <div className="footer-row">
        <div className="footer-col w80">
          <a href="/" className="main-logo">
            <img
              src="/static/images/moward-logo-consultancy.png"
              alt="Moward Consultancy Inc."
              id="moward-footer-logo"
            />
          </a>
        </div>
      </div>

      <div className="footer-row">
        <div className="footer-col">
          <div className="footer-item">
            <h5>Our Location</h5>
            <hr />
            <p>Acacia Ave, Taguig</p>
            <p>1637 Metro Manila</p>
            <p>632 959-5722</p>
            <a href="mailto:info@moward.com.ph">info@moward.com.ph</a>
          </div>
        </div>

        <div className="footer-col-2">
          <h5>Subscribe</h5>
          <hr />
          <p>Get Latest Updates!</p>

          <div className="footer-container">
            <div>
              <input
                type="checkbox"
                name="type[]"
                value="Reference knowledge materials"
              />
              <span>Reference knowledge materials</span>
            </div>
            <div>
              <input
                type="checkbox"
                name="type[]"
                value="Education, Training and Learning Workshops"
              />
              <span>Education, Training and Learning Workshops</span>
            </div>
          </div>
          <div className="form">
            <i className="fa-solid fa-envelope"></i>
            <input
              type="text"
              name="email"
              required
              placeholder="Enter your email"
            />
            <button type="submit">
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>

        <div className="footer-col">
          <h5>Data Protection Officer</h5>
          <hr />
          <p>
            For inquiries regarding processing of your personal information
            performed by our company, contact
          </p>
          <p>
            Moward Consultancy Inc. <br />
            <a href="mailto:dpo@moward.com.ph">dpo@moward.com.ph</a>
            <br />
            <a href="tel:+6329595722">+632 959 5722</a>
          </p>
        </div>
      </div>
      <hr className="copyright-hr" />
      <div className="copyright">©2023 Moward. All Rights Reserved.</div>
    </div>
  );
};

export default Footer;
