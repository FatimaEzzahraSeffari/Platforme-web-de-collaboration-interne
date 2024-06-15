// src/pages/Home/HomePage.tsx
import React from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import Features from './Features';
import LiveDemo from './LiveDemo';
import StartCollab from './StartCollab';
import InboxSection from './InboxSection'; // Assuming you have InboxSection.tsx as well
import Testimonials from './Testimonials';
import Footer from './Footer';

const HomePage = () => {
  return (
    <div style={{ backgroundColor: '#00356d', maxWidth: '1250px', margin: '0 auto' }} >
       <Header />
      <HeroSection />
      <Features />
      <LiveDemo />
      <StartCollab />
      <InboxSection />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default HomePage;
