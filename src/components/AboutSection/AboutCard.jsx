import PropTypes from "prop-types";

const AboutCard = ({ title, description, image, align, number }) => {
	const cardReverse = align === "right" ? "flex-row-reverse" : "flex-row";

	return (
		<div
			data-aos={number % 2 === 0 ? "fade-left" : "fade-right"}
			className={`flex ${cardReverse} justify-between items-center relative xl:gap-52 py-24`}
		>
			<div className="w-1/2 pl-8">
				<h3 className="text-[42px] leading-[50px] pb-8 font-semibold">
					{title}
				</h3>
				<p className="text-lg text-[#6B7280]">{description}</p>
			</div>
			<div className="w-1/2 flex justify-center">
				<img data-aos={`zoom-in-${align}`} src={image} alt="" className="" />
			</div>
			<div className="w-[820px] h-[380px] absolute about-card-bg rounded-3xl"></div>
			<div className="absolute left-1/2 bg-white w-14 h-14 rounded-[50%] text-3xl text-center pt-2 text-[#0086CD]">
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
