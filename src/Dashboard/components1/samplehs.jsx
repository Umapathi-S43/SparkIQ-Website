import React, { useState, useEffect } from 'react';
import Header1 from './header1';
import Sidebar1 from './sidebar1';
import BrandColors from '../../components/CardIllustrations/BrandColors';
import Ads from '../../components/CardIllustrations/ImpactfulAds';
import AboutCard from '../../components/AboutSection/AboutCard';


export default function SampleHS() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] flex items-center justify-center pl-4 pr-4 overflow-hidden">
      <div className="border-2 border-[#FCFCFC] rounded-3xl w-full overflow-hidden" style={{ height: 'calc(100vh - 1rem)' }}>
        <div className="flex flex-col min-h-screen">
          <Header1 toggleSidebar={toggleSidebar} />
          <div className="flex flex-grow">
            <Sidebar1 isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className={`flex-grow transition-transform duration-300 ${isSidebarOpen ? '-ml-6' : 'ml-0'}`} >
              <div className='m-2' ><AboutCard/></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
