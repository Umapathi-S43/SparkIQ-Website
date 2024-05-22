import { useEffect } from "react";
import AOS from "aos";

import Cards from "./Cards";

import bgBall from "../../assets/bg-shapes/ball.svg";

const Pricing = () => {
	useEffect(() => {
		AOS.init({
			duration: 1200,
		});
	}, []);
	return (
		<div
			id="pricing"
			className="flex flex-col items-center justify-center relative"
		>
			<div className="text-sm text-center">
				<p className="text-[#64748B] font-bold">Scale as you grow</p>
				<h2 className="text-4xl my-4">Pricing</h2>
				<p className="text-[#64748B]">
					Choose a plan that suits your business best
				</p>
			</div>
			<div className="relative py-12">
				<Cards />
				<img
					data-aos="fade-left"
					src={bgBall}
					alt=""
					className="absolute top-0 right-1/2 -z-50"
				/>
			</div>

			<div className="absolute h-[3800px] w-full pricing-bg left-0 -top-[150%] rotate-180"></div>
		</div>
	);
};

export default Pricing;
