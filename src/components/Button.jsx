import PropTypes from "prop-types";

const Button = ({ type, link, content }) => {
	const buttonType =
		type === "primary"
			? "text-white gradient-button-primary"
			: type === "blue"
			? "bg-[#0086CD] text-white"
			: "bg-white text-[#FF3067]";
	return (
		<button className={`${buttonType} p-3 px-6  rounded-xl font-semibold`}>
			<a href={link}>{content}</a>
		</button>
	);
};

Button.propTypes = {
	type: PropTypes.string.isRequired,
	link: PropTypes.string.isRequired,
	content: PropTypes.string.isRequired,
};

export default Button;
