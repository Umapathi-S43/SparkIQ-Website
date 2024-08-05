import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PreviewBtn() {
  const navigate = useNavigate();

  return (
    <div className="m-10 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-t from-[#B3D4E5] to-[#D9E9F2] h-[280px] w-[500px] border border-[#FCFCFC] rounded-lg shadow-md">
      <p className="mb-10 font-semibold">
        Select one of the activity to get started with creatives
      </p>
      <div className='flex gap-4'>
        <button
          className='border-2 border-[#FCFCFC] h-[90px] w-[150px] rounded-lg shadow-xl'
          onClick={() => navigate('/socialmedia')}
        >
          Publish on Social Media
        </button>
        <button
          className='border-2 border-[#FCFCFC] h-[90px] w-[150px] rounded-lg shadow-xl'
          onClick={() => navigate('/socialmedia')}
        >
          Create an advertisement
        </button>
      </div>
    </div>
  );
}
