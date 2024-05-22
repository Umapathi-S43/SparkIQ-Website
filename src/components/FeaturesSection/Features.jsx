import { useEffect } from "react";
import AOS from "aos";

import Button from "../Button";

import features1 from "../../assets/card-images/features-1.png";
import features2 from "../../assets/card-images/features-2.png";
import bgRectangleBig from "../../assets/bg-shapes/info-1.svg";

import BrandColors from "../CardIllustrations/BrandColors";
import Leads from "../CardIllustrations/Leads";
// import infoLeads from "../../assets/illustrations/info-leads.svg";

const Features = () => {
	useEffect(() => {
		AOS.init({
			offset: 200,
		});
	}, []);
	return (
		<div id="features" className="flex flex-col my-52 gap-80">
			<div className="flex justify-around items-center">
				<div className="flex flex-col w-1/2 items-start justify-center gap-8">
					<h2 className="text-5xl font-semibold">Creative Platform</h2>
					<p className="text-xl text-[#6B7280] font-semibold">
						Spark IQ leverages AI to suggest brand-centric colors, craft
						impactful ad and product descriptions, and offer tailored ad
						templates for cohesive branding.
					</p>
					<Button type="primary" link="#features" content="Book A Demo" />
				</div>
				<div className="relative">
					<img data-aos="zoom-in" src={features1} alt="" className="w-full" />
					<img
						data-aos="fade-up-right"
						src={bgRectangleBig}
						alt=""
						className="absolute w-44 -bottom-14 -left-14 -z-50"
					/>
					<div
						className="absolute -top-20 -left-32 floating-div"
						data-aos="fade-down-right"
					>
						<div className="flex flex-col gap-4 absolute floating-div animate__animated animate__fadeIn animate__slow p-2">
							<div>
								<h2 className="text-center px-2 animate__animated animate__fadeIn animate__delay-1s">
									Quick Brand And Product Setup
								</h2>
							</div>
							<div className="relative">
								<BrandColors />
							</div>
						</div>
					</div>
					<img
						data-aos="fade-left"
						src={bgRectangleBig}
						alt=""
						className="absolute -right-44 -top-44 -z-50"
					/>
				</div>
			</div>
			<div className="flex justify-between items-center gap-8">
				<div className="relative">
					<img data-aos="zoom-in" src={features2} alt="" />

					<div className="absolute -top-10 -right-10">
						<Leads />
					</div>
					<img
						data-aos="fade-up-left"
						src={bgRectangleBig}
						alt=""
						className="absolute w-44 -bottom-14 -right-14 -z-50"
					/>
					<img
						data-aos="fade-right"
						src={bgRectangleBig}
						alt=""
						className="absolute -left-44 -top-32 -z-50"
					/>
				</div>
				<div className="flex flex-col w-1/2 items-start justify-center gap-8">
					<h2 className="text-5xl font-semibold">Analytics Platform</h2>
					<p className="text-xl text-[#6B7280] font-semibold">
						Utilizing AI, Spark IQ predicts ad performance within campaign
						timelines, offering valuable insights for customized ad
						optimization, increased lead generation, and enhanced conversions.
					</p>
					<Button type="primary" link="#features" content="Book A Demo" />
				</div>
			</div>
		</div>
	);
};

export default Features;
