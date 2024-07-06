import PropTypes from "prop-types";

const AboutCard = ({ title, description, image, align, number }) => {
	const cardReverse = align === "right" ? "flex-row-reverse" : "flex-row";

	return (
		<div
			data-aos={number % 2 === 0 ? "fade-left" : "fade-right"}
			className={`flex flex-col md:${cardReverse} justify-between items-center relative md:gap-10 lg:gap-24 xl:gap-52 py-12 md:py-24`}
		>
			<div className="w-full md:w-1/2 pl-0 md:pl-8 text-center md:text-left">
				<h3 className="text-2xl md:text-[28px] lg:text-[36px] xl:text-[42px] leading-tight md:leading-[34px] lg:leading-[42px] xl:leading-[50px] pb-4 md:pb-8 font-semibold">
					{title}
				</h3>
				<p className="text-base md:text-lg text-[#6B7280]">{description}</p>
			</div>
			<div className="w-full md:w-1/2 flex justify-center md:justify-end mt-6 md:mt-0">
				<img data-aos={`zoom-in-${align}`} src={image} alt="" className="w-full max-w-xs md:max-w-md lg:max-w-lg" />
			</div>
			<div className="w-full h-[200px] md:w-[410px] md:h-[190px] lg:w-[620px] lg:h-[280px] xl:w-[820px] xl:h-[380px] absolute about-card-bg rounded-3xl"></div>
			<div className="absolute left-1/2 transform -translate-x-1/2 bg-white w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full text-2xl md:text-2xl lg:text-3xl text-center pt-1 md:pt-1.5 lg:pt-2 text-[#0086CD]">
				{number}
			</div>
		</div>
	);
};

AboutCard.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	image: PropTypes.string.isRequired,
	align: PropTypes.string.isRequired,
	number: PropTypes.number.isRequired,
	last: PropTypes.bool.isRequired,
};

export default AboutCard;
