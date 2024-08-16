import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import logo from '../../assets/dashboard_img/logo.png';
import homeIcon from '../../assets/dashboard_img/house.svg';
import brandsIcon from '../../assets/dashboard_img/brand.svg';
import campaignsIcon from '../../assets/dashboard_img/camp.svg';
import productsIcon from '../../assets/dashboard_img/bag.svg';
import viewPlanIcon from '../../assets/dashboard_img/plan.svg';
import profileIcon from '../../assets/dashboard_img/user.svg';
import signoutIcon from '../../assets/dashboard_img/signout.svg';
import savedproducts from '../../assets/dashboard_img/savedProducts.svg';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [selectedItem, setSelectedItem] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Home', icon: homeIcon, path: '/homepage' },
    { name: 'Brands', icon: brandsIcon, path: '/brandspage' },
    { name: 'Campaigns', icon: campaignsIcon, path: '/Ecampaigns' },
    { name: 'Products', icon: productsIcon, path: '/productspage' },
    { name: 'Saved Products', icon: savedproducts, path: '/savedproductspage' },
    { name: 'View Plan', icon: viewPlanIcon, path: '/viewplans' },
    { name: 'Profile', icon: profileIcon, path: '/profile' }
  ];

  useEffect(() => {
    const path = location.pathname;
    const currentItem = navItems.find(item => path.includes(item.path));
    if (currentItem) {
      setSelectedItem(currentItem.name);
    }
  }, [location.pathname]);

  const handleNavigation = (item) => {
    setSelectedItem(item.name);
    navigate(item.path, { replace: true });
    if (window.innerWidth < 1024) {
      toggleSidebar(); // Close sidebar after navigation on small screens
    }
  };

  const handleSignOut = () => {
    navigate('/login');
  };

  return (
    <div className={`fixed inset-0 z-50 lg:relative lg:inset-auto lg:h-auto lg:w-64 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="lg:hidden w-full h-full bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2]">
        <div className="relative w-full h-full max-w-5xl lg:max-w-full p-4" style={{ margin: 'auto', borderRadius: '1rem' }}>
          <div className="relative w-full h-full max-w-5xl p-4 bg-[#FCFCFC] bg-opacity-20 rounded-2xl border-2 border-[#FCFCFC] lg:bg-transparent lg:border-none">
            <div className="flex justify-between items-center p-4 lg:hidden rounded-t-2xl">
              <img src={logo} alt="Logo" className="w-[167px] h-[88px] object-contain" />
              <button onClick={toggleSidebar} className="p-2 focus:outline-none">
                <FaTimes size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-2 p-4 mt-0 lg:mt-0">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className={`group w-full p-3 pl-6 rounded-3xl flex items-center cursor-pointer transition-colors duration-200 ${
                    selectedItem === item.name ? 'bg-[#1547DB] text-white' : 'text-gray-700 hover:bg-[#1547DB] hover:text-white'
                  }`}
                  onClick={() => handleNavigation(item)}
                >
                  <div
                    className={`w-[24px] h-[24px] rounded-md flex items-center justify-center ${
                      selectedItem === item.name ? 'bg-[#1138AC]' : 'bg-[#0086CD] group-hover:bg-[#1138AC]'
                    }`}
                  >
                    <img src={item.icon} alt={item.name} />
                  </div>
                  <span className="ml-4">{item.name}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto p-4">
              <div
                className="group text-gray-700 w-full p-3 pl-6 rounded-3xl flex items-center cursor-pointer hover:bg-[#1547DB] hover:text-white"
                onClick={handleSignOut}
              >
                <div className="w-[24px] h-[24px] rounded-md flex items-center justify-center bg-[#0086CD] group-hover:bg-[#1138AC]">
                  <img src={signoutIcon} alt="Sign Out" className="w-[14px] h-[14px]" />
                </div>
                <span className="ml-4">Sign Out</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block lg:bg-transparent ml-0 pl-0">
        <div className="relative w-full h-full max-w-5xl lg:-mt-6 lg:max-w-64 p-4 lg:p-0">
          <div className="relative w-full h-full max-w-5xl p-4 bg-[#FCFCFC] bg-opacity-20 rounded-2xl border-2 border-[#FCFCFC] lg:bg-transparent lg:border-none">
            <div className="flex flex-col gap-3 p-4 pl-0">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className={`group w-full p-3 pl-6 rounded-3xl flex items-center cursor-pointer transition-colors duration-200 ${
                    selectedItem === item.name ? 'bg-[#1547DB] text-white' : 'text-gray-700 hover:bg-[#1547DB] hover:text-white'
                  }`}
                  onClick={() => handleNavigation(item)}
                >
                  <div
                    className={`w-[24px] h-[24px] rounded-md flex items-center justify-center ${
                      selectedItem === item.name ? 'bg-[#1138AC]' : 'bg-[#0086CD] group-hover:bg-[#1138AC]'
                    }`}
                  >
                    <img src={item.icon} alt={item.name} />
                  </div>
                  <span className="ml-4">{item.name}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto ml-0 pl-0">
              <div
                className="group text-gray-700 w-52 p-3 pl-6 rounded-3xl flex items-center cursor-pointer hover:bg-[#1547DB] hover:text-white"
                onClick={handleSignOut}
              >
                <div className="w-[24px] h-[24px] rounded-md flex items-center justify-center bg-[#0086CD] group-hover:bg-[#1138AC]">
                  <img src={signoutIcon} alt="Sign Out" className="w-[14px] h-[14px]" />
                </div>
                <span className="ml-4">Sign Out</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
