import React from 'react';
import { PiArrowFatRightFill, PiArrowFatUp, PiArrowFatLeft, PiArrowFatDownLight, PiStarFour, PiStarHalfThin, PiTreePalmThin, PiVolleyballLight, PiAlarmLight, PiTennisBallLight, PiSealLight, PiTreePalmFill, PiVolleyballFill, PiTennisBallFill, PiSealFill } from 'react-icons/pi';
import { CiStar, CiHeart, CiMedicalCross } from 'react-icons/ci';
import { PiArrowFatUpFill,PiArrowFatLeftFill,PiArrowFatDownFill } from "react-icons/pi";
import { PiStarFourFill } from "react-icons/pi";
import { PiStarHalfFill } from "react-icons/pi";
import { BsChatSquareFill, BsCloudSunFill, BsFillMoonStarsFill, BsSuitClubFill } from "react-icons/bs";
import { BiSolidTagAlt } from "react-icons/bi";
import { FaPlay, FaShield, FaShirt } from "react-icons/fa6";
import { FaCircle, FaShoppingCart } from "react-icons/fa";
import { BiSolidPolygon } from "react-icons/bi";
import { TbArrowBadgeDownFilled, TbArrowBadgeLeftFilled, TbArrowBadgeRightFilled, TbArrowBadgeUpFilled, TbHexagonFilled, TbRectangleVertical, TbRectangleVerticalFilled } from "react-icons/tb";
import { BiSolidMessageSquare } from "react-icons/bi";
import { HiMiniCloud } from "react-icons/hi2";
import { IoIosCloud } from "react-icons/io";
import { FaHouseChimneyMedical } from "react-icons/fa6";
import { FaInstagramSquare } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { VscStarFull } from "react-icons/vsc";
import { FaHeart, FaPlayCircle } from "react-icons/fa";
import { IoIosStarOutline } from "react-icons/io";
import { IoStarOutline } from "react-icons/io5";
import { IoCloudyNightOutline } from "react-icons/io5";
import { IoIosCloudOutline } from "react-icons/io";
import { TiStarburst } from 'react-icons/ti';
import { GiSevenPointedStar } from "react-icons/gi";
import { RiStarHalfFill } from "react-icons/ri";
import { IoTriangle } from "react-icons/io5";
import { TbJewishStarFilled, TbTriangleFilled } from "react-icons/tb";
import { TbJewishStar, TbMoonStars, TbArrowBadgeRight, TbArrowBadgeLeft, TbArrowBadgeUp, TbArrowBadgeDown } from 'react-icons/tb';
import { MdOutlineHexagon, MdOutlinePanoramaFishEye, MdSignalWifi0Bar, MdAllInclusive, MdHexagon, MdPanoramaFishEye, MdOutlineSignalWifi4Bar } from 'react-icons/md';
import { FaRegSquare, FaInstagram, FaSquareFull } from 'react-icons/fa'; // Correct import
import { BiPolygon, BiSolidSquareRounded, BiTagAlt } from 'react-icons/bi';
import { FiHexagon, FiMessageSquare } from 'react-icons/fi';
import { BsChatSquare, BsCloudSun } from 'react-icons/bs';
import { GrStatusCriticalSmall } from 'react-icons/gr';
import { SiSonarcloud } from 'react-icons/si';
import { LuMessageCircle, LuClub, LuRectangleVertical, LuShirt, LuShoppingCart, LuShield } from 'react-icons/lu';
import { CiPlay1 } from "react-icons/ci";
import { DiCoda } from "react-icons/di";
import { DiYii } from "react-icons/di";
import { TbTriangleInvertedFilled  } from "react-icons/tb";
import { TbPlaystationTriangle } from "react-icons/tb";
import './ShapeStyles.css'; // Custom styles for shapes

