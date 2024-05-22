import "animate.css";
import Xarrow from "react-xarrows";

import PropTypes from "prop-types";

const InfoCard = ({ image, title, position, reveal, component, index }) => {
	const positionClass =
		position === "top-right"
			? "-top-10 -right-14"
			: position === "bottom-right"
			? "-bottom-20 right-4"
			: position === "bottom-left"
			? "-bottom-20 left-4"
			: position === "top-left"
			? "-top-24 -left-10"
			: "-top-64 left-[32.5%]";

	return (
		<div
			className={`flex flex-col gap-4 absolute floating-div ${positionClass} ${
				reveal ? "animate__animated animate__fadeIn animate__slow" : "hidden"
			} ${index === 0 || index === 1 ? "!w-[220px] p-4" : "p-2"}`}
			id={position}
		>
			<div>
				<h2 className="text-center px-2 animate__animated animate__fadeIn animate__delay-1s">
					{title}
				</h2>
			</div>
			<div className="relative">
				{component ? (
					component
				) : (
					<img
						src={image}
						alt=""
						width="100%"
						className="animate__animated animate__zoomIn"
						style={{ animationDelay: "800ms" }}
					/>
				)}
			</div>
			{reveal && (
				<Xarrow
					start="hero-img"
					end={position}
					animateDrawing
					showHead={false}
					path="grid"
					gridBreak="0%"
					strokeWidth={1}
					color="#1038AC"
				/>
			)}
		</div>
	);
};

InfoCard.propTypes = {
	image: PropTypes.string,
	title: PropTypes.string.isRequired,
	position: PropTypes.string.isRequired,
	reveal: PropTypes.bool.isRequired,
	component: PropTypes.element,
	index: PropTypes.number.isRequired,
};

export default InfoCard;
