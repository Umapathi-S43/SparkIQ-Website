import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';
import congratsImage from '../../assets/dashboard_img/congrats_pc.svg'; // Update the path as per your project structure
import congratsBg from '../../assets/dashboard_img/congrats_bg.svg';

export default function Congrats() {
  const [showConfetti, setShowConfetti] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 40000); // 40 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleDashboardNavigation = () => {
    navigate('/homepage');
  };

  return (
    <div className="relative flex items-center justify-center h-screen bg-cover overflow-hidden" style={{ backgroundImage: `url(${congratsBg})` }}>
      {showConfetti && (
        <div className="absolute inset-0">
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        </div>
      )}
      <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between p-8">
          <div className="text-center lg:text-left lg:w-1/2">
            <h1 className="text-4xl font-bold mb-4">Congratulations!</h1>
            <p className="text-lg mb-8">Your Campaign Is Successfully Launched</p>
            <div className="flex justify-center lg:justify-start">
              <button
                onClick={handleDashboardNavigation}
                className="custom-button p-2 pl-6 pr-6 text-white rounded-2xl shadow-2xl"
              >
                Go To Dashboard
              </button>
            </div>
          </div>
          <div className="lg:w-1/2 mt-8 lg:mt-0">
            <img src={congratsImage} alt="Congratulations" className="w-full h-auto object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
}
