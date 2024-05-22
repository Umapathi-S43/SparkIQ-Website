import logo from "../assets/logo.png";
const Footer = () => {
	return (
		<footer className="flex h-[230px] p-12 relative items-center px-[6rem]">
			<div className="w-1/2">
				<img src={logo} alt="" className="w-[158px]" />
			</div>
			<div className="w-1/2 flex justify-between">
				<div className="flex flex-col gap-6">
					<a href="#" className="font-bold">
						About
					</a>
					<a href="#" className="text-sm">
						Our Customers
					</a>
					<a href="#" className="text-sm">
						Success Story
					</a>
				</div>
				<div className="flex flex-col gap-6">
					<a href="#" className="font-bold">
						Resources
					</a>
					<a href="#" className="text-sm">
						Contact Us
					</a>
				</div>
				<div className="flex flex-col gap-6">
					<a href="#" className="font-bold">
						Terms and Security
					</a>
					<a href="#" className="text-sm">
						Privacy Policy
					</a>
					<a href="#" className="text-sm">
						Terms of Use
					</a>
				</div>
			</div>
			<div className="footer-bg h-full w-full absolute top-0 left-0"></div>
		</footer>
	);
};

export default Footer;
