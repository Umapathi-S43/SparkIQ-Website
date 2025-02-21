import React, { useEffect, useState } from 'react';
import { FaBars, FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/dashboard_img/logo.png';
import axios from 'axios';
import { baseUrl } from '../../components/utils/Constant';
import { jwtToken } from '../../components/utils/jwtToken';

const Header = ({ toggleSidebar }) => {
    const [userName, setUserName] = useState('');
    const [totalImages, setTotalImages] = useState(150);
    const [completedImages, setCompletedImages] = useState(110);
    const [hover, setHover] = useState(false);
    const navigate = useNavigate();

    const fetchUserInfo = async () => {
        try {
            const response = await axios.get(`${baseUrl}/user/info`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });

            const userInfo = response.data.data;
            const storedUserName = localStorage.getItem('username'); // Use 'username' with lowercase 'n'
            if (storedUserName) {
                setUserName(storedUserName); // Set the retrieved userName to the state
            } else {
                console.log("No userName found in localStorage");
            } setTotalImages(userInfo.totalImages || 10);
            setCompletedImages(userInfo.generatedImages || 0);
        } catch (error) {
            console.error("Failed to fetch user info:", error);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const getProfileInitials = (name) => {
        if (!name) return ''; // Handle case where name is undefined or empty
        const nameParts = name.split(' ');
        if (nameParts.length === 1) {
            return nameParts[0].charAt(0).toUpperCase();
        } else {
            return nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase();
        }
    };

    const progressPercentage = Math.floor((completedImages / totalImages) * 100);

    const handleProfileClick = () => {
        navigate('/profile');
    };


    return (
        <div className="flex justify-between items-center p-2 pt-2 relative w-full z-10 lg:relative lg:w-auto">
            <div className="flex items-center">
                <button onClick={toggleSidebar} className="lg:hidden p-2 focus:outline-none">
                    <FaBars size={20} />
                </button>
                <img src={logo} alt="Logo" className="w-[100px] h-[60px] object-contain lg:w-[140px] lg:h-[80px] lg:ml-4" onClick={() => navigate('/homePage')} />
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
    );
};

export default Header;
