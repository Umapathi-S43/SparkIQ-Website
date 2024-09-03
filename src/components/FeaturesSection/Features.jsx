import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // Ensure AOS styles are imported

import Button from "../Button";

import features1 from "../../assets/card-images/features-1.png";
import features2 from "../../assets/card-images/features-2.png";
import bgRectangleBig from "../../assets/bg-shapes/info-1.svg";

import BrandColors from "../CardIllustrations/BrandColors";
import Leads from "../CardIllustrations/Leads";

const Features = () => {
    useEffect(() => {
        AOS.init({
            offset: 200,
        });
    }, []);

    return (
        <div id="features" className="flex flex-col my-24 lg:my-52 gap-20 lg:gap-80">
            <div className="flex flex-col lg:flex-row justify-around items-center gap-8 lg:gap-0">
                <div className="flex flex-col w-full lg:w-1/2 items-start justify-center lg:gap-8 px-4 lg:px-0">
                    <h2 className="text-3xl lg:text-5xl font-semibold">Creative Platform</h2>
                    <p className="text-lg lg:text-xl text-[#6B7280] font-semibold mb-4">
                        Spark IQ leverages AI to suggest brand-centric colors, craft impactful ad and product descriptions, and offer tailored ad templates for cohesive branding.
                    </p>
                    <Button type="primary" link="#features" content="Book A Demo" className="whitespace-nowrap mt-6 sm:mt-0 sm:whitespace-normal" />
                </div>
                <div className="relative w-full lg:w-auto lg:mt-0 mt-14">
                    <img data-aos="zoom-in" src={features1} alt="" className="w-full" />
                    <img 
                        data-aos="fade-up-right" 
                        src={bgRectangleBig} 
                        alt="" className="absolute w-28 lg:w-44 -bottom-10 lg:-bottom-14 -left-10 lg:-left-14 -z-50" />
                    <div className="absolute -top-20 lg:-top-20 -left-24 sm:-left-28 md:-left-24 lg:-left-48 floating-div" data-aos="fade-down-right">
                        <div className="flex flex-col absolute floating-div animate__animated animate__fadeIn animate__slow p-2 bg-white rounded-lg shadow-lg lg:w-64 md:w-60 sm:w-48 w-40">
                            <div>
                                <h2 className="text-center px-1 text-xs sm:text-sm md:text-base lg:text-xl animate__animated animate__fadeIn animate__delay-1s">
                                    Quick Brand And Product Setup
                                </h2>
                            </div>
                            <div className="relative lg:mt-0 mt-1">
                                <BrandColors />
                            </div>
                        </div>
                    </div>
                    <img data-aos="fade-left" src={bgRectangleBig} alt="" className="absolute w-28 lg:w-72 -top-10 lg:-top-36 -right-10 lg:-right-44 -z-50" />
                </div>
            </div>
            <div className="flex flex-col-reverse lg:flex-row justify-between items-center gap-8 lg:gap-0">
                <div className="relative w-full lg:w-auto">
                    <img data-aos="zoom-in" src={features2} alt="" className="w-full" />
                    <div className="absolute -top-10 -right-10">
                        <Leads />
                    </div>
                    <img data-aos="fade-up-left" src={bgRectangleBig} alt="" className="absolute w-28 lg:w-44 -bottom-10 lg:-bottom-14 -right-10 lg:-right-14 -z-50" />
                    <img data-aos="fade-right" src={bgRectangleBig} alt="" className="absolute w-28 lg:w-64 -top-10 lg:-top-32 -left-10 lg:-left-44 -z-50" />
                </div>
                <div className="flex flex-col w-full lg:w-1/2 items-start justify-center gap-8 px-4 lg:px-0 mb-8">
                    <h2 className="text-3xl lg:text-5xl font-semibold">Analytics Platform</h2>
                    <p className="text-lg lg:text-xl text-[#6B7280] font-semibold">
                        Utilizing AI, Spark IQ predicts ad performance within campaign timelines, offering valuable insights for customized ad optimization, increased lead generation, and enhanced conversions.
                    </p>
                    <Button type="primary" link="#features" content="Book A Demo" />
                </div>
            </div>
        </div>
    );
};

export default Features;
