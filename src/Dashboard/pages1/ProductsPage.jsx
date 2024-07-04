import React from 'react';
import Sidebar from '../components1/sidebar';
import Header from '../components1/header';
import Products from '../components1/Products';

const ProductsPage = () => {
  return (
    <div className="bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] flex flex-col min-h-screen overflow-y-hidden">
        <div className='m-4 mb-0 p-4 border-2 border-[#FCFCFC] rounded-3xl overflow-y-hidden'>
      <Header />
      <div className="flex flex-grow overflow-y-hidden">
        <Sidebar />
        <div className="flex-grow p-4">
          <Products />
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProductsPage;
