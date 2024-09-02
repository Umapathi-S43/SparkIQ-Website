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
    const [currentIndex, setCurrentIndex] = useState(0);

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

    useEffect(() => {
        const autoNext = setInterval(() => {
            handleNext();
        }, 5000); // Automatically move to the next card after 30 seconds

        return () => clearInterval(autoNext);
    }, [currentIndex]);

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex < heroCards.length - 1 ? prevIndex + 1 : 0
        );
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : heroCards.length - 1
        );
    };

    return (
        <div>
            <main
                id="home"
                className="min-h-screen lg:h-[800px] flex flex-col lg:flex-row justify-center items-center gradient-bg relative sm:mt-20 sm:mb-8 lg:mt-14"
            >
                <div className="w-full lg:w-1/2 px-4 lg:px-0 text-center lg:text-left">
                    <h1 className="text-4xl lg:text-6xl py-4 w-full lg:w-3/4 font-bold mt-20 lg:mt-0">
                        The Future Of Marketing Is Here
                    </h1>
                    <p className="text-lg lg:text-xl font-normal text-[#4B5563]">
                        Harness AI’s potential for impactful Ad campaigns creation
                    </p>
					<div className="block lg:hidden relative mt-80  mx-0 sm:mx-auto">
                            <InfoCard
                                key={currentIndex}
                                index={currentIndex}
                                image={heroCards[currentIndex].image}
                                title={heroCards[currentIndex].title}
                                position="center"
                                reveal={true}
                                component={
                                    currentIndex === 0 ? (
                                        <BrandColors />
                                    ) : currentIndex === 1 ? (
                                        <ImpactfulAds />
                                    ) : null
                                }
                            />
                        </div>
                    <div className="py-6 lg:py-10 flex gap-4 justify-center lg:justify-start">
                        <Button type="primary" link="#features" content="Book A Demo" />
                        <Button type="secondary" link="#about" content="Talk To Us" />
                    </div>
                </div>
                <div className="w-full lg:w-1/2 relative flex justify-center">
                    <div className="image-container">
                        <div
                            className="absolute h-[200px] lg:h-[250px] w-[200px] lg:w-[250px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden lg:block"
                            id="hero-img"
                        ></div>
                        <img
                            src={heroImg}
                            alt=""
                            className="w-[70%] my-0 mx-auto animate__animated animate__fadeIn animate__delay-1s hidden lg:block"
                        />
                        <div className="hidden lg:block -ml-16">
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
                </div>
                <img
                    src={heroShape1}
                    alt=""
                    className="absolute top-28 lg:left-[44%] left-[6%] -z-50 animate__animated animate__rotateIn "
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