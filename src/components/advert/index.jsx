import { useState } from "react";
import Header from "../../Dashboard/components1/header";
import Sidebar from "../../Dashboard/components1/sidebar";
import GenerateAd from "./GenerateAd";
import AdPreview from "./AdPreview";
import LauchCampaign from "./launchCampaign";
import "./index.css";

export default function AdCampaign() {
  const [pages, setPages] = useState({
    generateAd: true,
    adPreview: false,
    lauchCampaign: false,
  });

  const setPage = (page) => {
    setPages({
      generateAd: false,
      adPreview: false,
      lauchCampaign: false,
      [page]: true,
    });
  };

  return (
    <div className="bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] flex flex-col min-h-screen">
        <div className='m-4 mb-0 p-4 border-2 border-[#FCFCFC] rounded-3xl'>
      <Header />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-grow">

      {pages.generateAd && <GenerateAd setPage={setPage} pages={pages} />}
      {pages.adPreview && <AdPreview setPage={setPage} />}
      {pages.lauchCampaign && <LauchCampaign setPage={setPage} />}
    </div>
    </div>
    </div>
    </div>
  );
}
