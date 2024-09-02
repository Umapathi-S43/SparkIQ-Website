import { useEffect, useRef, useState } from "react";

const Leads = () => {
	const [leads, setLeads] = useState(-1);
	const leadsRef = useRef(null);

	useEffect(() => {
		let interval;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setLeads(0);
					interval = setInterval(() => {
						setLeads((prev) => (prev < 75 ? prev + 1 : prev));
					}, 30);
				} else {
					clearInterval(interval);
				}
			},
			{ threshold: 0.1 } // Adjust the threshold as needed
		);

		if (leadsRef.current) {
			observer.observe(leadsRef.current);
		}

		return () => {
			clearInterval(interval);
			if (leadsRef.current) {
				observer.unobserve(leadsRef.current);
			}
		};
	}, []);

	const radiusSmall = 15; // Increased radius for smaller screens
	const circumferenceSmall = 2 * Math.PI * radiusSmall;
	const offsetSmall = circumferenceSmall - (leads / 100) * circumferenceSmall;

	const radiusLarge = 20;
	const circumferenceLarge = 2 * Math.PI * radiusLarge;
	const offsetLarge = circumferenceLarge - (leads / 100) * circumferenceLarge;

	return (
		<div
			ref={leadsRef}
			data-aos="fade-right"
			className="lg:w-[220px] md:w-[160px] w-[136px] h-[60px] lg:h-[70px] growth-div rounded-[32px] shadow-lg flex items-center justify-between px-4 gap-4"
		>
			<div className="circular-progress relative">
				<svg width="35" height="35" className="block lg:hidden">
					<circle className="circle-bg" cx="17.5" cy="17.5" r={radiusSmall} />
					<circle
						className="circle"
						cx="17.5"
						cy="17.5"
						r={radiusSmall}
						strokeDasharray={circumferenceSmall}
						strokeDashoffset={offsetSmall}
					/>
					<text
						x="50%"
						y="50%"
						dominantBaseline="middle"
						textAnchor="middle"
						className="text-[8px] font-bold"
					>
						+{leads}%
					</text>
				</svg>
				<svg width="50" height="50" className="hidden lg:block">
					<circle className="circle-bg" cx="25" cy="25" r={radiusLarge} />
					<circle
						className="circle"
						cx="25"
						cy="25"
						r={radiusLarge}
						strokeDasharray={circumferenceLarge}
						strokeDashoffset={offsetLarge}
					/>
					<text
						x="50%"
						y="50%"
						dominantBaseline="middle"
						textAnchor="middle"
						className="text-[10px] font-bold"
					>
						+{leads}%
					</text>
				</svg>
			</div>

			<div>
				<p className="lg:text-[18px] text-[10px] font-[700] text-wrap">New Leads Per Month</p>
			</div>
		</div>
	);
};

export default Leads;