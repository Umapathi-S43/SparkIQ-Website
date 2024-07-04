import React from 'react';
import Sidebar from '../components1/sidebar';
import SocialMediaConnect from '../components1/socialmedia';
import Header from '../components1/header';

const SocialMedia = () => {
  return (
    <div className="bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] flex flex-col min-h-screen">
        <div className='m-4 p-4 border-2 border-[#FCFCFC] rounded-3xl'>
      <Header />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-grow p-2">
          <SocialMediaConnect />
        </div>
      </div>
    </div>
    </div>
  );
};

export default SocialMedia;
