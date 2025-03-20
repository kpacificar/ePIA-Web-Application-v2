import React from "react";
import { Link } from "react-router-dom";
import "../styles/LandingPage.css";
import MainHero from "../components/landing/MainHero";
import Faq from "../components/landing/Faq";
import Packages from "../components/landing/Packages";
import Questions from "../components/landing/Questions";
import Footer from "../components/layout/Footer";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <MainHero />
      <Faq />
      <Packages />
      <Questions />
      <Footer />
    </div>
  );
};

export default LandingPage;
