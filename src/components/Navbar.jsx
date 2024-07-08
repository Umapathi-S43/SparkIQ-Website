import { useState } from "react";
import { Link } from "react-scroll";
import { FiMenu } from "react-icons/fi";
import Button from "./Button";
import sparkLogo from "../assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavItemClick = () => {
    setIsOpen(false);
  };

  const navItems = [
    { name: "Home", path: "home" },
    { name: "How Spark IQ Works", path: "about" },
    { name: "Features", path: "features" },
    { name: "FAQ", path: "faq" },
    { name: "Pricing", path: "pricing" },
    { name: "Contact", path: "contact" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white z-50 lg:p-3 p-2 md:p-3">
      <div className="flex justify-between items-center h-14 max-w-[1200px] mx-auto text-sm">
        <img src={sparkLogo} alt="spark logo" className="w-[158px]" />
        <ul className="hidden lg:flex justify-between gap-14">
          {navItems.map((item) => (
            <li key={item.name} className="cursor-pointer list-none">
              <Link to={item.path} smooth={true} duration={500}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center lg:hidden">
          <Button type="primary" link="/login" content="Login" className="mr-4" />
          <button className="text-3xl ml-4 mr-2 border p-1 rounded-md bg-neutral-100" onClick={toggleMenu}>
            <FiMenu />
          </button>
        </div>
        <div className="hidden lg:block">
        <Button type="primary" link="/login" content="Login"/>
      </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] z-10 flex flex-col items-center p-4 lg:hidden">
          <div className="relative w-full h-full max-w-5xl p-4 bg-white bg-opacity-20 rounded-2xl border-2 border-white">
            <div className="flex justify-between items-center mb-4">
              <img src={sparkLogo} alt="spark logo" className="w-[158px]" />
            </div>
            <ul className="flex flex-col gap-2 text-black text-lg">
              {navItems.map((item) => (
                <li
                  key={item.name}
                  className="cursor-pointer"
                  onClick={handleNavItemClick}
                >
                  <Link to={item.path} smooth={true} duration={500} onClick={handleNavItemClick}>
                    <div className="group w-full p-2 pl-4 rounded-md flex items-center cursor-pointer transition-colors duration-200 hover:bg-[#1547DB] hover:text-white">
                      <span className="ml-4">{item.name}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
