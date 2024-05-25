import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
const Footer = () => {
	return (
		<footer className="flex h-[230px] p-12 relative items-center px-[6rem]">
			<div className="w-1/2">
				<img src={logo} alt="" className="w-[158px]" />
			</div>
			<div className="w-1/2 flex justify-between">
				<div className="flex flex-col gap-6">
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
				<div className="flex flex-col gap-6">
					<Link to="#" className="font-bold">
						Resources
					</Link>
					<Link to="#" className="text-sm">
						Contact Us
					</Link>
				</div>
				<div className="flex flex-col gap-6">
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
