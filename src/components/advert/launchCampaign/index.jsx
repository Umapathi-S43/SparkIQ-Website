import React, { useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

import Targetting from "./Targetting";
import CampaignSetting from "./CampaignSetting";
import brandImage from '../../../assets/dashboard_img/brand_img.png';

export default function LaunchCampaign({ setPage }) {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <div className="flex-grow mt-4">
      <div className="w-full max-w-6xl mx-auto border border-[#fcfcfc] rounded-3xl flex flex-col items-center">
        <div className="w-full bg-[rgba(252,252,252,0.40)] rounded-t-3xl p-1 mb-4">
          <span className="flex items-center ml-2 gap-4">
            <img src="/icon1.svg" alt="" className="w-14" />
            <span className="flex flex-col">
              <h4 className="text-[#082A66] font-bold text-xl">Launch Campaign</h4>
              <p className="text-[#374151] pr-40">
                Effortless Campaign Launch with our unique AI
              </p>
            </span>
            <img src={brandImage} alt="Brand Banner" className="w-[180px] h-[90px] ml-72 relative bottom-[-6px] pb-0" />
          </span>
        </div>

        <div className="sticky overflow-auto w-full">
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
            <div className="p-6 flex items-center gap-3">
              <img src="/Border.png" alt="" className="lg:w-1/2" />
              <div className="w-1/2 px-3">
                <TabPanel>
                  <CampaignSetting setPage={setPage} />
                </TabPanel>
                <TabPanel>
                  <Targetting setPage={setPage} />
                </TabPanel>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
