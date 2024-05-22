import { useEffect, useState, useRef } from "react";
import AOS from "aos";
import GrowingLine from "../GrowingLine";

import AboutCard from "./AboutCard";

import { aboutCards } from "../../data";

const AboutSection = () => {
	const [height, setHeight] = useState(0);
	const [enteredCards, setEnteredCards] = useState([]); // State to keep track of entered cards
	const cardRefs = useRef([]);

	useEffect(() => {
		// Initialize AOS
		AOS.init({
			offset: 250, // Change offset to trigger animation earlier/later
		});

		// Create a new Intersection Observer
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const index = parseInt(entry.target.id.split("-")[1], 10) - 1;
					const height =
						index === 0
							? 0
							: index === 1
							? 300
							: index === 2
							? 800
							: index === 3
							? 1360
							: index === 4
							? 1870
							: index === 5
							? 2360
							: index === 6 && 2860;

					if (entry.isIntersecting) {
						setEnteredCards((prevEnteredCards) => {
							const newCards = prevEnteredCards.some(
								(card) => card.index === index
							)
								? prevEnteredCards
								: [...prevEnteredCards, { index, height }];

							// Set the height to the height of the object with the biggest index
							const maxHeight = newCards.reduce(
								(max, card) => Math.max(max, card.height),
								0
							);
							setHeight(maxHeight);

							return newCards;
						});
					} else {
						if (index !== 0) {
							setEnteredCards((prevEnteredCards) => {
								const newCards = prevEnteredCards.filter(
									(card) => card.index !== index
								);

								// Set the height to the height of the object with the biggest index
								const maxHeight = newCards.reduce(
									(max, card) => Math.max(max, card.height),
									0
								);
								setHeight(maxHeight);

								return newCards;
							});
						}
					}
				});
			},
			{ threshold: 0.5 } // Intersection threshold
		);

		// Observe each card reference
		cardRefs.current.forEach((ref) => {
			if (ref) {
				observer.observe(ref);
			}
		});

		// Cleanup function for the observer
		return () => observer.disconnect();
	}, []);
	console.log(enteredCards);
	return (
		<div id="about" className="flex flex-col relative my-24">
			<div className="my-24">
				<h2 className="text-[42px] text-center font-bold">
					How Spark IQ Works?
				</h2>
				<p className="text-lg xl:mx-[340px] text-center text-[#6B7280] font-semibold">
					From Brand Setup to Launching the ad campaign, Spark IQ employs AI
					Assist Technology to create awesome ad campaigns that fetch better
					leads and conversions for you.
				</p>
			</div>
			<div className="max-w-[1024px] mx-auto flex flex-col mb-32 relative">
				{aboutCards.map((card, index) => (
					<div
						id={`card-${index + 1}`}
						ref={(el) => (cardRefs.current[index] = el)}
						className="h-20 w-20 z-20 absolute left-1/2"
						style={{
							top: `${
								index == 0
									? 8
									: index == 1
									? 20
									: index == 2
									? 34
									: index == 3
									? 49
									: index == 4
									? 64
									: index == 5
									? 78
									: index == 6 && 94
							}%`,
						}}
						key={index}
					></div>
				))}
				<GrowingLine height={height} />
				{aboutCards.map((card, index) => (
					<AboutCard
						key={index}
						number={index + 1}
						title={card.title}
						description={card.description}
						image={card.image}
						align={card.align}
						last={index === aboutCards.length - 1}
					/>
				))}
			</div>

			<div className="absolute h-full w-full left-0 -top-[50%] about-bg rotate-180"></div>
			<div className="absolute h-full w-full left-0 top-[50%] about-bg"></div>
		</div>
	);
};

export default AboutSection;
