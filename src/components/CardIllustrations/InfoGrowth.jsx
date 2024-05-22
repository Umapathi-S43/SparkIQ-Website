import { useState, useEffect, useRef } from "react";

import chartLineUp from "../../assets/icons/chart-line-up.svg";

const InfoGrowth = () => {
	const [growth, setGrowth] = useState(-12);
	const growthRef = useRef(null);

	useEffect(() => {
		let interval;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setGrowth(0);
					interval = setInterval(() => {
						setGrowth((prev) => (prev < 12 ? prev + 1 : prev));
					}, 100);
				} else {
					clearInterval(interval);
				}
			},
			{ threshold: 0.1 } // Adjust the threshold as needed
		);

		if (growthRef.current) {
			observer.observe(growthRef.current);
		}

		return () => {
			clearInterval(interval);
			if (growthRef.current) {
				observer.unobserve(growthRef.current);
			}
		};
	}, []);
	return (
		<div className="relative" ref={growthRef}>
			<div
				data-aos="zoom-in"
				className=" w-20 h-20 rounded-[32px] growth-div flex items-center justify-center shadow-lg"
			>
				<img src={chartLineUp} alt="" />
			</div>
			<div
				data-aos="fade-left"
				className="absolute bg-[#10b981] w-20 h-[34px] rounded-xl flex items-center justify-center text-white font-bold -top-5 -right-10 shadow-md"
			>
				<p>+{growth}%</p>
			</div>
		</div>
	);
};

export default InfoGrowth;
