import React, { useState, useEffect } from "react";
import AOS from "aos";

import FaqItem from "./FaqItem";

import bgFaq from "../../assets/bg-shapes/faq.png";

import { faqs } from "../../data";

const Faqs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    AOS.init();
  }, []);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div id="faq" className="relative flex flex-col items-center mb-24">
      <h2 className="text-[44px] mb-20 font-bold">Frequently Asked Questions</h2>
      <img
        data-aos="fade-left"
        src={bgFaq}
        alt=""
        className="absolute -top-14 -right-14 -z-50"
      />
      <div className="px-4 md:px-24">
        <div className="w-full bg-[#E5F6FF] p-4 md:p-10 px-4 md:px-10 rounded-3xl border-[#0086CD] border-4">
          {faqs.map((faq, index) => (
            <React.Fragment key={index}>
              <FaqItem
                num={index + 1}
                question={faq.question}
                answer={faq.answer}
                isOpen={activeIndex === index}
                toggleAccordion={() => toggleAccordion(index)}
              />
              {index !== faqs.length - 1 && <hr />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faqs;
