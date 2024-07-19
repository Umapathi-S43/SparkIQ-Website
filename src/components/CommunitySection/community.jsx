import React from 'react';
import thub from '../../assets/dashboard_img/thub.svg';
import blitz from '../../assets/dashboard_img/blitz.svg';
import math from '../../assets/dashboard_img/mathlab.svg';

export default function Community() {
  return (
    <div className='w-full mb-10 font-roboto p-6'>
      <h1 className='text-center lg:text-5xl text-3xl font-bold py-6 pt-0 mb-6'>Incubation and Community</h1>
      <div className='flex flex-wrap justify-center gap-4 my-4'>
        <img src={thub} alt="T-HUB" className='w-38 h-38 transform transition-transform duration-500 hover:scale-110 m-2'/>
        <img src={math} alt="Math Logo" className='w-64 h-70 transform transition-transform duration-500 hover:scale-110 m-2'/>
        <img src={blitz} alt="Blitz" className='w-52 transform transition-transform duration-500 hover:scale-110 m-2'/>
      </div>
      <p className='lg:text-justify lg:px-3 lg:py-4 lg:text-xl text-md text-center'>
        The Blitz Cohort, facilitated by T-Hub, is an innovation intermediary and business incubator located in Raidurg, Hyderabad, Telangana, India.
        Operating on the triple helix model of innovation, T-Hub is a collaborative partnership between the Government of Telangana, three premier academic
        institutes in Hyderabad, and the private sector.
      </p>
    </div>
  );
}
