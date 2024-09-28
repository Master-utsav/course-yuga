import React from 'react'
import HeroLeftSection from '../components/HeroLeftSection'
import HeroRightSection from '../components/HeroRightSection'
import SignupModal from './SignupModal';
import { useAuthContext } from '../context/authContext';

const HeroSection: React.FunctionComponent  = () => {
  const { isSignupOpen } = useAuthContext();

  return (
    <section className='max-w-7xl mx-auto flex-row flex pt-24 gap-5'>
      {isSignupOpen ? (
        <SignupModal />
      ) : (
        <HeroLeftSection />
      )}
      <HeroRightSection />
    </section>
  )
}

export default HeroSection
