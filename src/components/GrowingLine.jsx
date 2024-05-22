import PropTypes from "prop-types";
const GrowingLine = ({ height }) => {
	return (
		<div className="vertical-line" style={{ height: `${height}px` }}></div>
	);
};

GrowingLine.propTypes = {
	height: PropTypes.number.isRequired,
};

export default GrowingLine;
