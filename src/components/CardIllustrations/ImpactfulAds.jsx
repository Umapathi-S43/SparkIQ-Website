import impactfulAds from "../../assets/card-images/impactful-ads.png";

const ImpactfulAds = () => {
	return (
		<div className="flex items-center gap-4 px-2 overflow-hidden">
			<div className="animate__animated animate__zoomIn animate__delay-1s">
				<img src={impactfulAds} alt="" />
			</div>
			<div className="flex flex-col gap-2">
				<div className="bg-[#1038AC] w-[76px] h-[16px] rounded-xl animate__animated animate__fadeInRight animate__delay-1s"></div>
				<div className="flex flex-col gap-1">
					<div className="bg-[#D1D1D1] w-[76px] h-[6px] rounded-xl animate__animated animate__fadeInRight animate__delay-2s animate__faster"></div>
					<div className="bg-[#D1D1D1] w-[76px] h-[6px] rounded-xl animate__animated animate__fadeInRight animate__delay-2s animate__fast"></div>
					<div className="bg-[#D1D1D1] w-[76px] h-[6px] rounded-xl animate__animated animate__fadeInRight animate__delay-2s "></div>
				</div>
			</div>
		</div>
	);
};

export default ImpactfulAds;
