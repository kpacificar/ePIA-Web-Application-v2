import React, { useState } from "react";
import "../../styles/landing/Questions.css";

const Questions = () => {
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="moward-questions" id="faq">
      <h2>Got questions?</h2>
      <p>
        See answers to our most frequently asked questions below or{" "}
        <a href="mailto:info@moward.com.ph">get in touch</a>.
      </p>

      <div className="accordion accordion-flush" id="accordionFlushExample">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className={`accordion-button ${
                openAccordion !== "flush-collapseOne" ? "collapsed" : ""
              }`}
              type="button"
              onClick={() => toggleAccordion("flush-collapseOne")}
              aria-expanded={openAccordion === "flush-collapseOne"}
              aria-controls="flush-collapseOne"
            >
              What is ePIA?
            </button>
          </h2>

          <div
            id="flush-collapseOne"
            className={`accordion-collapse collapse ${
              openAccordion === "flush-collapseOne" ? "show" : ""
            }`}
          >
            <div className="accordion-body">
              Moward's ePIA is an electronic privacy impact assessment (PIA)
              tool which is capable of assisting organizations in doing a
              privacy impact assessment per system.
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className={`accordion-button ${
                openAccordion !== "flush-collapseTwo" ? "collapsed" : ""
              }`}
              type="button"
              onClick={() => toggleAccordion("flush-collapseTwo")}
              aria-expanded={openAccordion === "flush-collapseTwo"}
              aria-controls="flush-collapseTwo"
            >
              What are the features of ePIA?
            </button>
          </h2>

          <div
            id="flush-collapseTwo"
            className={`accordion-collapse collapse ${
              openAccordion === "flush-collapseTwo" ? "show" : ""
            }`}
          >
            <div className="accordion-body">
              ePIA is capable of capturing personal information (PI) and
              sensitive personal information (SPI) covered by your
              organization's data processing system(s). The risk maps are able
              to show the effect of risks and control measures for each system.
              The ePIA generates customizable reports for each data processing
              system.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questions;
