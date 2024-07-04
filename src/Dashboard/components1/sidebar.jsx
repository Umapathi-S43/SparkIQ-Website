import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/dashboard_img/logo.png';
import homeIcon from '../../assets/dashboard_img/house.svg';
import brandsIcon from '../../assets/dashboard_img/brand.svg';
import campaignsIcon from '../../assets/dashboard_img/camp.svg';
import productsIcon from '../../assets/dashboard_img/bag.svg';
import viewPlanIcon from '../../assets/dashboard_img/plan.svg';
import profileIcon from '../../assets/dashboard_img/user.svg';
import signoutIcon from '../../assets/dashboard_img/signout.svg';

const Sidebar = () => {
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

  const navItems = [
    { name: 'Home', icon: homeIcon, path: '/homepage' },
    { name: 'Brands', icon: brandsIcon, path: '/brandspage' },
    { name: 'Campaigns', icon: campaignsIcon, path: '/campaigns' },
    { name: 'Products', icon: productsIcon, path: '/productspage' },
    { name: 'View Plan', icon: viewPlanIcon, path: '/view-plan' },
    { name: 'Profile', icon: profileIcon, path: '/profile' }
  ];

  return (
    <div className="flex flex-col">
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
              <img src={item.icon} alt={item.name} />
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
    </div>
  );
};

export default Sidebar;
