import React, { useEffect, useState } from 'react';
import { FaBars, FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/dashboard_img/logo.png';

const Header = ({ toggleSidebar }) => {
  const [notificationCount, setNotificationCount] = useState(2);
  const [userName, setUserName] = useState(''); // Initially empty
  const navigate = useNavigate();

  // Retrieve the userName from localStorage when the component mounts
  useEffect(() => {
    const storedUserName = localStorage.getItem('username'); // Use 'username' with lowercase 'n'
    if (storedUserName) {
      setUserName(storedUserName); // Set the retrieved userName to the state
    } else {
      console.log("No userName found in localStorage");
    }
  }, []); // Empty dependency array ensures this runs once when the component mounts

  const getProfileInitials = (name) => {
    if (!name) return ''; // Handle case where name is undefined or empty
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    } else {
      return nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase();
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <div className="flex justify-between items-center p-2 pt-2 relative w-full z-10 lg:relative lg:w-auto">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="lg:hidden p-2 focus:outline-none">
          <FaBars size={20} />
        </button>
        <img src={logo} alt="Logo" className="w-[100px] h-[60px] object-contain lg:w-[140px] lg:h-[80px] lg:ml-4" />
      </div>
      <div className="flex items-center space-x-2 lg:space-x-3 mr-1 lg:mr-8">
        <div className="relative flex items-center justify-center border border-[#FCFCFC] w-[40px] h-[40px] max-sm:w-[36px]  max-sm:h-[36px] lg:w-[50px] lg:h-[50px] bg-[rgba(252, 252, 252, 0.25)] shadow-md rounded-2xl">
          <div className="w-[24px] h-[24px] lg:w-[30px] lg:h-[30px] bg-[#00A0F5] max-sm:w-[22px] max-sm:h-[22px] shadow-lg rounded-xl flex items-center justify-center">
            <FaBell className="text-white" />
            {notificationCount > 0 && (
              <div className="absolute top-0 right-0 bg-[#1138AC] text-white border border-[#FCFCFC] rounded-full w-3 h-3 lg:w-4 lg:h-4 flex items-center justify-center text-xs">
                {notificationCount}
              </div>
            )}
          </div>
        </div>
        <div 
          className="relative flex items-center justify-center border border-[#FCFCFC] w-[40px] h-[40px] max-sm:w-[36px]  max-sm:h-[36px] lg:w-[50px] lg:h-[50px] bg-[rgba(252, 252, 252, 0.25)] shadow-md rounded-2xl cursor-pointer"
          onClick={handleProfileClick}
        >
          <div className="w-[24px] h-[24px] max-sm:w-[22px] max-sm:h-[22px] lg:w-[30px] lg:h-[30px] bg-[#FCFCFC] shadow-lg rounded-xl flex items-center justify-center text-[#082A66] font-bold">
            {getProfileInitials(userName)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
