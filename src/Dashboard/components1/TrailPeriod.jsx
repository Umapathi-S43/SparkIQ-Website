import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const TrialPeriodBoxSmall = ({ daysLeft, totalDays, trialEndDate }) => {
  const percentage = (daysLeft / totalDays) * 100;

  return (
    <div className="flex items-center justify-between bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] border-2 border-[#FCFCFC] rounded-xl p-4 mb-4" style={{ width: '200px', height: '150px' }}>
      <div style={{ width: '100px', height: '100px', position: 'relative' }}>
        <CircularProgressbar
          value={percentage}
          styles={buildStyles({
            pathColor: "#00A0F5",
            trailColor: "#FCFCFC",
            strokeLinecap: "round",
            strokeWidth: 12, // Adjust the strokeWidth to make the bar thicker
          })}
        />
        <div
          style={{
            position: 'absolute',
            top: '27%',
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
          <span className='text-xl'>{daysLeft}</span>
         
        </div>
      </div>
      <div className="ml-4">
        <p className='text-sm'>Your Trial Period expires on:</p>
        <h2 className="font-bold text-xl mt-2">{trialEndDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}</h2>
      </div>
    </div>
  );
};


const TrialPeriodBoxLarge = ({ daysLeft, totalDays, trialEndDate }) => {
  const percentage = (daysLeft / totalDays) * 100;

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
            top: '42%',
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
          <span>{daysLeft} days</span>
          <span className="text-sm text-gray-500">Left</span>
        </div>
      </div>
      <div className="ml-4">
        <p>Your Trial Period expires on:</p>
        <h2 className="font-bold text-2xl mt-2">{trialEndDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}</h2>
      </div>
    </div>
  );
};

const TrialPeriodBox = ({ daysLeft, totalDays, trialEndDate }) => {
  const isSmallScreen = useMediaQuery({ query: '(max-width: 530px)' });

  return isSmallScreen ? (
    <TrialPeriodBoxSmall daysLeft={daysLeft} totalDays={totalDays} trialEndDate={trialEndDate} />
  ) : (
    <TrialPeriodBoxLarge daysLeft={daysLeft} totalDays={totalDays} trialEndDate={trialEndDate} />
  );
};

export default TrialPeriodBox;
