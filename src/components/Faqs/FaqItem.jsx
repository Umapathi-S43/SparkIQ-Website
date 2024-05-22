import PropTypes from "prop-types";

const FaqItem = ({ num, question, answer, isOpen, toggleAccordion }) => {
	return (
		<div className="px-20">
			<button
				className="w-full flex justify-between items-center py-2 px-4"
				onClick={toggleAccordion}
			>
				<span className="text-[28px] text-[#0086CD] font-bold">
					{num < 10 ? `0${num}` : num}
				</span>
				<span className="text-2xl w-1/2 text-left font-bold">{question}</span>
				<span className="flex justify-center items-center h-10 w-10 bg-[#0086CD] rounded-full text-white text-[28px]">
					{isOpen ? "-" : "+"}
				</span>
			</button>
			<div className="flex items-center justify-center">
				<div
					className={`mt-2 mr-2 transition-all duration-300 text-left text-[15px] w-1/2 px-2 ${
						isOpen
							? "max-h-96 opacity-100"
							: "max-h-0 opacity-0 overflow-hidden"
					}`}
				>
					{answer.split("\n").map((line, index) => (
						<p key={index}>{line}</p>
					))}
				</div>
			</div>
		</div>
	);
};

FaqItem.propTypes = {
	num: PropTypes.number.isRequired,
	question: PropTypes.string.isRequired,
	answer: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	toggleAccordion: PropTypes.func.isRequired,
};

export default FaqItem;
