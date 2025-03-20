import React from "react";
import "../../styles/landing/Faq.css";

const Faq = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="moward-faq d-flex justify-content-center align-items-center">
      <div className="img-container">
        <img src="/static/images/sample-image.jpg" alt="Filler Image" />
      </div>
      <div>
        <div className="faq-col">
          <h2>FAQ</h2>
          <p>
            Curious about ePIA? Find answers to frequently asked questions here.
          </p>
          <p>
            <a
              href="#faq"
              className="btn btn-outline-primary"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("faq");
              }}
            >
              Go to our FAQs
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Faq;
