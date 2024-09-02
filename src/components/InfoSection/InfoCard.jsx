import PropTypes from "prop-types";

const InfoCard = ({ title, icon }) => {
	return (
		<div data-aos="fade-up" className="w-full">
			<div className="flex gap-4 bg-[#DEEEF7] p-4 sm:p-6 rounded-xl w-full items-center">
				<img src={icon} alt="icon" className="w-12 h-12 sm:w-16 sm:h-16" />
				<h3 className="text-lg sm:text-xl lg:text-3xl flex-1">{title}</h3>
			</div>
		</div>
	);
};

InfoCard.propTypes = {
	title: PropTypes.string.isRequired,
	icon: PropTypes.string.isRequired,
};

export default InfoCard;