import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PreviewTemplate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { image } = location.state || {};

  const hasDownloaded = useRef(false);

  useEffect(() => {
    if (image && !hasDownloaded.current) {
      handleAutoDownload();
      hasDownloaded.current = true;
    }
  }, [image]);

  const handleAutoDownload = () => {
    const link = document.createElement('a');
    link.href = image;
    link.download = 'template.png';
    link.click();
  };

  return (
    
    <div
      className="border-2 border-white bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] flex justify-center items-center" 
      style={{ height: "calc(100vh)" }}
    >{image ? (
        <div className="relative w-full h-full max-w-screen-lg flex justify-center">
          {/* Back to Edit Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-2 right-2 bg-gray-500 text-white py-1 px-3 rounded shadow"
          >
            Back to Edit
          </button>
          {/* Image Preview */}
          
          <div className='flex justify-center items-center m-4'><img
            src={image}
            alt="Preview"
            className="w-full h-full object-contain"
          />
          </div>
        </div>
      ) : (
        <p className="text-lg">No image available for preview.</p>
      )}
    </div>
  );
};

export default PreviewTemplate;
