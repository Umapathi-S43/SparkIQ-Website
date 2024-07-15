import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import InfoCard from "./InfoCard";
import InfoGrowth from "../CardIllustrations/InfoGrowth";
import Leads from "../CardIllustrations/Leads";

import infoImg from "../../assets/illustrations/info-img.svg";
import info1 from "../../assets/bg-shapes/info-1.svg";

import { infoCards } from "../../data";

const InfoSection = () => {
	useEffect(() => {
		AOS.init({
			offset: 100,
			duration: 2000,
		});
	}, []);

	return (
		<div id="info" className="min-h-screen flex flex-col justify-center lg:my-24 py-0 px-0">
			<h2 className="text-xl lg:text-6xl text-center xl:mx-52 mb-12 lg:mb-24 font-bold">
				Convert Mundane Marketing Workflow Into AI-Powered Workflow
			</h2>
			<div className="flex flex-col md:flex-row md:justify-between items-center md:gap-12 relative">
				<div className="relative w-full md:w-1/2 mb-4 md:mb-0">
					<img
						src={infoImg}
						alt=""
						className="w-full h-auto"
						data-aos="zoom-in"
					/>
					<div className="absolute sm:-top-10 -top-14 sm:-right-8 -right-14">
						<InfoGrowth />
					</div>
					<div className="absolute sm:-top-6 -top-10 sm:-left-6 -left-10">
						<Leads />
					</div>
				</div>
				<div className="w-full md:w-1/2 flex flex-col items-center md:items-start gap-8 px-0">
					{infoCards.map((card, index) => (
						<div key={index} className="w-full">
							<InfoCard title={card.title} icon={card.icon} />
						</div>
					))}
				</div>
				<img
					src={info1}
					alt=""
					className="absolute -bottom-20 -left-20 -z-50 hidden md:block"
					data-aos="fade-right"
				/>
			</div>
		</div>
	);
};

export default InfoSection;
