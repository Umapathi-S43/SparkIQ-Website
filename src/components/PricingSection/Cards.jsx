import Button from "../Button";

import checkRound from "../../assets/icons/check-round.svg";

import { proFeatures, starterFeatures } from "../../data";

const Cards = () => {
	return (
		<div className="flex gap-8 font-semibold">
			<div className="h-[550px] w-[350px]  rounded-xl p-10 pricing-card">
				<h4 className="text-xl font-semibold">Essential</h4>
				<div className="relative my-6">
					<h3 className="text-4xl font-semibold">$10</h3>
					<p className="text-[#334155] absolute left-24 bottom-0 font-semibold opacity-50">
						/month
					</p>
				</div>
				<p className="text-sm">
					Elevate Your Nutrition Journey with the Basics!
				</p>
				<div>
					<ul className="text-sm py-6">
						{starterFeatures.map((feature) => (
							<li key={feature.id} className="flex gap-4 my-2 items-center">
								<img src={checkRound} alt="" />
								<p>{feature.content}</p>
							</li>
						))}
					</ul>
				</div>
				<Button type="blue" link="#pricing" content="Choose Pro Plan" />
			</div>
			<div className="h-[550px] w-[350px] rounded-xl p-10 relative pricing-card main-price">
				<div className="absolute py-2 px-4 bg-[#1E2937] rounded-3xl text-white flex top-8 right-6 uppercase text-xs">
					<p>
						<span className="">👑</span> Best offer
					</p>
				</div>
				<h4 className="text-xl font-semibold">Pro</h4>
				<div className="relative my-6">
					<h3 className="text-4xl font-semibold">$50</h3>
					<p className="text-[#334155] absolute left-24 bottom-0 font-semibold opacity-50">
						/month
					</p>
				</div>
				<p className="text-sm">
					Healthy choices for a vibrant and peaceful journey like a Pro
				</p>
				<div>
					<ul className="text-sm py-6">
						{proFeatures.map((feature) => (
							<li key={feature.id} className="flex gap-4 my-2 items-center">
								<img src={checkRound} alt="" />
								<p>{feature.content}</p>
							</li>
						))}
					</ul>
				</div>
				<Button type="primary" link="#pricing" content="Choose Pro Plan" />
			</div>
			<div className="h-[550px] w-[350px] rounded-xl p-10 pricing-card">
				<h4 className="text-xl font-semibold">Premium</h4>
				<div className="relative my-6">
					<h3 className="text-4xl font-semibold">$75+</h3>
					<p className="text-[#334155] absolute left-24 bottom-0 font-semibold opacity-50">
						/month
					</p>
				</div>
				<p className="text-sm">
					Start strong in your nutrition journey with the premium offers
				</p>
				<div>
					<ul className="text-sm py-6">
						{starterFeatures.map((feature) => (
							<li key={feature.id} className="flex gap-4 my-2 items-center">
								<img src={checkRound} alt="" />
								<p>{feature.content}</p>
							</li>
						))}
					</ul>
				</div>
				<Button type="blue" link="#pricing" content="Request An Offer" />
			</div>
		</div>
	);
};

export default Cards;
