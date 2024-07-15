import React, { useState, useEffect } from 'react';
import Sidebar from '../components1/sidebar';
import Header from '../components1/header';
import CustomizationAd from '../components1/CustomizationAds';
import Loader from '../../components/advert/Loader'; // Assuming the Loader component is in the correct path
import AdPreview from '../../components/advert/AdPreview'; // Assuming the AdPreview component is in the correct path
import LauchCampaign from '../../components/advert/launchCampaign';

const CustomizationAdsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isLoading, setIsLoading] = useState(true); // State for loading
  const [pages, setPages] = useState({
    customizationAd: true,
    adPreview: false,
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const setPage = (page) => {
    setPages({
      customizationAd: false,
      adPreview: false,
      lauchCampaign: false,
      [page]: true,
    });
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // Simulate loading for 5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] flex items-center justify-center pl-4 pr-4 overflow-hidden">
      <div className="border-2 border-[#FCFCFC] rounded-3xl w-full overflow-hidden" style={{ height: 'calc(100vh - 1rem)' }}>
        <div className="flex flex-col min-h-screen">
          <Header toggleSidebar={toggleSidebar} />
          <div className="flex flex-grow">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className={`flex-grow transition-transform duration-300 ${isSidebarOpen ? '-ml-6' : 'ml-0'}`}>
              <div className='m-2'>
                {/* Always render CustomizationAd */}
                {pages.customizationAd && <CustomizationAd setPage={setPage} />} {/* Pass setPage to CustomizationAd */}
                {pages.adPreview && <AdPreview setPage={setPage} />} {/* Pass setPage to AdPreview */}                
                {pages.lauchCampaign && <LauchCampaign setPage={setPage} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomizationAdsPage;
