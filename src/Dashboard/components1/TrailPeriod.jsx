import {React, useState, useEffect} from 'react';
import { useMediaQuery } from 'react-responsive';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../components/utils/Constant';
import { jwtToken } from '../../components/utils/jwtToken';
import axios from "axios";

const TrialPeriodBoxSmall = () => {
  const [creativesLeft, setCreativesLeft] = useState(10);
  const [totalImages, setTotalImages] = useState(150);
  const percentage = (creativesLeft / totalImages) * 100;
  const navigate = useNavigate();

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${baseUrl}/user/info`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      const userInfo = response.data.data;
      setTotalImages(userInfo.totalImages || 150);
      let leftImages= userInfo.totalImages - userInfo.generatedImages;
      setCreativesLeft(leftImages);
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div className="flex items-center justify-between bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] border-2 border-[#FCFCFC] rounded-xl p-4 mb-4" style={{ width: '200px', height: '150px' }}>
      <div style={{ width: '100px', height: '100px', position: 'relative' }}>
        <CircularProgressbar
          value={percentage}
          styles={buildStyles({
            pathColor: "#00A0F5",
            trailColor: "#FCFCFC",
            strokeLinecap: "round",
            strokeWidth: 12,
          })}
        />
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            backgroundColor: 'white',
            borderRadius: '50%',
            width: '41px',
            height: '41px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <span className="text-xl">{creativesLeft}</span>
        </div>
      </div>
      <div className="ml-4">        
      <p>Unlock the premium features!.....</p>
        <h2 className="font-bold text-xl mt-2">
          <button onClick={() => navigate('/upgrade')}>Upgrade Now</button>
        </h2>
      </div>
    </div>
  );
};

const TrialPeriodBoxLarge = () => {
  const [creativesLeft, setCreativesLeft] = useState(1);
  const [totalImages, setTotalImages] = useState(150);
  const navigate = useNavigate();
  const percentage = (creativesLeft / totalImages) * 100;

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${baseUrl}/user/info`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      const userInfo = response.data.data;
      setTotalImages(userInfo.totalImages || 150);
      
      let leftImages= userInfo.totalImages - userInfo.generatedImages;
      setCreativesLeft(leftImages);
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div className="flex items-center justify-between bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] border-2 border-[#FCFCFC] rounded-xl p-4 mb-4" style={{ width: '300px', height: '150px' }}>
      <div style={{ width: '100px', height: '100px', position: 'relative' }}>
        <CircularProgressbar
          value={percentage}
          styles={buildStyles({
            pathColor: "#00A0F5",
            trailColor: "#FCFCFC",
            strokeLinecap: "round",
            strokeWidth: 12,
          })}
        />
        <div
          style={{
            position: 'absolute',
            top: '41%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            backgroundColor: 'white',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <span>{creativesLeft}</span>
          <span className="text-sm text-gray-500">Left</span>
        </div>
      </div>
      <div className="ml-4">
        <p>Unlock the premium features!.....</p>
        <h2 className="font-bold text-2xl mt-2">
          <button onClick={() => navigate('/upgrade')}>Upgrade Now</button>
        </h2>
      </div>
    </div>
  );
};

const TrialPeriodBox = () => {
  const isSmallScreen = useMediaQuery({ query: '(max-width: 530px)' });

  return isSmallScreen ? (
    <TrialPeriodBoxSmall />
  ) : (
    <TrialPeriodBoxLarge />
  );
};

export default TrialPeriodBox;
