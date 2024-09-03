import React from 'react';
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import '../index.css'; // Import the CSS file with the background image
import '../../src/index.css'

const Footer = () => {
	return (
		<footer className="relative flex flex-col md:flex-row h-auto md:h-[230px] p-6 md:p-12 items-center md:px-[6rem]">
			<div className="w-full md:w-1/2 mb-4 md:mb-0 flex justify-center md:justify-start">
			<Link to="/"> {/* Wrap the logo with Link to redirect to the home page */}
					<img src={logo} alt="Spark IQ Logo" className="w-[120px] md:w-[158px]" />
				</Link>
			</div>
			<div className="w-full md:w-1/2 flex flex-col md:flex-row justify-between text-center md:text-left">
				<div className="flex flex-col gap-3 md:gap-6 mb-4 md:mb-0">
					<Link to="#" className="font-bold">
						About
					</Link>
					<Link to="#" className="text-sm">
						Our Customers
					</Link>
					<Link to="#" className="text-sm">
						Success Story
					</Link>
				</div>
				<div className="flex flex-col gap-3 md:gap-6 mb-4 md:mb-0 sm:mr-4">
					<Link to="#" className="font-bold">
						Resources
					</Link>
					<Link to="mailto:hello@sparkiq.ai" className="text-sm">
						Contact Us
					</Link>
				</div>
				<div className="flex flex-col gap-3 md:gap-6 mb-4 md:mb-0">
					<Link to="#" className="font-bold">
						Terms and Security
					</Link>
					<Link to="/privacy-policy" className="text-sm">
						Privacy Policy
					</Link>
					<Link to="/terms" className="text-sm">
						Terms of Use
					</Link>
				</div>
			</div>
			<div className="footer-bg h-full w-full absolute top-0 left-0"></div>
		</footer>
	);
};

export default Footer;
