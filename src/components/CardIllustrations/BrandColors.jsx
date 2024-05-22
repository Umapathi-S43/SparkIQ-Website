import { useState, useEffect, useRef } from "react";

import brandColors from "../../assets/card-images/brand-colors.png";

const BrandColors = () => {
	const [isVisible, setIsVisible] = useState(false);
	const brandColorsRef = useRef(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				setIsVisible(entry.isIntersecting);
			},
			{
				root: null,
				rootMargin: "0px",
				threshold: 0.1, // Adjust threshold as per your requirement
			}
		);

		if (brandColorsRef.current) {
			observer.observe(brandColorsRef.current);
		}

		return () => {
			if (brandColorsRef.current) {
				observer.unobserve(brandColorsRef.current);
			}
		};
	}, []);
	return (
		<div
			ref={brandColorsRef}
			className="flex gap-2 items-center overflow-hidden"
		>
			<div
				className={`animate__animated ${
					isVisible && "animate__zoomIn animate__delay-1s"
				}`}
			>
				<img src={brandColors} alt="" />
			</div>
			<div className="flex flex-col gap-2 items-center">
				<p
					className={`text-[#082A66] animate__animated ${
						isVisible && "animate__fadeInRight animate__delay-1s"
					}`}
				>
					Brand Colors
				</p>
				<div className="flex gap-2">
					<div
						className={`h-4 w-4 rounded-full bg-[#FEA92D] animate__animated ${
							isVisible && "animate__fadeIn"
						}`}
						style={{ animationDelay: "1400ms" }}
					></div>
					<div
						className={`h-4 w-4 rounded-full bg-[#FA2AA7] animate__animated ${
							isVisible && "animate__fadeIn"
						}`}
						style={{ animationDelay: "1800ms" }}
					></div>
					<div
						className={`h-4 w-4 rounded-full bg-[#47EBDE] animate__animated ${
							isVisible && "animate__fadeIn "
						}`}
						style={{ animationDelay: "2200ms" }}
					></div>
					<div
						className={`h-4 w-4 rounded-full bg-[#559D52] animate__animated ${
							isVisible && "animate__fadeIn "
						}`}
						style={{ animationDelay: "2600ms" }}
					></div>
				</div>
			</div>
		</div>
	);
};

export default BrandColors;
