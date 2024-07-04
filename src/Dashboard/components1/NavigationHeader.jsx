import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import logo from '../../assets/dashboard_img/logo.png';
import homeIcon from '../../assets/dashboard_img/home.png';
import brandsIcon from '../../assets/dashboard_img/brandicon.png';
import campaignsIcon from '../../assets/dashboard_img/bullhorn.png';
import productsIcon from '../../assets/dashboard_img/producticon.png';
import viewPlanIcon from '../../assets/dashboard_img/viewplanicon.png';
import profileIcon from '../../assets/dashboard_img/profileicon.png';
import signoutIcon from '../../assets/dashboard_img/signout.png';

const NavigationHeader = () => {
  const [notificationCount, setNotificationCount] = useState(2);
  const [userName, setUserName] = useState('Umapathi Sakirevulapalli');
  const [selectedItem, setSelectedItem] = useState('Home');
  const [hoveredItem, setHoveredItem] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set the selected item based on the current location
    const path = location.pathname;
    const currentItem = navItems.find(item => path.includes(item.path));
    if (currentItem) {
      setSelectedItem(currentItem.name);
    } else {
      setSelectedItem('Home');
    }
  }, [location.pathname]);

  const handleNavigation = (item) => {
    setSelectedItem(item.name);
    navigate(item.path);
  };

  const handleSignOut = () => {
    // Add your real-time signout mechanism here
    navigate('/login');
  };

  const getProfileInitials = (name) => {
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    } else {
      return nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase();
    }
  };

  const navItems = [
    { name: 'Home', icon: homeIcon, path: '/homepage' },
    { name: 'Brands', icon: brandsIcon, path: '/brands' },
    { name: 'Campaigns', icon: campaignsIcon, path: '/campaigns' },
    { name: 'Products', icon: productsIcon, path: '/products' },
    { name: 'View Plan', icon: viewPlanIcon, path: '/view-plan' },
    { name: 'Profile', icon: profileIcon, path: '/profile' }
  ];

  return (
    <div className="bg-[#D9E9F2] transition-colors duration-200 font-sans h-screen">
      <div className="fixed border-2 border-[#FCFCFC] rounded-3xl left-0 top-3 p-4 w-[98%] h-[96%] ml-4 mb-12 flex flex-col justify-between">
        <img src={logo} alt="Logo" className="w-[157px] h-[78px] object-contain pb-3 ml-1" />
        <div className="flex flex-col gap-2 flex-grow">
          {navItems.map((item) => (
            <div
              key={item.name}
              className={`w-[200px] h-[48px] p-2 rounded-[30px] flex items-center cursor-pointer transition-colors duration-200 ${
                (selectedItem === item.name || hoveredItem === item.name) ? 'bg-[#1547DB] text-white' : 'text-gray-700'
              } font-Regular text-md`}
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => handleNavigation(item)}
            >
              <div className={`w-[24px] h-[24px] rounded-[4px] flex items-center justify-center ml-[20px] mr-[16px] ${
                (selectedItem === item.name || hoveredItem === item.name) ? 'bg-[#1138AC]' : 'bg-[#0086CD]'
              }`}>
                <img src={item.icon} alt={item.name} className="w-[14px] h-[14px]" />
              </div>
              {item.name}
            </div>
          ))}
        </div>
        <div className="mt-auto">
          <div
            className="text-gray-700 text-md font-regular w-[208px] h-[48px] p-2 rounded-[30px] flex items-center cursor-pointer hover:bg-[#1547DB] hover:text-white"
            onClick={handleSignOut}
            onMouseEnter={() => setHoveredItem('Sign Out')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className={`w-[24px] h-[24px] rounded-[4px] flex items-center justify-center ml-[20px] mr-[16px] ${
              (selectedItem === 'Sign Out' || hoveredItem === 'Sign Out') ? 'bg-[#1138AC]' : 'bg-[#0086CD]'
            }`}>
              <img src={signoutIcon} alt="Sign Out" className="w-[14px] h-[14px]" />
            </div>
            Sign Out
          </div>
        </div>
        <header className="absolute top-0 right-8 w-[95%] h-20 flex justify-end z-10 p-4">
          <div className="flex gap-4">
            <div className="relative flex items-center justify-center border border-[#FCFCFC] w-[60px] h-[60px] bg-[rgba(252, 252, 252, 0.25)] shadow-md rounded-2xl">
              <div className="w-[38px] h-[40px] bg-[#00A0F5] shadow-lg rounded-xl flex items-center justify-center">
                <FaBell className="text-white" />
                {notificationCount > 0 && (
                  <div className="absolute top-0 right-0 bg-[#1138AC] text-white border border-[#FCFCFC] rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {notificationCount}
                  </div>
                )}
              </div>
            </div>
            <div className="relative flex items-center justify-center border border-[#FCFCFC] w-[60px] h-[60px] bg-[rgba(252, 252, 252, 0.25)] shadow-md rounded-2xl">
              <div className="w-[38px] h-[40px] bg-[#FCFCFC] shadow-lg rounded-xl flex items-center justify-center text-[#082A66] font-bold">
                {getProfileInitials(userName)}
              </div>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
};

export default NavigationHeader;
