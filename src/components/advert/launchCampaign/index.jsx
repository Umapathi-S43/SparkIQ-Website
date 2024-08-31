import React, { useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { useNavigate, useLocation } from 'react-router-dom'; // Import the useNavigate and useLocation hooks
import Targetting from "./Targetting";
import CampaignSetting from "./CampaignSetting";
import brandImage from '../../../assets/dashboard_img/brand_img.png';
import comingSoonImage from '/work-in-progress.png'; // Provide the correct path for the "Coming Soon" image

export default function LaunchCampaign({ setPage }) {
  const [tabIndex, setTabIndex] = useState(0);
  const navigate = useNavigate(); // Initialize the navigate function
  const location = useLocation(); // Initialize the location function

  const handleGoBack = () => {
    navigate("/adPreview", {
      state: {
        preview_img: location.state?.preview_img || '/defaultImage.png' // Pass the existing preview image or a default one
      }
    });
  };

  return (
    <div className='flex justify-center items-center'>
  <div className="coming-soon rounded-xl border border-[#FCFCFC] bg-[#FCFCFC] bg-opacity-25 p-14 w-full lg:w-4/5 lg:-ml-16 lg:mr-24 flex flex-col items-center text-center">
    <div className='w-full flex justify-center'>
      <video
        autoPlay
        muted
        loop
        className='rounded-lg w-full' // Set video width to 100%
        style={{ height: '50vh' }}
      >
         <source src='/v-nobg.webm' type="video/webm" />
         Your browser does not support the video tag.
      </video>
    </div>
    <div className="w-full">
      <span 
        className='font-semibold text-xl block text-nowrap' 
        style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
      > Launch Campaign Page in Progress
      </span>
      <span className='mt-2 block'>
          We are currently preparing this page to help you finalise your campaign settings. We appreciate your patience and look forward to providing you with a streamlined setup experience. Stay tuned for updates!
      </span>
    </div>
  </div>
</div>
);
}
    {/*<div className="flex-grow">
      <div className="w-full max-w-6xl mx-auto border border-[#fcfcfc] rounded-3xl flex flex-col items-center">
        <div className="w-full bg-[rgba(252,252,252,0.40)] rounded-t-3xl p-4 lg:p-1 mb-4">
          <span className="flex items-center ml-2 gap-4">
            <img src="/icon1.svg" alt="" className="w-10 lg:w-14" />
            <span className="flex flex-col">
              <h4 className="text-[#082A66] font-bold text-xl lg:text-2xl">Launch Campaign</h4>
              <p className="text-[#374151] text-xs lg:text-base lg:pr-40">
                Effortless Campaign Launch with our unique AI
              </p>
            </span>
            <img
              src={brandImage}
              alt="Brand Banner"
              className="hidden lg:block lg:ml-72 ml-0 relative bottom-[-6px] pb-0 w-[180px] h-[90px]"
            />
          </span>
        </div>

        <div className="w-full overflow-auto hide-scrollbar" style={{ maxHeight: "60vh" }}>
          <Tabs
            selectedTabClassName="outline-none bg-white text-[#082A66] font-bold rounded-[20px] shadow"
            selectedIndex={tabIndex}
            onSelect={(index) => setTabIndex(index)}
          >
            <TabList className="border border-[#FCFCFC] rounded-[20px] shadow-sm px-2 py-2 bg-[#FCFCFC40] w-fit mx-auto flex">
              <Tab className="cursor-pointer flex items-center p-3 font-bold text-sm gap-1">
                Campaign Setting
              </Tab>
              <Tab className="cursor-pointer flex items-center p-3 font-bold text-sm gap-1">
                Targeting
              </Tab>
            </TabList>
            <div className="p-6 flex flex-col lg:flex-row items-center gap-3">
              <img src="/Border.png" alt="" className="w-full max-w-full lg:w-1/2" />
              <div className="w-full lg:w-1/2 px-3">
                <TabPanel>
                  <CampaignSetting 
                    setPage={setPage}
                    handleGoBack={handleGoBack} // Pass the go back handler
                  />
                </TabPanel>
                <TabPanel>
                  <Targetting 
                    setPage={setPage}
                    handleGoBack={handleGoBack} // Pass the go back handler
                  />
                </TabPanel>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </div>*/}
