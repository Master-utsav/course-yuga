import React from "react";
import HeroLeftSection from "@/components/homepage/HeroLeftSection";
import HeroRightSection from "@/components/homepage/HeroRightSection";
import SignupModal from "@/components/modals/SignupModal";
import LoginModal from "@/components/modals/LoginModal";
import ResetPasswordModal from "@/components/modals/ResetPasswordModal";

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
    <section className="max-w-7xl mx-auto flex-row flex lg:pt-24 pt-20 gap-5 relative">
      {getModalComponent()}
      <HeroRightSection />
    </section>
  );
};

export default React.memo(HeroSection);
