import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PreviewBtn() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/socialmedia', { state: { skipToSelectPage: true, fromPreviewBtn: true } });
  };

  return (
    <div className="m-10 flex flex-col items-center justify-center overflow-hidden h-[300px] w-[540px] border border-[#FCFCFC] rounded-lg shadow-xl relative" style={{ background: "linear-gradient(115deg, #004367 0%, #00A7FF 100%)", padding: '7px' }}>
      <div className="p-10 border-2 border-[#FCFCFC] rounded-lg shadow-inner" style={{ background: "linear-gradient(115deg, #D9E9F2 0%, #D9E9F2 100%)", width: '100%', height: '100%' }}>
        <p className="mb-10 font-bold text-center text-xl text-[#083A75]">
          Select one of the activities to get started with creatives
        </p>
        <div className='flex gap-8 justify-center'>
          <button
            className='border-2 border-[#FCFCFC] h-[100px] w-[160px] rounded-lg shadow-xl text-white font-semibold text-lg hover:scale-105 transition-transform duration-300'
            style={{ background: "linear-gradient(115deg, #004367 0%, #00A7FF 100%)" }}
            onClick={handleClick}
          >
            Publish on Social Media
          </button>
          <button
            className='border-2 border-[#FCFCFC] h-[100px] w-[160px] rounded-lg shadow-xl text-white font-semibold text-lg hover:scale-105 transition-transform duration-300'
            style={{ background: "linear-gradient(115deg, #004367 0%, #00A7FF 100%)" }}
            onClick={handleClick}
          >
            Create an Advertisement
          </button>
        </div>
      </div>
    </div>
  );
}
