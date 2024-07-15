import { useEffect, useState } from "react";

import Button from "../Button";
import InfoCard from "./InfoCard";
import BrandColors from "../CardIllustrations/BrandColors";
import ImpactfulAds from "../CardIllustrations/ImpactfulAds";

import heroImg from "../../assets/illustrations/hero-img.svg";
import heroShape1 from "../../assets/bg-shapes/hero-1.svg";
import heroShape2 from "../../assets/bg-shapes/hero-2.svg";

import { heroCards } from "../../data";

const Hero = () => {
	const [revealIndex, setRevealIndex] = useState(-1);

	useEffect(() => {
		const interval = setInterval(() => {
			setRevealIndex((prevIndex) => {
				if (prevIndex === heroCards.length - 1) {
					clearInterval(interval);
				}
				return prevIndex + 1;
			});
		}, 1500); // Adjust delay between card reveals as needed

		return () => clearInterval(interval);
	}, []);

	return (
		<div>
			<main
				id="home"
				className="min-h-screen lg:h-[800px] flex justify-center items-center gradient-bg relative lg:mt-14"
			>
				<div className="w-1/2">
					<h1 className="text-6xl py-4 w-3/4 font-bold">
						The Future Of Marketing Is Here
					</h1>
					<p className="text-xl font-normal text-[#4B5563]">
						Harness AI’s potential for impactful Ad campaigns creation
					</p>
					<div className="py-10 flex gap-4">
						<Button type="primary" link="#features" content="Book A Demo" />
						<Button type="secondary" link="#about" content="Talk To Us" />
					</div>
				</div>
				<div className="w-1/2 ">
					<div className="image-container">
						<div
							className="absolute  h-[250px] w-[250px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
							id="hero-img"
						></div>
						<img
							src={heroImg}
							alt=""
							className="w-[70%] my-0 mx-auto animate__animated animate__fadeIn animate__delay-1s"
						/>
						{heroCards.map((card, index) => (
							<InfoCard
								key={index}
								index={index}
								image={card.image}
								title={card.title}
								position={card.position}
								reveal={revealIndex >= index}
								component={
									index === 0 ? (
										<BrandColors />
									) : index === 1 ? (
										<ImpactfulAds />
									) : null
								}
							/>
						))}
					</div>
				</div>
				<img
					src={heroShape1}
					alt=""
					className="absolute top-28 left-[44%] -z-50 animate__animated animate__rotateIn"
				/>
				<img
					src={heroShape2}
					alt=""
					className="absolute top-10 right-0 -z-50 animate__animated animate__slideInRight animate__delay-1s"
				/>
			</main>
		</div>
	);
};

export default Hero;
