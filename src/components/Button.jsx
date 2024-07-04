import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const Button = ({ type, link, content }) => {
  const navigate = useNavigate();
  
  const buttonType =
    type === "primary"
      ? "text-white gradient-button-primary"
      : type === "blue"
      ? "bg-[#0086CD] text-white"
      : "bg-white text-[#FF3067]";
  
  const handleClick = () => {
    if (link) {
      navigate("/login");
    }
  };

  return (
    <button 
      className={`${buttonType} p-3 px-6 rounded-xl font-semibold`}
      onClick={handleClick}
    >
      {content}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default Button;
