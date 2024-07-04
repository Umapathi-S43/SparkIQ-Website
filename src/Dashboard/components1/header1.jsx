import React from 'react';
import { FaBars, FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/dashboard_img/logo.png';

const Header1 = ({ toggleSidebar }) => {
  const [notificationCount, setNotificationCount] = React.useState(2);
  const [userName, setUserName] = React.useState('Umapathi Sakirevulapalli');
  const navigate = useNavigate();

  const getProfileInitials = (name) => {
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
    <div className="flex justify-between items-center p-4 pt-3 relative w-full z-10 lg:relative lg:w-auto ">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="lg:hidden p-2 focus:outline-none">
          <FaBars size={24} />
        </button>
        <img src={logo} alt="Logo" className="w-[120px] h-[70px] object-contain lg:w-[167px] lg:h-[98px] lg:ml-4" />
      </div>
      <div className="flex items-center space-x-2 lg:space-x-4 mr-1 lg:mr-10">
        <div className="relative flex items-center justify-center border border-[#FCFCFC] w-[50px] h-[50px] max-sm:w-[44px]  max-sm:h-[44px] lg:w-[60px] lg:h-[60px] bg-[rgba(252, 252, 252, 0.25)] shadow-md rounded-2xl">
          <div className="w-[30px] h-[32px] lg:w-[38px] lg:h-[40px] bg-[#00A0F5]  max-sm:w-[28px] max-sm:h-[28px] shadow-lg rounded-xl flex items-center justify-center">
            <FaBell className="text-white" />
            {notificationCount > 0 && (
              <div className="absolute top-0 right-0 bg-[#1138AC] text-white border border-[#FCFCFC] rounded-full w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center text-xs">
                {notificationCount}
              </div>
            )}
          </div>
        </div>
        <div 
          className="relative flex items-center justify-center border border-[#FCFCFC] w-[50px] h-[50px] max-sm:w-[44px]  max-sm:h-[44px] lg:w-[60px] lg:h-[60px] bg-[rgba(252, 252, 252, 0.25)] shadow-md rounded-2xl cursor-pointer"
          onClick={handleProfileClick}
        >
          <div className="w-[32px] h-[32px] max-sm:w-[30px] max-sm:h-[28px] lg:w-[40px] lg:h-[40px] bg-[#FCFCFC] shadow-lg rounded-xl flex items-center justify-center text-[#082A66] font-bold">
            {getProfileInitials(userName)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header1;
