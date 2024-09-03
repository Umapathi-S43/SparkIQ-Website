import PropTypes from "prop-types";

const AboutCard = ({ title, description, image, align, number, last }) => {
	const cardReverse = align === "right" ? "flex-row-reverse" : "flex-row";

	return (
		<div
			data-aos={number % 2 === 0 ? "fade-left" : "fade-right"}
			className={`flex ${cardReverse} justify-between items-center relative xl:gap-52 py-24 about-card-container`}
		>
			{/* Number (Moved to the top for smaller screens) */}
			<div className="lg:hidden absolute top-0 left-1/2 transform -translate-x-1/2 mb-1 about-card-number">
				<div className="bg-white w-14 h-14 rounded-full text-3xl text-center pt-2 text-[#0086CD]">
					{number}
				</div>
			</div>

			{/* Content */}
			<div className="w-full lg:w-1/2 lg:pl-8 text-center lg:text-left mt-4 lg:mt-0">
				<h3 className="lg:text-[42px] text-[24px] leading-[50px] lg:pb-8 pb-1 font-semibold">
					{title}
				</h3>
				<p className="lg:text-lg text-sm text-[#6B7280]">{description}</p>
			</div>

			{/* Image on Larger Screens */}
			<div className="hidden lg:flex w-1/2 justify-center">
				<img data-aos={`zoom-in-${align}`} src={image} alt="" className="" />
			</div>

			{/* Background Shape */}
			<div className="w-[820px] h-[380px] absolute about-card-bg rounded-3xl"></div>

			{/* Number (For larger screens, it's in the original position) */}
			<div className={`hidden lg:block absolute ${last ? "number-last" : "number"} left-1/2 transform -translate-x-1/2 bg-white w-14 h-14 rounded-full text-3xl text-center pt-2 about-card-number`}>
				{number}
			</div>

			<style jsx>{`
				@media (max-width: 1024px) {
					.about-card-container {
						flex-direction: column !important; /* Stack items vertically */
						align-items: center; /* Center items horizontally */
						text-align: center; /* Center text */
						padding-top: 40px; /* Add space for the number above */
						margin-bottom: 50px; /* Add space below each card */
					}

					.about-card-container .relative {
						background: #e0f7fa; /* Add background color */
						border-radius: 16px; /* Ensure the background has rounded corners */
						padding: 20px; /* Add padding for spacing */
						margin-bottom: 24px; /* Space between cards */
					}

					.about-card-container .hidden.lg\\:flex {
						display: none !important; /* Hide the image on smaller screens */
					}

					.about-card-container .about-card-bg {
						display: none; /* Hide the background on smaller screens */
					}

					.about-card-number {
						position: absolute;
						top: -20px; /* Adjust position relative to content */
					}
				}

				@media (min-width: 1025px) {
					.about-card-number {
						left: 51%; /* Center the number on larger screens */
						transform: translateX(-50%); /* Ensure it's perfectly centered */
					}
				}
			`}</style>
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
