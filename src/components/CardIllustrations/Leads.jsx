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

	const radius = 20;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (leads / 100) * circumference;

	return (
		<div
			ref={leadsRef}
			data-aos="fade-right"
			className="w-[220px] h-[70px] growth-div rounded-[32px] shadow-lg flex items-center justify-between px-4 gap-4"
		>
			<div className="circular-progress">
				<svg width="50" height="50">
					<circle className="circle-bg" cx="25" cy="25" r={radius} />
					<circle
						className="circle"
						cx="25"
						cy="25"
						r={radius}
						strokeDasharray={circumference}
						strokeDashoffset={offset}
					/>
				</svg>
				<span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold">
					+{leads}%
				</span>
			</div>

			<div>
				<p className="text-[18px] font-[700] text-wrap">New Leads Per Month</p>
			</div>
		</div>
	);
};

export default Leads;
