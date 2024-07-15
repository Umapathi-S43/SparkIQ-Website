import PropTypes from "prop-types";

const InfoCard = ({ title, icon }) => {
	return (
		<div data-aos="fade-up">
			<div className="flex gap-4 bg-[#DEEEF7] p-9 rounded-xl">
				<img src={icon} alt="icon" />
				<h3 className="text-3xl ml-4">{title}</h3>
			</div>
		</div>
	);
};

InfoCard.propTypes = {
	title: PropTypes.string.isRequired,
	icon: PropTypes.string.isRequired,
};

export default InfoCard;
