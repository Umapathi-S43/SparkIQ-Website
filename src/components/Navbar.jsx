import { Link } from "react-scroll";

import Button from "./Button";

import sparkLogo from "../assets/logo.png";

const Navbar = () => {
	return (
		<nav className="flex justify-between items-center h-14 my-4 max-w-[1200px] mx-auto text-sm">
			<img src={sparkLogo} alt="spark logo" className="w-[158px]" />
			<ul className="flex justify-between gap-14">
				<li className="cursor-pointer">
					<Link to="home" smooth={true} duration={500}>
						Home
					</Link>
				</li>
				<li className="cursor-pointer">
					<Link to="about" smooth={true} duration={500}>
						How Spark IQ Works
					</Link>
				</li>
				<li className="cursor-pointer">
					<Link to="features" smooth={true} duration={500}>
						Features
					</Link>
				</li>
				<li className="cursor-pointer">
					<Link to="faq" smooth={true} duration={500}>
						FAQ
					</Link>
				</li>
				<li className="cursor-pointer">
					<Link to="pricing" smooth={true} duration={500}>
						Pricing
					</Link>
				</li>
				<li className="cursor-pointer">
					<Link to="contact" smooth={true} duration={500}>
						Contact
					</Link>
				</li>
			</ul>

			<Button type="primary" link="#login" content="Login" />
		</nav>
	);
};

export default Navbar;
