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
				className="w-16 h-16 lg:w-20 lg:h-20 rounded-[32px] growth-div flex items-center justify-center shadow-lg"
			>
				<img src={chartLineUp} alt="" className="w-8 h-8 sm:w-10 sm:h-10" />
			</div>
			<div
				data-aos="fade-left"
				className="absolute bg-[#10b981] w-16 h-[28px] sm:w-20 sm:h-[34px] rounded-xl flex items-center justify-center text-white font-bold text-xs sm:text-base -top-4 sm:-top-5 -right-8 sm:-right-10 shadow-md"
			>
				<p>+{growth}%</p>
			</div>
		</div>
	);
};

export default InfoGrowth;
