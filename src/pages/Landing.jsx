import React from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from '../Dashboard/components1/landing/HeroSection';
import CreativeAutomation from '../Dashboard/components1/landing/CreativeAutomation';
import AssociatedSection from '../Dashboard/components1/landing/AssociatedSection';
import HowItWorks from '../Dashboard/components1/landing/HowItWorks';
const Landing = () => {
  return (
    <div className="overflow-auto hide-scrollbar">
			<Navbar />
			
			<div >
            <HeroSection />
				{/* <AboutSection /> */}
				<CreativeAutomation />
				{/* <Pricing /> */}
				<AssociatedSection/>
				<HowItWorks/>
			</div>
			<Footer />
		</div>
  );
};

export default Landing;