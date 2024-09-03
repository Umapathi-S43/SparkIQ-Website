import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const Button = ({ type, link, content }) => {
  const navigate = useNavigate();
  
  const buttonType =
    type === "primary"
      ? "text-white gradient-button-primary text-nowrap"
      : type === "blue"
      ? "bg-[#0086CD] text-white text-nowrap"
      : "bg-white text-[#FF3067] text-nowrap";
  
  const handleClick = () => {
    if (link) {
      navigate("/login");
    }
  };

  return (
    <div className='flex justify-center'>
    <button 
      className={`${buttonType} w-fit p-3 px-6 rounded-xl font-semibold text-nowrap `}
      onClick={handleClick}
    >
      {content}
    </button>
    </div>
  );
};

Button.propTypes = {
  type: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default Button;
