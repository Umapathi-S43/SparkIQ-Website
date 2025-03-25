import Button from "../Button";
import checkRound from "../../assets/icons/check-round.svg";
import { pricingPlans } from "../../data"; // Import the new pricing data

const Cards = () => {
  return (
    <div className="flex gap-8 font-semibold">
      {pricingPlans.map((plan) => (
        <div
          key={plan.plan}
          className={`h-[550px] w-[350px] rounded-xl p-10 pricing-card ${
            plan.plan === "Growth" ? "main-price" : ""
          }`}
        >
          {plan.plan === "Scale" && (
            <div className="absolute py-2 px-4 bg-[#1E2937] rounded-3xl text-white flex top-8 right-6 uppercase text-xs">
              <p>
                <span className="">👑</span> Best offer
              </p>
            </div>
          )}

          <h4 className="text-xl font-semibold">{plan.plan}</h4>
          <div className="relative my-6">
            <h3 className="text-4xl font-semibold">{plan.price}</h3>
            <p className="text-[#334155] absolute left-24 bottom-0 font-semibold opacity-50">
              /month
            </p>
          </div>
          <p className="text-sm">{plan.description}</p>
          <div>
            <ul className="text-sm py-6">
              {plan.features.map((feature) => (
                <li key={feature.id} className="flex gap-4 my-2 items-center">
                  <img src={checkRound} alt="" />
                  <p>{feature.content}</p>
                </li>
              ))}
            </ul>
          </div>
          <Button
            type={plan.plan === "Growth" ? "blue" : "primary"}
            link="#pricing"
            content={`Choose ${plan.plan} Plan`}
          />
        </div>
      ))}
    </div>
  );
};

export default Cards;
