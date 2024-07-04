import React from 'react';
import Sidebar from '../components1/sidebar';
import BrandSetup from '../components1/BrandSetup';
import Header from '../components1/header';

const BrandSetupPage = () => {
  return (
    <div className="bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] flex flex-col min-h-screen">
        <div className='m-4 mb-0 p-4 border-2 border-[#FCFCFC] rounded-3xl'>
      <Header />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-grow p-4 ">
          <BrandSetup />
        </div>
      </div>
    </div>
    </div>
  );
};

export default BrandSetupPage;
