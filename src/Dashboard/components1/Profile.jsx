import React, { useState, useEffect } from 'react';
import pimage from '../../assets/dashboard_img/brand_img.png';
import primg from '../../assets/dashboard_img/profileimage.png';
import blogo from '../../assets/dashboard_img/brandlogo.png';
import mlogo from '../../assets/dashboard_img/metasvg.svg';
import glogo from '../../assets/dashboard_img/glogosvg.svg';
import linkimg from '../../assets/dashboard_img/link2.png';
import TrialPeriodBox from './TrailPeriod';
import axios from "axios";
import { baseUrl } from "../../components/utils/Constant";
import { jwtToken } from "../../components/utils/jwtToken";

const Profile = () => {
  const totalDays = 10; // Total trial days
  const [daysLeft, setDaysLeft] = useState(totalDays);
  const [selectedSection, setSelectedSection] = useState('accountDetails');
  const [profileImage, setProfileImage] = useState(primg);

  const [username, setUsername] = useState('');
const [email, setEmail] = useState('');
const [phoneNumber, setPhoneNumber] = useState('');
const [userBrands, setUserBrands] = useState([]); // List of brands
const [selectedBrand, setSelectedBrand] = useState(''); // Selected brand name
const [brandDescription, setBrandDescription] = useState(''); // Selected brand description
const [brandLogo, setBrandLogo] = useState(''); // Selected brand logo



  // Calculate the expiration date
  const trialStartDate = new Date();
  const trialEndDate = new Date(trialStartDate);
  trialEndDate.setDate(trialStartDate.getDate() + totalDays);

  useEffect(() => {
    const interval = setInterval(() => {
      setDaysLeft((prevDays) => Math.max(prevDays - 1, 0));
    }, 1000 * 60 * 60 * 24); // Decrease day every 24 hours

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedSection === 'accountDetails') {
      const fetchProfileInfo = async () => {
        try {
          const res = await axios.get(`${baseUrl}/profile/info`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });
  
          const data = res.data.data; // Accessing the `data` object from the response
  
          // Populate the fields with the fetched data
          setUsername(data.name);
          setEmail(data.email);
          setPhoneNumber(data.phoneNumber);
        } catch (error) {
          console.error('Error fetching profile info:', error);
        }
      };
  
      fetchProfileInfo();
    }

    if (selectedSection === 'brandInformation') {
      const fetchBrandInfo = async () => {
        try {
          const companyId = 123; // Hardcoded company ID
          const res = await axios.get(`${baseUrl}/brand/company/${companyId}`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });
  
          const brandsData = res.data.data; // Assuming "data" holds the array of brands
  
          if (brandsData && brandsData.length > 0) {
            setUserBrands(brandsData);
            setSelectedBrand(brandsData[0].name); // Set the first brand as default
            setBrandDescription(brandsData[0].description); // Set the first brand's description
            setBrandLogo(brandsData[0].logoURL); // Set the first brand's logo URL
          }
        } catch (error) {
          console.error('Error fetching brand info:', error);
        }
      };
  
      fetchBrandInfo();
    }
  }, [selectedSection]);
  
  
  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBrandChange = (event) => {
    const selected = event.target.value;
    setSelectedBrand(selected);
    const brand = userBrands.find((brand) => brand.name === selected);
    setBrandDescription(brand.description);
    setBrandLogo(brand.logoURL);
  };
  


  return (
    <div className="flex-grow overflow-auto hide-scrollbar" style={{ maxHeight: '80vh' }}>
      <div className="lg:max-w-6xl w-full mx-auto flex flex-col gap-4 border border-[#FCFCFC] rounded-3xl pb-4">
        <div className="flex justify-between items-center rounded-t-3xl bg-[rgba(252,252,252,0.40)] lg:p-6 p-4 relative">
          <span className="flex items-center lg:gap-4 gap-2">
            <img src="/icon1.svg" alt="Icon" className="lg:w-14 w-12" />
            <span className="flex flex-col">
              <h4 className="text-[#082A66] font-bold lg:text-xl text-lg">Profile</h4>
              <p className="text-[#374151] text-xs lg:text-base">Modify or create your personal profile</p>
            </span>
          </span>
          <img src={pimage} alt="Decoration" className="absolute bottom-0 right-4 lg:right-24 w-24 lg:w-44 hidden md:block" />
        </div>
        <div className="flex flex-col gap-2 p-2 lg:p-4 lg:pt-8 lg:m-4 m-2 lg:mx-12 border border-[#FCFCFC] rounded-3xl overflow-auto hide-scrollbar lg:max-h-[52vh]">
          <div className="flex items-center justify-center lg:m-0">
            <div className="flex flex-col sm:flex-row gap-2 items-center justify-center bg-[rgba(252,252,252,0.25)] border border-[#FCFCFC] rounded-3xl p-2">
              <button
                className={`px-4 py-1 lg:px-4 lg:py-2 rounded-2xl text-[#082A66] outline-none text-nowrap font-bold sm:w-auto ${selectedSection === 'accountDetails' ? 'bg-[#FCFCFC]' : 'bg-transparent text-gray-700'}`}
                onClick={() => handleSectionChange('accountDetails')}
              >
                Account Details
              </button>
              <button
                className={`px-4 py-1 lg:px-4 lg:py-2 rounded-2xl outline-none text-[#082A66] font-bold text-nowrap ${selectedSection === 'brandInformation' ? 'bg-[#FCFCFC]' : 'bg-transparent text-gray-700'}`}
                onClick={() => handleSectionChange('brandInformation')}
              >
                Brand Information
              </button>
              <button
                className={`px-4 py-1 lg:px-4 lg:py-2 rounded-2xl outline-none text-[#082A66] font-bold text-nowrap ${selectedSection === 'channels' ? 'bg-[#FCFCFC]' : 'bg-transparent text-gray-700'}`}
                onClick={() => handleSectionChange('channels')}
              >
                Channels
              </button>
            </div>
          </div>

          {selectedSection === 'accountDetails' && (
          <div className="p-4 lg:p-6 pb-0 rounded-xl bg-[rgba(252,252,252,0.25)] mt-4 lg:mt-6 mb-4 lg:mb-6 mx-2 sm:mx-4 lg:mx-12 border border-[#FCFCFC]">
            <h3 className="text-xl lg:text-2xl font-bold mb-2 lg:mb-4 mt-2">Account Details</h3>
            <div className="flex gap-4 lg:gap-6 items-center flex-col sm:flex-row">
              <img src={profileImage} alt="Profile" className="w-16 h-16 lg:w-24 lg:h-24 rounded-full mb-4 pb-0" />
              <input type="file" id="imageUpload" style={{ display: 'none' }} onChange={handleImageUpload} />
              <button
                className="custom-button p-2 lg:pl-6 lg:pr-6 text-white rounded-2xl shadow-2xl flex justify-center w-fit text-nowrap"
                onClick={() => document.getElementById('imageUpload').click()}
              >
                Upload New Picture
              </button>
            </div>
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex gap-4 lg:gap-6 flex-wrap">
                <div className="w-full sm:w-1/3 lg:w-1/3">
                  <label className="block text-gray-400 font-semibold">Username</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-2xl focus:ring-2 focus-within:ring-blue-400 focus:outline-none cursor-not-allowed"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    readOnly
                  />
                </div>
                <div className="w-full sm:w-1/3 lg:w-1/3">
                  <label className="block text-gray-400 font-semibold">Email ID</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-2xl focus:ring-2 focus-within:ring-blue-400 focus:outline-none cursor-not-allowed"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    readOnly
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 font-semibold">Phone Number</label>
                <input
                  type="text"
                  className="w-full sm:w-1/3 lg:w-1/3 px-4 py-2 border rounded-2xl focus:ring-2 focus-within:ring-blue-400 focus:outline-none cursor-not-allowed"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-gray-400">Account ID</label>
                <input
                  type="text"
                  className="w-full sm:w-1/3 lg:w-1/3 px-4 py-2 border rounded-2xl font-bold text-gray-400 outline-none"
                  value="2423124124214214124"
                  readOnly
                />
              </div>
              <button className="custom-button p-2 pl-6 pr-6 text-white rounded-2xl shadow-2xl flex justify-center w-fit">
                Update
              </button>
            </div>
            <div className="flex justify-end items-center mt-4">
              <TrialPeriodBox daysLeft={daysLeft} totalDays={totalDays} trialEndDate={trialEndDate} />
            </div>
          </div>
        )}

        {selectedSection === 'brandInformation' && userBrands.length > 0 && (
          <div className="p-4 lg:p-6 pb-0 rounded-xl bg-[rgba(252,252,252,0.25)] mt-4 lg:mt-6 mb-4 lg:mb-6 mx-2 sm:mx-4 lg:mx-12 border border-[#FCFCFC]">
            <h3 className="text-xl lg:text-2xl font-bold mb-2 lg:mb-4 mt-2 text-[#1E1154]">Brand Information</h3>

            {/* Brand Logo */}
            <div className="flex items-center gap-4 flex-col sm:flex-row">
              <p className="text-[#1E1154] font-semibold text-lg lg:text-xl">Brand Logo</p>
              <div className="bg-[rgba(252,252,252,0.25)] border border-[#FCFCFC] p-2 rounded-xl">
                <img src={brandLogo} alt="Brand Logo" className="w-8 h-8 lg:w-10 lg:h-10 rounded-full pb-0" />
              </div>
            </div>

            {/* Brand Name Dropdown */}
            <div className="mt-4 w-full sm:w-2/5">
              <label className="block text-[#1E1154] font-semibold">Brand Name</label>
              <select
                value={selectedBrand}
                onChange={handleBrandChange}
                className="w-full px-4 py-2 border rounded-2xl mt-2 focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
              >
                {userBrands.map((brand) => (
                  <option key={brand.id} value={brand.name}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand Description */}
            <div className="flex flex-col gap-4 mt-4 w-full sm:w-2/5 text-justify">
              <div>
                <label className="block text-[#1E1154] font-semibold">Brand Description</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-2xl h-32 lg:h-40 mt-2 focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                  value={brandDescription}
                  onChange={(e) => setBrandDescription(e.target.value)}
                  readOnly
                />
              </div>
            </div>

            {/* Update Button */}
            <button className="custom-button p-2 pl-6 pr-6 text-white rounded-2xl shadow-2xl flex justify-center w-fit mt-4">
              Update
            </button>

            {/* Trial Period Box */}
            <div className="flex justify-end items-center mt-4">
              <TrialPeriodBox daysLeft={daysLeft} totalDays={totalDays} trialEndDate={trialEndDate} />
            </div>
          </div>
        )}



          {selectedSection === 'channels' && (
            <div className="p-2 lg:p-6 pb-0 rounded-xl bg-[rgba(252,252,252,0.25)] mt-4 lg:mt-6 mb-4 lg:mb-6 mx-2 sm:mx-4 lg:mx-12 border border-[#FCFCFC]">
              <h3 className="text-xl lg:text-2xl font-bold mb-2 lg:mb-4 mt-2">Channels</h3>
              <div className="flex flex-col gap-4 w-full lg:w-2/3 md:w-2/3 bg-[rgba(252,252,252,0.25)] border border-[#FCFCFC] shadow-md p-4 lg:p-8 pb-6 rounded-2xl">
                <div className="flex flex-col sm:flex-row items-center justify-between bg-[rgba(252,252,252,0.35)] border border-[#FCFCFC] p-4 rounded-xl shadow">
                  <span className="flex items-center gap-4">
                    <img src={mlogo} alt="Meta Account" className="w-6 h-6 bg-no-repeat lg:m-0 mb-4" />
                    <span className="text-gray-800 lg:m-0 mb-4">Meta Account</span>
                  </span>
                  <span className="flex items-center gap-2 text-green-500 bg-[#A7F3D0] px-6 pt-3 pb-2 rounded-md">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span>Active</span>
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between bg-[rgba(252,252,252,0.35)] border border-[#FCFCFC] p-4 rounded-xl shadow">
                  <span className="flex items-center gap-4">
                    <img src={glogo} alt="Google Account" className="w-6 h-6 bg-no-repeat lg:m-0 mb-4" />
                    <span className="text-gray-800 lg:m-0 mb-4">Google Account</span>
                  </span>
                  <button className="px-4 flex justify-evenly py-2 bg-gradient-to-r from-[#283048] to-[#859398] text-white rounded-md">
                    <img src={linkimg} alt="link" className="flex justify-center w-3 h-4 gap-2 mr-1 mt-1" />Connect
                  </button>
                </div>
                <button className="custom-button p-2 pl-6 pr-6 text-white rounded-2xl shadow-2xl flex justify-center w-fit">Update</button>
              </div>
              <div className="flex lg:justify-end md:justify-end justify-center items-center mt-4">
                <TrialPeriodBox daysLeft={daysLeft} totalDays={totalDays} trialEndDate={trialEndDate} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
