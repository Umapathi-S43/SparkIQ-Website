import React from 'react';

const SvgBackground = () => {
  return (
    <div className="brand-card">
      <svg
        width="240"
        height="311"
        viewBox="0 0 240 311"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="paint0_linear_1_11743" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1547DB" stopOpacity="1" />
            <stop offset="85%" stopColor="#1547DB" stopOpacity="1" />
            <stop offset="100%" stopColor="#408DD5" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="bg_gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1547DB" stopOpacity="1" />
            <stop offset="85%" stopColor="#1547DB" stopOpacity="1" />
            <stop offset="100%" stopColor="#408DD5" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="bg_gradient_hover" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00A0F5" stopOpacity="1" />
            <stop offset="85%" stopColor="#00A0F5" stopOpacity="1" />
            <stop offset="100%" stopColor="#92D8FF" stopOpacity="1" />
          </linearGradient>
          <radialGradient id="smoke_gradient" cx="75%" cy="25%" r="75%" fx="75%" fy="25%">
            <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 0.15 }} />
            <stop offset="100%" style={{ stopColor: 'white', stopOpacity: 0 }} />
          </radialGradient>
          <radialGradient id="smoke_gradient_top" cx="75%" cy="0%" r="75%" fx="75%" fy="0%">
            <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 0.09 }} />
            <stop offset="100%" style={{ stopColor: 'white', stopOpacity: 0 }} />
          </radialGradient>
          <filter id="filter0_bi_1_11743" x="-60" y="-60" width="360" height="400" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="30" />
            <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_1_11743" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_1_11743" result="shape" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feMorphology radius="0.5" operator="erode" in="SourceAlpha" result="effect2_innerShadow_1_11743" />
            <feOffset />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.15 0" />
            <feBlend mode="normal" in2="shape" result="effect2_innerShadow_1_11743" />
          </filter>
        </defs>
        <path d="M0 0L180.387 25.3518C202.264 28.4263 219.998 48.8273 219.998 70.9187V270.919C219.998 293.01 202.264 308.426 180.387 305.352L39.6107 285.567C17.7343 282.492 0 262.091 0 240V0Z" className="svg-background" fill="url(#bg_gradient)" />
        <g filter="url(#filter0_bi_1_11743)">
          <path d="M0 0H210C226.569 0 240 13.4315 240 30V240C240 262.091 222.091 280 200 280H40C17.9086 280 0 262.091 0 240V0Z" className="svg-background" fill="url(#bg_gradient)" />
        </g>
        <rect x="0" y="0" width="240" height="311" rx="20" ry="20" fill="url(#smoke_gradient)" />
        <rect x="0" y="0" width="240" height="311" rx="20" ry="20" fill="url(#smoke_gradient_top)" />
      </svg>
    </div>
  );
};

export default SvgBackground;