const ShapeStyleLayout = ({ handleAddShape }) => {
  const size = 100; // Set default size for all icons
  const color = '#082A66'; // Set the color to smokewhite for all icons
  const icons = [
    { name: 'Arrow Right', component: <PiArrowFatRightFill /> },    
    {name:'leafs3',component:<DiYii />},
    {name:'triangle', component:<IoTriangle/>},
    {name:'roundtriangle',component:<TbTriangleFilled />},
    {name:'downtriangle',component:<TbTriangleInvertedFilled />},
    {name:'tbplaytraingle',component:<FaPlayCircle />},
    { name: 'Arrow Up', component: <PiArrowFatUpFill /> },
    { name: 'Arrow Left', component: <PiArrowFatLeftFill /> },
    { name: 'Arrow Down', component: <PiArrowFatDownFill /> },
    { name: 'Star Half Thin', component: <PiStarFourFill /> },
    { name: 'Star Half Thin', component: <PiStarHalfFill /> },    
    { name: 'MdOutlineHexagon', component: <MdHexagon /> },
    { name: 'MdOutlinePanoramaFishEye', component: <FaCircle /> },
    { name: 'Palm Tree', component: <PiTreePalmFill /> },
    { name: 'Volleyball', component: <PiVolleyballFill/> },
    { name: 'Tennis Ball', component: <PiTennisBallFill /> },
    { name: 'Seal Light', component: <PiSealFill /> },
    { name: 'Heart', component: <FaHeart /> },
    {name:'squarestar',component:<GiSevenPointedStar />},
    { name: 'Star Outline', component:<FaStar /> },    
    {name:'stars',component:<VscStarFull />},
    { name: 'Medical Cross', component: <FaHouseChimneyMedical /> },
    { name: 'Cloud Outline', component: <IoIosCloud /> },
    { name: 'Starburst', component: <TiStarburst /> },
    { name: 'Jewish Star', component: <TbJewishStarFilled /> },
    { name: 'Moon Stars', component: <BsFillMoonStarsFill /> },
    { name: 'Square', component: <BiSolidSquareRounded/> },
    { name: 'Square Full', component: <FaSquareFull /> }, // Corrected here
    { name: 'Instagram', component: <FaInstagramSquare /> },
    { name: 'Polygon', component: <BiSolidPolygon /> },
    { name: 'Tag Alt', component: <BiSolidTagAlt /> },
    { name: 'Hexagon', component: <TbHexagonFilled /> },
    { name: 'Message Square', component: <BiSolidMessageSquare /> },
    { name: 'Chat Square', component: <BsChatSquareFill /> },
    { name: 'Cloud Sun', component: <BsCloudSunFill /> },
    { name: 'Critical Status', component: <GrStatusCriticalSmall /> },
    { name: 'Sonar Cloud', component: <HiMiniCloud /> },
    { name: 'Club', component: <BsSuitClubFill/> },
    { name: 'Rectangle Vertical', component: <TbRectangleVerticalFilled /> },
    { name: 'Shirt', component: <FaShirt /> },
    { name: 'Shopping Cart', component: <FaShoppingCart /> },
    { name: 'Shield', component: <FaShield /> },
    {name: 'pointedstar', component:<GiSevenPointedStar/>},
    {name:'starHalffill',component:<RiStarHalfFill/>},
    { name: 'TbArrowBadgeRight', component: <TbArrowBadgeRightFilled /> },
    { name: 'TbArrowBadgeLeft', component: <TbArrowBadgeLeftFilled /> },
    { name: 'TbArrowBadgeUp', component: <TbArrowBadgeUpFilled /> },
    { name: 'TbArrowBadgeDown', component: <TbArrowBadgeDownFilled /> },
    { name: 'MdSignalWifi0Bar', component: <MdOutlineSignalWifi4Bar /> },
    {name:'play',component:<FaPlay />},
    {name:'leaf',component:<DiCoda />},

    // Add other icons here as needed...
  ];

  return (
    <div className="border-2 shadow-md p-3 text-[#FCFCFC]">
      <h3 className="font-semibold text-xl pb-4 pt-2 text-[#082A66]">Shapes</h3>
      <div className="grid-container">
        {icons.map((icon, index) => (
          <div
            key={index}
            className={`shape-box`}
            style={{
              fontSize: `${size}px`,
              color: color,
              cursor: "pointer",
            }}
            onClick={() => handleAddShape(icon)} // Pass shape data back to EditTemplate
          >
            {icon.component}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShapeStyleLayout;
