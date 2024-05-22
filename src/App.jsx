import Navbar from "./components/Navbar";
import Hero from "./components/HeroSection/Hero";
import InfoSection from "./components/InfoSection/InfoSection";
import AboutSection from "./components/AboutSection/AboutSection";
import Features from "./components/FeaturesSection/Features";
import Pricing from "./components/PricingSection/Pricing";
import Faqs from "./components/Faqs/Faqs";
import Footer from "./components/Footer";

function App() {
	return (
		<div className="overflow-hidden">
			<Navbar />
			<Hero />
			<div className="px-[6rem]">
				<InfoSection />
				<AboutSection />
				<Features />
				<Pricing />
				<Faqs />
			</div>
			<Footer />
		</div>
	);
}

export default App;
