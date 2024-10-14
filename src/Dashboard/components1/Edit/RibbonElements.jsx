import React, { useState } from 'react';

const RibbonElements = ({ handleAddSVG }) => {
  const [isOpen, setIsOpen] = useState(false);

  const svgs = [
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 134" enable-background="new 0 0 400 134"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <polygon  points="400,67 356.236,134 0,134 0,0 356.236,0 " data-color-group="0"/> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 134" enable-background="new 0 0 400 134"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <polygon  points="356.277,67 400,134 0,134 0,0 400,0 " data-color-group="0"/> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 134" enable-background="new 0 0 400 134"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <path  d="M390.305,126.533L400,134H0V0h400l-9.695,7.467C351.201,37.584,351.201,96.416,390.305,126.533z" data-color-group="0"/> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 134" enable-background="new 0 0 400 134"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <path  d="M356.919,67.42c0-17.733,10.582-32.98,25.738-39.695C393.227,23.042,400,12.461,400,0.84V0H0v134h400v0 c0-11.622-6.773-22.202-17.343-26.885C367.501,100.4,356.919,85.153,356.919,67.42z" data-color-group="0"/> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 134" enable-background="new 0 0 400 134"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <polygon  points="0,134 0,133.956 400,133.956 385.608,117.217 400,100.478 385.608,83.739 400,67 385.608,50.261 400,33.522 385.608,16.783 400,0.044 0,0.044 0,0 0,0 " data-color-group="0"/> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 134" enable-background="new 0 0 400 134"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <path  d="M378.154,116.533L378.154,116.533C365.847,127.771,349.799,134,333.153,134H0l0,0V0l0,0h333.152 c16.647,0,32.695,6.229,45.002,17.467l0,0C407.282,44.065,407.282,89.935,378.154,116.533z" data-color-group="0"/> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 134" enable-background="new 0 0 400 134"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <polygon  points="43.765,0 0,67 43.765,134 356.236,134 400,67 356.236,0 " data-color-group="0"/> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 134" enable-background="new 0 0 400 134"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <polygon  points="400,134 356.277,67 400,0 0,0 43.723,67 0,134 " data-color-group="0"/> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 134" enable-background="new 0 0 400 134"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <path  d="M400,134l-9.696-7.467c-39.104-30.117-39.104-88.948,0-119.065L400,0H0l9.695,7.467 c39.104,30.117,39.104,88.948,0,119.065L0,134H400z" data-color-group="0"/> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 134" enable-background="new 0 0 400 134"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <path  d="M400,134c0-11.622-6.752-22.202-17.29-26.885c-15.11-6.715-25.66-21.961-25.66-39.695 s10.549-32.98,25.66-39.695C393.248,23.042,400,12.461,400,0.84V0H289.117H49.848H0c0,11.622,6.752,22.202,17.29,26.885 C32.4,33.6,42.95,48.847,42.95,66.58S32.4,99.56,17.29,106.275C6.752,110.958,0,122.378,0,134H400z" data-color-group="0"/> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 134" enable-background="new 0 0 400 134"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <polygon  points="0,0 14.392,16.75 0,33.5 14.392,50.25 0,67 14.392,83.75 0,100.5 14.392,117.25 0,134 400,134 385.608,117.25 400,100.5 385.608,83.75 400,67 385.608,50.25 400,33.5 385.608,16.75 400,0 " data-color-group="0"/> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 134" enable-background="new 0 0 400 134"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <path  d="M66.847,0C50.201,0,34.153,6.229,21.846,17.467l0,0c-29.128,26.598-29.128,72.468,0,99.066h0 C34.153,127.771,50.201,134,66.847,134h266.305c16.647,0,32.695-6.229,45.001-17.467h0c29.128-26.598,29.128-72.468,0-99.066l0,0 C365.847,6.229,349.799,0,333.153,0H66.847z" data-color-group="0"/> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 134" enable-background="new 0 0 400 134"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <path  d="M326.441,134L0,134l0,0V0l0,0l326.441,0C346.222,17.974,400,42.487,400,67S346.222,116.026,326.441,134z" data-color-group="0"/> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 134" enable-background="new 0 0 400 134"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <g> <path  d="M73.559,0C53.778,17.974,0,42.487,0,67c0,24.513,53.778,49.026,73.559,67h252.882 C346.222,116.026,400,91.513,400,67c0-24.513-53.778-49.026-73.559-67H73.559z" data-color-group="0"/> </g> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 134" enable-background="new 0 0 400 134"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <g> <path d="M0,129.543l274.732,3.129c12.333,0.14,24.653,0.436,36.957,0.843c28.715,0.949,91.042,1.691,88.218-9.903 c-3.663-15.041-44.409-18.874-44.409-18.874L0,129.543z" data-color-group="0"/> <g> <path  d="M278.585,6.467C219.629,10.213,0,14.21,0,14.21v115.333c0,0,220.364-8.402,279.477-11.602 c62.628-3.39,111.815-7.198,120.43,5.671V8.279C392.609-6.22,352.473,1.771,278.585,6.467z" data-color-group="1"/> </g> </g> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 134" enable-background="new 0 0 400 134"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <path  d="M56.575,98.369c0.01,0,0.026,0.002,0.045,0.002v17.814v17.813c-0.019,0-0.036,0.002-0.045,0.002 C25.329,134,0,126.023,0,116.185c0-9.14,25.542-30.533,53.695-31.557C55.849,84.549,54.355,98.369,56.575,98.369z" data-color-group="0"/> <g> <path  d="M384.815,98.37l-2.729,0C382.976,98.37,383.888,98.37,384.815,98.37z" data-color-group="1"/> <path  d="M382.085,98.37c-0.52,0-1.03,0-1.53,0L382.085,98.37z" data-color-group="1"/> <path  d="M388.384,98.37c-1.192,0-2.389,0-3.569,0L388.384,98.37z" data-color-group="1"/> <path  d="M400,98.369c-0.743,0-1.498,0-2.267,0L400,98.369L400,98.369z" data-color-group="1"/> <path  d="M397.733,98.37l-9.35,0C389.04,98.37,397.086,98.37,397.733,98.37z" data-color-group="1"/> <path  d="M400,0L400,0H56.569C25.329,0,0,7.977,0,17.816v98.368c0-9.839,25.329-17.816,56.569-17.816 c0.016,0,0.036,0.002,0.049,0.002v-0.002H400V0z" data-color-group="1"/> <path  d="M380.555,98.37l-0.79,0C380.026,98.37,380.289,98.37,380.555,98.37z" data-color-group="1"/> <path  d="M374.731,98.371l-1.721,0C373.499,98.371,374.076,98.371,374.731,98.371z" data-color-group="1"/> <path  d="M379.766,98.37c-0.664,0-1.304,0-1.917,0L379.766,98.37z" data-color-group="1"/> <path  d="M372,98.371l-0.733,0C371.269,98.371,371.536,98.371,372,98.371z" data-color-group="1"/> <path  d="M373.01,98.371c-0.398,0-0.742,0-1.01,0L373.01,98.371z" data-color-group="1"/> <path  d="M376.995,98.37c-0.825,0-1.583,0-2.264,0L376.995,98.37z" data-color-group="1"/> <path  d="M377.848,98.37l-0.854,0C377.273,98.37,377.556,98.37,377.848,98.37z" data-color-group="1"/> </g> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 134" enable-background="new 0 0 400 134"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <g> <path  d="M343.446,98.369c-0.01,0-0.026,0.002-0.045,0.002v17.814v17.813c0.019,0,0.036,0.002,0.045,0.002 C374.68,134,400,126.023,400,116.185c0-9.14-25.532-30.533-53.675-31.557C344.172,84.549,345.665,98.369,343.446,98.369z" data-color-group="0"/> <path  d="M56.554,98.369c0.01,0,0.026,0.002,0.045,0.002v17.814v17.813c-0.019,0-0.036,0.002-0.045,0.002 C25.32,134,0,126.023,0,116.185c0-9.14,25.532-30.533,53.675-31.557C55.828,84.549,54.335,98.369,56.554,98.369z" data-color-group="0"/> <path  d="M343.4,0C343.391,0,343.42,0,343.4,0H56.547c-0.013,0,0.016,0,0,0C25.32,0,0,7.977,0,17.816v98.368 c0-9.839,25.32-17.816,56.547-17.816c0.016,0,0.036,0.002,0.049,0.002v-0.002H343.4v0.002c0.019,0,0.036-0.002,0.045-0.002 c31.234,0,56.554,7.977,56.554,17.816V17.816C400,7.977,374.635,0,343.4,0z" data-color-group="1"/> </g> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 134" enable-background="new 0 0 400 134"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <g> <g> <polygon  points="41.311,133.993 41.311,77.781 0,100.625 " data-color-group="0"/> <polygon  points="358.697,134 400,100.632 358.697,68.633 " data-color-group="0"/> </g> <rect transform="matrix(-1 -1.224647e-16 1.224647e-16 -1 399.9999 100.6242)"  width="400" height="100.624" data-color-group="1"/> </g> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 134" enable-background="new 0 0 400 134"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <g> <g> <polygon  points="21.49,79.604 0,134 87.509,134 87.509,28.291 0,28.291 " data-color-group="0"/> </g> <polygon  points="34.159,106.968 60.846,93.512 87.53,80.053 87.53,106.968 87.53,133.884 60.846,120.425 " data-color-group="1"/> <polygon  points="378.51,53.166 400,106.91 34.165,106.91 34.165,0 400,0 " data-color-group="2"/> </g> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 134" enable-background="new 0 0 400 134"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <g> <g> <polygon  points="21.49,79.604 0,134 87.509,134 87.509,28.291 0,28.291 " data-color-group="0"/> </g> <polygon  points="34.159,106.968 60.846,93.512 87.53,80.053 87.53,106.968 87.53,133.884 60.846,120.425 " data-color-group="1"/> <polygon  points="360,0 400,53.455 360,106.91 34.165,106.91 34.165,0 " data-color-group="2"/> </g> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 134" enable-background="new 0 0 400 134"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <g> <g> <g> <polygon  points="21.495,79.605 0,134 87.529,134 87.529,28.291 0,28.291 " data-color-group="0"/> </g> <polygon  points="34.167,106.969 60.86,93.512 87.55,80.053 87.55,106.969 87.55,133.884 60.86,120.425 " data-color-group="1"/> </g> <path  d="M346.533,0L34.173,0v106.91l312.359,0c29.529,0,53.467-23.933,53.467-53.455v0 C400,23.933,376.062,0,346.533,0z" data-color-group="2"/> </g> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 124" enable-background="new 0 0 400 124"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <g> <g> <g> <polygon  points="21.49,69.604 0,124 87.509,124 87.509,18.291 0,18.291 " data-color-group="0"/> </g> <polygon  points="34.159,86.91 60.846,83.512 87.53,70.053 87.53,96.968 87.53,123.884 34.159,86.91 " data-color-group="1"/> </g> <g> <g> <polygon  points="378.51,69.604 400,124 312.491,124 312.491,18.291 400,18.291 " data-color-group="0"/> </g> <polygon  points="365.841,86.968 339.154,83.512 312.47,70.053 312.47,96.968 312.47,123.884 365.841,86.968 " data-color-group="1"/> </g> <polygon  points="365.841,86.91 365.841,86.91 34.165,86.91 34.165,0 200.003,0 365.841,0 " data-color-group="2"/> </g> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 110" enable-background="new 0 0 400 110"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <g> <g> <g> <polygon  points="19.727,56.205 0,13.69 80.329,13.69 80.329,96.31 0,96.31 " data-color-group="0"/> </g> </g> <g> <g> <polygon  points="380.273,53.795 400,96.31 319.671,96.31 319.671,13.69 400,13.69 " data-color-group="0"/> </g> </g> <rect x="46.169"  width="307.399" height="110" data-color-group="1"/> </g> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 170" enable-background="new 0 0 400 170"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <g> <g> <g> <polygon  points="19.727,86.205 0,43.69 80.329,43.69 80.329,126.31 0,126.31 " data-color-group="0"/> </g> </g> <g> <g> <polygon  points="380.273,83.795 400,126.31 319.671,126.31 319.671,43.69 400,43.69 " data-color-group="0"/> </g> </g> <polygon  points="353.568,140 199.868,170 46.169,140 46.169,30 199.868,0 353.568,30 " data-color-group="1"/> </g> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 148" enable-background="new 0 0 400 148"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <g> <g> <g> <g> <polygon  points="21.49,93.62 0,148 87.509,148 87.509,42.322 0,42.322 " data-color-group="0"/> </g> <polygon  points="34.159,110.921 60.846,107.524 87.53,94.069 87.53,120.976 87.53,147.884 34.159,110.921 " data-color-group="1"/> </g> <g> <g> <polygon  points="378.51,93.62 400,148 312.491,148 312.491,42.322 400,42.322 " data-color-group="0"/> </g> <polygon  points="365.841,110.979 339.154,107.524 312.47,94.069 312.47,120.976 312.47,147.884 365.841,110.979 " data-color-group="1"/> </g> </g> <path  d="M266.992,25.228C252.023,9.956,227.605,0,200.003,0s-52.02,9.956-66.989,25.228l-98.848-1.192v86.885 l165.838,32.51l165.838-32.51V24.036L266.992,25.228z" data-color-group="2"/> </g> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 100" enable-background="new 0 0 400 100"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <g> <path  d="M0,28.106c18.603-5.975,38.496-5.975,57.097,0c0,19.924,0,39.848,0,59.772 c-18.601-5.976-38.494-5.976-57.097,0c3.142-10.947,6.322-21.723,9.524-32.329C6.322,46.231,3.142,37.084,0,28.106z" data-color-group="0"/> <polygon  points="32.99,39.024 56.987,27.791 56.987,56.963 " data-color-group="1"/> <path  d="M400,18.241c-18.604-5.976-38.495-5.976-57.098,0c0,19.923,0,39.847,0,59.771 c18.603-5.976,38.494-5.976,57.098,0c-3.142-10.947-6.32-21.723-9.524-32.329C393.68,36.364,396.858,27.217,400,18.241z" data-color-group="0"/> <polygon  points="366.983,60.976 343.012,49.045 343.012,78.217 " data-color-group="1"/> <path  d="M366.983,60.976C255.651,60.976,144.319,100,32.99,100c0-20.325,0-40.65,0-60.976 C144.319,39.024,255.651,0,366.983,0C366.983,20.326,366.983,40.651,366.983,60.976z" data-color-group="2"/> </g> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 100" enable-background="new 0 0 400 100"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <g> <path  d="M0,4.879c20.359-6.505,42.129-6.505,62.488,0c0,21.687,0,43.375,0,65.063 c-20.359-6.505-42.129-6.505-62.488,0c3.438-11.916,6.918-23.646,10.422-35.191C6.918,24.608,3.438,14.65,0,4.879z" data-color-group="0"/> <polygon  points="35.415,19.213 62.366,4.879 62.366,39.041 " data-color-group="1"/> <path  d="M400,34.746c-20.357-6.505-42.127-6.505-62.485,0c0,21.687,0,43.376,0,65.062 c20.358-6.503,42.128-6.503,62.485,0c-3.439-11.914-6.917-23.645-10.421-35.191C393.083,54.475,396.561,44.518,400,34.746z" data-color-group="0"/> <polygon  points="363.943,79.793 337.635,65.838 337.635,100 " data-color-group="1"/> <path  d="M363.943,79.793c-109.507-59.368-219.018,59.365-328.528,0c0-20.195,0-40.386,0-60.58 c109.51,59.367,219.021-59.367,328.528,0C363.943,39.407,363.943,59.598,363.943,79.793z" data-color-group="2"/> </g> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 125" enable-background="new 0 0 400 125"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <g> <polygon  points="0,57.767 57.238,40.541 77.079,107.064 19.843,124.289 19.612,88.2 " data-color-group="0"/> <path  d="M42.503,95.431c0,0,7.173-16.385,11.44-17.675c2.858-0.863,14.317,0,14.317,0l8.819,29.261L42.503,95.431z" data-color-group="1"/> <polygon  points="400,58.476 342.761,41.251 322.921,107.773 380.158,125 380.388,88.909 " data-color-group="0"/> <path  d="M356.925,95.449c0,0-12.451-9.133-16.716-10.424c-2.86-0.862-8.563-6.242-8.563-6.242l-8.725,28.942 L356.925,95.449z" data-color-group="1"/> <path  d="M42.503,95.449L19.864,30.035c0,0,172.597-67.579,358.843,0l-21.782,65.414 C356.925,95.449,219.714,36.376,42.503,95.449z" data-color-group="2"/> </g> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 133" enable-background="new 0 0 400 133"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <g> <polygon fill-rule="evenodd" clip-rule="evenodd" points="188.547,42.334 278.991,23.631 278.991,114.298 188.547,133 " data-color-group="0"/> <polygon fill-rule="evenodd" clip-rule="evenodd"  points="124.483,20.101 278.991,23.631 278.991,114.298 124.483,110.768 " data-color-group="1"/> <polygon fill-rule="evenodd" clip-rule="evenodd"  points="124.483,20.101 384.509,0 400,90.666 124.483,110.768 " data-color-group="2"/> <rect fill-rule="evenodd" clip-rule="evenodd"  width="400" height="90.666" data-color-group="3"/> </g> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 165" enable-background="new 0 0 400 165"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <g> <polygon  points="396.856,57.926 190.481,62.757 189.946,66.611 0,98.389 14.773,131.694 260.439,134.259 264.867,98.389 400,66.611 " data-color-group="0"/> <polygon  points="400,0 0,0 32.559,33.306 0,66.611 400,66.611 " data-color-group="1"/> <polygon  points="0,98.389 400,98.389 367.441,131.695 400,165 0,165 " data-color-group="1"/> </g> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 262" enable-background="new 0 0 400 262"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <g> <polygon  points="67.958,195.894 191.138,164.357 202.065,140.245 390.59,141.765 400,164.357 266.059,195.894 257.667,207.792 80.219,212.788 " data-color-group="0"/> <polygon  points="0,97.644 123.18,66.106 126.916,53.585 328.689,51.63 333.234,66.106 198.101,97.644 186.644,111.141 4.636,104.408 " data-color-group="0"/> <rect y="97.644"  width="400" height="66.713" data-color-group="1"/> <polygon  points="333.234,262 67.958,262 67.958,195.894 333.234,195.894 305.216,228.947 " data-color-group="1"/> <polygon  points="67.958,0 333.234,0 333.234,66.106 67.958,66.106 95.976,33.053 " data-color-group="1"/> </g> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 264" enable-background="new 0 0 400 264"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <g> <polygon  points="54.161,0 26.296,40.224 26.296,138.576 54.161,68.344 " data-color-group="0"/> <polygon  points="140.975,50.056 26.296,40.224 26.296,138.576 140.975,118.4 " data-color-group="1"/> <polygon  points="140.975,50.056 1.037,66.231 1.037,164.583 140.975,118.4 " data-color-group="0"/> <g> <polygon  points="346.877,264 374.741,226.588 374.741,142.518 346.877,191.413 " data-color-group="0"/> <polygon  points="260.062,216.789 374.741,226.588 374.741,142.518 260.062,156.564 " data-color-group="1"/> <polygon  points="260.062,216.789 400,192.884 400,124.412 260.062,156.564 " data-color-group="0"/> </g> <polygon  points="400,82.14 0,66.23 0,207.166 400,193.066 " data-color-group="2"/> </g> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 400" enable-background="new 0 0 400 400"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <g id="XMLID_101_"> <polygon id="XMLID_121_"  points="206.384,351.39 92.333,400 143.07,328.693 " data-color-group="0"/> <polygon id="XMLID_133_"  points="191.183,42.114 298.699,0 257.02,64.747 " data-color-group="0"/> <polygon id="XMLID_127_"  points="57.196,320.09 206.584,351.545 145.41,264.241 " data-color-group="1"/> <polygon id="XMLID_123_"  points="308.875,64.791 191.183,42.114 245.814,128.441 " data-color-group="1"/> <polygon id="XMLID_122_"  points="0,169.894 308.914,64.747 400,275.59 57.187,320.174 " data-color-group="2"/> </g> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 265" enable-background="new 0 0 400 265"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <g id="XMLID_73_"> <polygon id="XMLID_79_"  points="115.233,219.439 185.817,265 192.445,207.583 " data-color-group="0"/> <polygon id="XMLID_80_"  points="257.963,214.534 115.233,219.439 119.884,184.196 " data-color-group="1"/> <polygon id="XMLID_87_"  points="30.275,173.548 257.963,214.534 318.889,162.077 " data-color-group="0"/> <polygon id="XMLID_89_"  points="30.275,173.548 372.682,164.901 400,12.591 0,0 " data-color-group="2"/> </g> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 279" enable-background="new 0 0 400 279"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <g> <polygon  points="97.892,75.935 97.892,0 0,51.034 97.076,87.575 98.33,75.935 " data-color-group="0"/> <polygon  points="319.789,279 400,218.8 383.014,203.169 319.789,209.239 " data-color-group="0"/> <polygon  points="400,218.8 0.001,218.8 0.001,51.035 400,79.228 " data-color-group="1"/> </g> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 400" enable-background="new 0 0 400 400"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <g> <g> <polygon  points="0,0 0,43.484 74.466,43.484 148.933,0 " data-color-group="0"/> </g> <g> <polygon  points="400,400 400,252.292 356.727,346.76 356.727,400 " data-color-group="0"/> </g> <polygon  points="400,400 0,0 148.933,0 400,252.292 " data-color-group="1"/> </g> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 400" enable-background="new 0 0 400 400"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <g> <polygon  points="400,356.699 379.099,309.269 356.699,313.399 356.699,356.699 356.699,400 " data-color-group="0"/> <polygon  points="43.301,0 0,43.301 43.301,43.301 86.601,43.301 83.945,15.894 " data-color-group="0"/> <polygon  points="400,156.021 243.979,0 43.301,0 400,356.699 " data-color-group="1"/> </g> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 400" enable-background="new 0 0 400 400"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <g> <g> <polygon  points="400,356.699 379.099,309.269 356.699,313.399 356.699,356.699 356.699,400 " data-color-group="0"/> <polygon  points="43.301,0 0,43.301 43.301,43.301 86.601,43.301 83.945,15.894 " data-color-group="0"/> </g> <polygon  points="400,0 43.301,0 400,356.699 400,0 400,0 " data-color-group="1"/> </g> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 411" enable-background="new 0 0 400 411"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <g> <path  d="M53.802,283.334C21.898,285.371,0,317.763,0,358.099c0,23.98,21.898,50.864,53.802,52.901V283.334z" data-color-group="0"/> <path  d="M344.942,160.052l-179.394,85.129l-96.732,46.11C37.359,307.161,0,319,0,357.161l0,0l0.023-67.165 l0.065-97.813c-1.425-26.633,14.501-51.622,40.932-64.221l0,0L310.257,0L400,36.05L344.942,160.052z" data-color-group="1"/> </g> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 445" enable-background="new 0 0 400 445"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <g> <path  d="M51.868,321.835C21.111,323.801,0,355.05,0,393.964c0,23.135,21.111,49.07,51.868,51.036V321.835z" data-color-group="0"/> <path  d="M400,0L39.546,171.942h0c-25.481,12.155-40.835,36.262-39.461,61.956l-0.063,94.364L0,393.06 c0-36.816,36.017-48.238,66.344-63.548l93.256-44.484L400,170.353V0z" data-color-group="1"/> </g> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 453" enable-background="new 0 0 400 453"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <g> <path  d="M53.568,325.75C21.803,327.781,0,360.066,0,400.271C0,424.173,21.803,450.969,53.568,453V325.75z" data-color-group="0"/> <path  d="M400,176.003L164.83,287.722l-96.312,45.96C37.197,349.499,0,361.3,0,399.337l0,0l0.023-66.946 l0.065-97.494c-1.419-26.546,14.438-51.453,40.754-64.011l0,0L400,0l-65.795,114.382L400,176.003z" data-color-group="1"/> </g> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 448" enable-background="new 0 0 400 448"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <path  d="M51.868,324.876C21.111,326.841,0,358.08,0,396.981C0,420.108,21.111,446.035,51.868,448V324.876z" data-color-group="0"/> <g> <path  d="M400,0L37.941,178.246l0,0c-24.447,12.15-39.178,36.25-37.859,61.936l-0.061,94.333L0,399.29 c0-36.804,34.555-48.222,63.651-63.526l91.521-44.622c0,0,54.398-26.712,112.408-55.169C352.758,194.19,400,107.911,400,9.923V0z" data-color-group="1"/> </g> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 382" enable-background="new 0 0 400 382"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <g> <path  d="M51.868,258.899C21.111,260.864,0,292.097,0,330.991C0,354.113,21.111,380.035,51.868,382V258.899z" data-color-group="0"/> <path  d="M400,107.496c0-78.968-82.533-130.915-153.922-96.88L39.546,109.083h0 c-25.481,12.148-40.835,36.243-39.461,61.924l-0.063,94.315L0,330.087c0-36.797,36.017-48.213,66.344-63.515L159.6,222.11 L400,107.496L400,107.496z" data-color-group="1"/> </g> </svg>),},
    { name: 'SVG Ribbon 01', component: (fillColor) =>(<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 400 400" enable-background="new 0 0 400 400"  width="100%" height="100%" preserveAspectRatio="none" fill={fillColor}> <g> <path  d="M51.868,276.855C21.111,278.82,0,310.065,0,348.972C0,372.103,21.111,398.035,51.868,400V276.855z" data-color-group="0"/> <path  d="M400,76.941c0-56.522-59.053-93.704-110.131-69.342L39.546,126.986h0 c-25.481,12.153-40.835,36.256-39.461,61.946l-0.063,94.349L0,348.068c0-36.81,36.017-48.23,66.344-63.537l93.256-44.477 l196.609-93.77C382.966,133.522,400,106.548,400,76.941L400,76.941z" data-color-group="1"/> </g> </svg>),},

    
  ];

  const handleSVGClick = (svg) => {
    handleAddSVG(svg); // Call parent function to add SVG
  };

  return (
    <div className="border-2 shadow-md p-3 pl-2 text-[#FCFCFC]">
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <h5 className="font-semibold text-xl pb-4 pt-2 text-[#082A66]">Ribbons</h5>
        <span>{isOpen ? '▼' : '▲'}</span>
      </div>
      {isOpen && (
        <div className="grid-container">
          {svgs.map((svg, index) => (
            <div
              key={index}
              className="shape-box"
              style={{
                width: '90px',
                height: '60px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onClick={() => handleSVGClick(svg)} // Handle click to add SVG
            >
              {svg.component('#082A66')} {/* Pass default color */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RibbonElements;
