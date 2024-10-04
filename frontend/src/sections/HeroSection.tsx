import React from "react";
import HeroLeftSection from "../components/HeroLeftSection";
import HeroRightSection from "../components/HeroRightSection";
import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";
import ResetPasswordModal from "./ResetPasswordModal";

interface heroSectionProps{
  route: string,
}

const HeroSection: React.FC<heroSectionProps> = ({route}) => {

  const getModalComponent = () => {
    switch (route) {
      case "login":
        return <LoginModal />;
      case "signup":
        return <SignupModal />;
      case "reset-password":
        return <ResetPasswordModal />;
      case "homepage":
        return <HeroLeftSection />;
    }
  };

  return (
    <section className="max-w-7xl mx-auto flex-row flex pt-24 gap-5">
      {getModalComponent()}
      <HeroRightSection />
    </section>
  );
};

export default HeroSection;
