import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/dashboard_img/logo.png';
import { FaBell } from 'react-icons/fa';

const Header = () => {
    const [notificationCount, setNotificationCount] = useState(2);
    const [userName, setUserName] = useState('Umapathi Sakirevulapalli');
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
        navigate('/profile'); // Adjust the path to your profile route
    };

    return (
        <div className=" left-0 top-3 ml-0 mb-0 flex flex-col justify-between">
            <div className='flex justify-between pl-4'>
                <img src={logo} alt="Logo" className="w-[167px] h-[98px] object-contain pb-3" />
                <header className=" top-0 right-8 mr-10 w-[95%] h-20 flex justify-end z-10 p-4">
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
                        <div 
                            className="relative flex items-center justify-center border border-[#FCFCFC] w-[60px] h-[60px] bg-[rgba(252, 252, 252, 0.25)] shadow-md rounded-2xl cursor-pointer"
                            onClick={handleProfileClick}
                        >
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

export default Header;
