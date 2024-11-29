import React, { useEffect, useState } from 'react';
import { FaBars, FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import logo from '../../assets/dashboard_img/logo.png';

const Header = ({ toggleSidebar }) => {
  const [notificationCount, setNotificationCount] = useState(2);
  const [userName, setUserName] = useState(''); // Initially empty
  const [totalImages, setTotalImages] = useState(150); // Total number of images
  const [completedImages, setCompletedImages] = useState(110); // Number of completed images
  const [hover, setHover] = useState(false); // Hover state
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

  const progressPercentage = Math.floor((completedImages / totalImages) * 100);

  return (
    <div className="flex justify-between items-center p-2 pt-2 relative w-full z-10 lg:relative lg:w-auto">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="lg:hidden p-2 focus:outline-none">
          <FaBars size={20} />
        </button>
        <img src={logo} alt="Logo" className="w-[100px] h-[60px] object-contain lg:w-[140px] lg:h-[80px] lg:ml-4" />
      </div>
      <div className="flex items-center space-x-2 lg:space-x-3 mr-1 lg:mr-8">
        {/* Circular Progress with Hover */}
        <div
          className="relative flex items-center justify-center"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            {/* Background Circle (Gray 300) */}
            <CircularProgress
              variant="determinate"
              value={100}
              sx={{
                color: '#E0E0EF', // Gray 300 color
                width: '50px !important',
                height: '50px !important',
                position: 'absolute',
              }}
            />
            {/* Active Circle (#00A0F5) */}
            <CircularProgress
              variant="determinate"
              value={progressPercentage}
              sx={{
                color: '#00A0F5',
                width: '50px !important',
                height: '50px !important',
              }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {hover ? (
                <Typography
                  variant="caption"
                  component="div"
                  sx={{ fontWeight: 'bold', color: 'gray' }}
                >
                  {`${totalImages - completedImages} left`}
                </Typography>
              ) : (
                <Typography
                  variant="caption"
                  component="div"
                  sx={{ fontWeight: 'bold', color: 'gray' }}
                >
                  {`${progressPercentage}%`}
                </Typography>
              )}
            </Box>
          </Box>
        </div>

        {/* Notification icon */}
        <div className="relative flex items-center justify-center border border-[#FCFCFC] w-[40px] h-[40px] max-sm:w-[36px] max-sm:h-[36px] lg:w-[50px] lg:h-[50px] bg-[rgba(252, 252, 252, 0.25)] shadow-md rounded-2xl">
          <div className="w-[24px] h-[24px] lg:w-[30px] lg:h-[30px] bg-[#00A0F5] max-sm:w-[22px] max-sm:h-[22px] shadow-lg rounded-xl flex items-center justify-center">
            <FaBell className="text-white" />
            {notificationCount > 0 && (
              <div className="absolute top-0 right-0 bg-[#1138AC] text-white border border-[#FCFCFC] rounded-full w-3 h-3 lg:w-4 lg:h-4 flex items-center justify-center text-xs">
                {notificationCount}
              </div>
            )}
          </div>
        </div>

        {/* Profile icon */}
        <div
          className="relative flex items-center justify-center border border-[#FCFCFC] w-[40px] h-[40px] max-sm:w-[36px] max-sm:h-[36px] lg:w-[50px] lg:h-[50px] bg-[rgba(252, 252, 252, 0.25)] shadow-md rounded-2xl cursor-pointer"
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
