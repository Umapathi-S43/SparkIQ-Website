import { useEffect } from "react";
import AOS from "aos";

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
		<div
			id="info"
			className="min-h-screen flex flex-col justify-center lg:my-24"
		>
			<h2 className="text-[42px] text-center xl:mx-52 mb-24 font-bold">
				Convert Mundane Marketing Workflow Into AI-Powered Workflow
			</h2>
			<div className="flex justify-between items-center relative md:gap-12">
				<div className="relative">
					<img src={infoImg} alt="" data-aos="zoom-in" />
					<div className="absolute -top-14 -right-14">
						<InfoGrowth />
					</div>
					<div className="absolute -top-10 -left-10">
						<Leads />
					</div>
				</div>
				<div>
					<div className="flex flex-col gap-8 font-semibold">
						{infoCards.map((card, index) => (
							<InfoCard key={index} title={card.title} icon={card.icon} />
						))}
					</div>
				</div>
				<img
					src={info1}
					data-aos="fade-right"
					className="absolute -bottom-20 -left-10 -z-50"
				/>
			</div>
		</div>
	);
};

export default InfoSection;
