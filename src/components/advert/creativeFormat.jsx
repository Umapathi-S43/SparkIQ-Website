import { useState, useRef, useEffect } from "react";
import { BiCheck } from "react-icons/bi";
import {
  FaCheck,
  FaGlobe,
  FaFacebookF,
  FaGoogle,
  FaYoutube,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";

import { baseUrl } from "../utils/Constant";
import { jwtToken } from "../utils/jwtToken";

import "./creativeFormat.css";

// ----------------------------------------------------------------
// SIZE MAPS (Common for both UI's)
// ----------------------------------------------------------------
const mediaSizes = [
  { name: "Post Size", size: "(1080*1080)" },
  { name: "Landscape Size", size: "(1200*628)" },
  { name: "Story Size", size: "(1080*1920)" },
  { name: "Portrait Size", size: "(1080*1350)" },
  { name: "Pin Size", size: "(1000*1500)" },
];

const facebookSizes = [
  { name: "Post Size", size: "(1080*1080)" },
  { name: "Landscape Size", size: "(1200*628)" },
  { name: "Story Size", size: "(1080*1920)" },
];

const googleSizes = [
  { name: "Story Size", size: "(1080*1920)" },
  { name: "Portrait Size", size: "(1080*1350)" },
  { name: "Pin Size", size: "(1000*1500)" },
];

const linkedInSizes = [
  { name: "Post Size", size: "(1200*628)" },
  { name: "Ad Size", size: "(1200*300)" },
  { name: "Banner Size", size: "(1584*396)" },
];

const twitterSizes = [
  { name: "Post Size", size: "(1024*512)" },
  { name: "Ad Size", size: "(1200*600)" },
  { name: "Header Size", size: "(1500*500)" },
];

const whatsappSizes = [
  { name: "Status Size", size: "(1080*1920)" },
  { name: "Profile Photo Size", size: "(500*500)" },
  { name: "Ad Banner Size", size: "(1200*600)" },
];

const instagramSizes = [
  { name: "Post Size", size: "(1080*1080)" },
  { name: "Story Size", size: "(1080*1920)" },
  { name: "Reel Size", size: "(1080*1350)" },
];

const youtubeSizes = [
  { name: "Thumbnail Size", size: "(1280*720)" },
  { name: "Channel Art Size", size: "(2560*1440)" },
  { name: "Ad Video Size", size: "(1920*1080)" },
];

// ----------------------------------------------------------------
// Helper: return sizes based on platform slug
// ----------------------------------------------------------------
function getPlatformSizes(slug) {
  switch (slug) {
    case "facebook":
      return facebookSizes;
    case "google":
      return googleSizes;
    case "linkedin":
      return linkedInSizes;
    case "whatsapp":
      return whatsappSizes;
    case "twitter":
      return twitterSizes;
    case "instagram":
      return instagramSizes;
    case "youtube":
      return youtubeSizes;
    default:
      return mediaSizes; // default to "most common"
  }
}

export default function CreativeFormat({
  isNextSectionOpen,
  toggleNextSectionAccordion,
  handleNextSection,
  isCompleted,
  setIsCompleted,
  setIsLoading,
}) {
  const sectionRef = useRef(null);

  // By default, assume "Advertisement (Ad)"  
  const [selectedOption, setSelectedOption] = useState("Advertisement (Ad)");

  useEffect(() => {
    if (isNextSectionOpen && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isNextSectionOpen]);

  // ----------------------------------------------------------------
  // Shared "Generate Creatives" - (not heavily used now)
  // ----------------------------------------------------------------

  const handleGenerateCreatives = () => {
    // Retrieve brandId and productId from localStorage
    const brandId = JSON.parse(localStorage.getItem("brandID")) || "";
    const productId = JSON.parse(localStorage.getItem("productID")) || "";

    // Retrieve the user inputs from localStorage
    const objective = localStorage.getItem("objective") || "";
    const platform = localStorage.getItem("platform") || "";
    let imageSize = localStorage.getItem("imageSize") || "";
    // Remove parentheses if any remain
    imageSize = imageSize.replace(/[()]/g, "").replace(/\*/g, "x");

    if (!platform) {
      toast.error("Please select a platform before generating creatives!");
      return;
    }
    if (!imageSize) {
      toast.error("Please select an image size before generating creatives!");
      return;
    }

    // Branch for Ad vs Social
    if (selectedOption === "Advertisement (Ad)") {
      // We'll also retrieve campaignType and the multiple cohortIds
      const campaignType = localStorage.getItem("campaignType") || "";
      const storedCohortIds = localStorage.getItem("selectedCohortIds");
      let cohortIds = [];

      if (storedCohortIds) {
        cohortIds = JSON.parse(storedCohortIds); // array of IDs
      }

      if (!cohortIds || cohortIds.length === 0) {
        toast.error("Please select at least one audience cohort before generating creatives!");
        return;
      }

      // Final ad payload
      const payload = {
        brandId,
        productId,
        postType: "Adcreative",
        objective,      // e.g. "Solar power for newly constructed home..."
        platform,       // e.g. "facebook"
        campaignType,   // e.g. "sales", "brandAwareness", etc.
        imageSize,      // e.g. "1080*1080"
        cohortIds,      // array of cohort IDs
        imageSource: "",
      };

      localStorage.setItem("creativePayload", JSON.stringify(payload));
      console.log("Final Ad Payload => ", payload);
    } else {
      // Social Media Post
      // Build social-post payload
      const payload = {
        brandId,
        productId,
        postType: "SocialMediaPost", // your naming
        objective,
        platform,
        imageSize, // e.g. "1080*1080"
        imageSource: "",
      };

      localStorage.setItem("creativePayload", JSON.stringify(payload));
      console.log("Final Social Payload => ", payload);
    }

    // Then proceed with your original logic
    if (setIsCompleted) setIsCompleted(true);
    if (setIsLoading) setIsLoading(true);
    if (handleNextSection) handleNextSection();
  };

  // =================================================================
  // SOCIAL MEDIA POST UI
  // =================================================================
  function SocialMediaPostUI() {
    // States for user inputs
    const [objective, setObjective] = useState("");
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [selectedPlatformSlug, setSelectedPlatformSlug] = useState(null);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedSuggestions, setSelectedSuggestions] = useState([]);

    // On "Generate Creatives" specifically for Social
    const onGenerate = () => {
      // Validate
      if (!objective.trim()) {
        toast.error("Please enter an Objective.");
        return;
      }
      if (selectedPlatforms.length === 0) {
        toast.error("Please select a Platform.");
        return;
      }
      if (!selectedSize) {
        toast.error("Please select a Size.");
        return;
      }

      const brandId = JSON.parse(localStorage.getItem("brandID")) || "";
      const productId = JSON.parse(localStorage.getItem("productID")) || "";

      // Build final payload
      const payload = {
        brandId,
        productId,
        postType: "SocialMediaPost",
        objective,
        platform: selectedPlatforms[0]?.toLowerCase() || "",
        imageSize: selectedSize.replace(/\(|\)/g, "").replace("*", "x"),
        // If you want to do something with selectedSuggestions, do it here
      };
      console.log("Social Post Payload => ", payload);

      // Store in localStorage so we don't remove it
      localStorage.setItem("creativePayload", JSON.stringify(payload));

      // Mark completion or start loader
      if (setIsLoading) setIsLoading(true);
      if (setIsCompleted) setIsCompleted(true);

      // If next steps or next section needed:
      if (handleNextSection) handleNextSection();
    };

    // UI Interactions
    const togglePlatformSelection = (platformName) => {
      setSelectedPlatforms([platformName]); // single selection
      setSelectedPlatformSlug(platformName.toLowerCase());
      setSelectedSize("");
    };

    const handleTopIconClick = (platformName) => {
      setSelectedPlatformSlug(platformName.toLowerCase());
      setSelectedSize("");
    };

    const handleSuggestionToggle = (title) => {
      setSelectedSuggestions((prev) =>
        prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]
      );
    };

    const aiSuggestions = [
      { title: "Educational Post", icon: <FaInstagram />, text: "Instagram Post" },
      { title: "Story", icon: <FaGlobe />, text: "Social Media Story" },
      { title: "Offers", icon: <FaInstagram />, text: "Instagram Story" },
    ];

    const displayedSizes = selectedPlatformSlug
      ? getPlatformSizes(selectedPlatformSlug)
      : mediaSizes;

    return (
      <>
        {/* 1) Objective */}
        <div className="mb-6 bg-[#FCFCFC40] p-6 shadow-md rounded-[20px]">
          <h3 className="text-[#374151] text-lg mb-3">Describe Your Objective</h3>
          <textarea
            className="w-full p-3 rounded-lg shadow-md border border-[#E5E7EB] mb-2"
            rows="4"
            placeholder="Example: I want to create an educational post about my services"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
          />
          {/* <div className="flex justify-end gap-4">
            <button className="text-sm custom-button text-white px-4 py-2 rounded-md">
              Enhance with AI
            </button>
            <button className="custom-button text-sm text-white px-4 py-2 rounded-md">
              Submit
            </button>
          </div> */}
        </div>

        {/* 2) AI Suggestions */}
        <div className="mb-6 bg-[#FCFCFC40] p-6 shadow-md rounded-[20px]">
          <h3 className="text-[#082A66] text-lg font-bold mb-4">AI Suggestions</h3>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            {aiSuggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className={`relative flex flex-col items-center justify-center gap-2 w-full py-6 rounded-[20px] shadow border border-[#E5E7EB] bg-white cursor-pointer ${
                  selectedSuggestions.includes(suggestion.title)
                    ? ""
                    : "text-[#082A66]"
                }`}
                onClick={() => handleSuggestionToggle(suggestion.title)}
              >
                <p className="font-bold text-center">{suggestion.title}</p>
                <p className="text-sm flex items-center gap-2">
                  {suggestion.icon}
                  {suggestion.text}
                </p>
                {selectedSuggestions.includes(suggestion.title) && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow">
                    <FaCheck className="text-white text-sm" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 3) Select Social Media Platforms */}
        <div className="bg-[#FCFCFC40] p-6 shadow-md rounded-[20px]">
          <h4 className="text-[#082A66] font-bold lg:text-lg text-base">
            Select Social Media Platform
          </h4>
          <div className="flex flex-wrap gap-4 p-4">
            {[
              { name: "Instagram", icon: "src/assets/media/insta.png" },
              { name: "Facebook", icon: "src/assets/media/facebook.png" },
              { name: "LinkedIn", icon: "src/assets/media/linkedin.png" },
              { name: "Twitter", icon: "src/assets/media/twitter.png" },
            ].map((platform, idx) => (
              <div
                key={idx}
                className="relative w-36 h-36 rounded-md bg-gray-50 border hover:shadow-md cursor-pointer p-4 flex flex-col items-center justify-center"
                onClick={() => togglePlatformSelection(platform.name)}
              >
                <img
                  src={platform.icon}
                  alt={platform.name}
                  className="w-20 h-20 object-contain mb-2"
                />
                <span className="text-sm font-medium text-center">{platform.name}</span>
                {selectedPlatforms.includes(platform.name) && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow">
                    <FaCheck className="text-white text-sm" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 4) Select Size */}
        <div className="mt-6">
          <div className="bg-[#FCFCFC40] p-6 shadow-md rounded-[20px]">
            <div className="flex flex-wrap justify-between items-center">
              <span>
                <h4 className="text-[#082A66] font-bold lg:text-lg text-base">
                  Select Social Media Size
                </h4>
                <p className="text-[#374151] lg:text-lg text-xs">
                  Most common size for social media
                </p>
              </span>
              <span className="flex gap-4">
                {selectedPlatforms.map((plat) => {
                  const slug = plat.toLowerCase();
                  if (slug === "facebook") {
                    return (
                      <FaFacebookF
                        key={plat}
                        className="bg-[#00279926] p-1 cursor-pointer"
                        size={20}
                        onClick={() => handleTopIconClick(plat)}
                      />
                    );
                  } else if (slug === "google") {
                    return (
                      <FaGoogle
                        key={plat}
                        className="bg-[#00279926] p-1 cursor-pointer"
                        size={20}
                        onClick={() => handleTopIconClick(plat)}
                      />
                    );
                  } else if (slug === "linkedin") {
                    return (
                      <FaLinkedinIn
                        key={plat}
                        className="bg-[#00279926] p-1 cursor-pointer"
                        size={20}
                        onClick={() => handleTopIconClick(plat)}
                      />
                    );
                  } else if (slug === "whatsapp") {
                    return (
                      <FaWhatsapp
                        key={plat}
                        className="bg-[#00279926] p-1 cursor-pointer"
                        size={20}
                        onClick={() => handleTopIconClick(plat)}
                      />
                    );
                  } else if (slug === "twitter") {
                    return (
                      <FaXTwitter
                        key={plat}
                        className="bg-[#00279926] p-1 cursor-pointer"
                        size={20}
                        onClick={() => handleTopIconClick(plat)}
                      />
                    );
                  } else if (slug === "instagram") {
                    return (
                      <FaInstagram
                        key={plat}
                        className="bg-[#00279926] p-1 cursor-pointer"
                        size={20}
                        onClick={() => handleTopIconClick(plat)}
                      />
                    );
                  } else if (slug === "youtube") {
                    return (
                      <FaYoutube
                        key={plat}
                        className="bg-[#00279926] p-1 cursor-pointer"
                        size={20}
                        onClick={() => handleTopIconClick(plat)}
                      />
                    );
                  }
                  return null;
                })}
              </span>
            </div>
            <div className="pt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
              {displayedSizes.map((item, idx) => {
                const cleanedSize = item.size.replace(/[()]/g, "");
                return (
                  <div
                    key={idx}
                    className={`flex flex-col items-center justify-center gap-2 w-full py-4 rounded-[20px] shadow cursor-pointer ${
                      selectedSize === cleanedSize ? "bg-[#00A0F5] text-white" : "bg-white"
                    }`}
                    onClick={() => setSelectedSize(cleanedSize)}
                  >
                    <img src="/image2.svg" alt="" />
                    <p className="font-bold text-center">{item.name}</p>
                    <p className="text-sm">{cleanedSize}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 5) Generate Button */}
        <div className="flex items-center justify-center w-full py-12">
          <button
            className="custom-button rounded-[20px] text-white py-4 px-10 font-medium"
            onClick={handleGenerateCreatives}
          >
            Generate Creatives
          </button>
        </div>
      </>
    );
  }

  // =================================================================
  // ADVERTISEMENT (AD) UI
  // =================================================================
  function AdvertisementAdUI() {
    // States for user inputs in Ad scenario:
    const [objective, setObjective] = useState("");
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [selectedPlatformSlug, setSelectedPlatformSlug] = useState(null);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedCampaign, setSelectedCampaign] = useState("");

    // Cohort data from server
    const [cohorts, setCohorts] = useState([]);
    const [selectedSuggestions, setSelectedSuggestions] = useState([]);

    // Manual Setup
    const [isManualSetup, setIsManualSetup] = useState(false);
    const [formValues, setFormValues] = useState({
      id: null,
      cohortName: "",
      ageGroup: { min: "", max: "" },
      gender: "",
      interests: [],
    });
    const [interestInput, setInterestInput] = useState("");

    // Loader state (for generating AI cohorts)
    const [isGeneratingCohorts, setIsGeneratingCohorts] = useState(false);

    // Let user fill out all fields before auto-generating if cohorts are empty
    useEffect(() => {
      fetchCohorts();
    }, []);

    // ----------------------------------------------------------------
    // Auto-generate once all fields are set (objective, platform, campaign, size),
    // if cohorts are still empty. This runs only if cohorts.length === 0
    // ----------------------------------------------------------------
    useEffect(() => {
      if (
        !isGeneratingCohorts &&
        cohorts.length === 0 &&
        objective.trim() &&
        selectedPlatforms.length > 0 &&
        selectedCampaign &&
        selectedSize
      ) {
        generateAICohorts();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [objective, selectedPlatforms, selectedCampaign, selectedSize]);

    // ----------------------------------------------------------------
    // FETCH existing cohorts from DB
    // ----------------------------------------------------------------
    const fetchCohorts = async () => {
      try {
        const brandId = JSON.parse(localStorage.getItem("brandID")) || "";
        const productId = JSON.parse(localStorage.getItem("productID")) || "";

        const response = await axios.get(
          `${baseUrl}/v2/api/cohorts?productId=${productId}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data?.data || [];
        setCohorts(data);
      } catch (error) {
        console.error("Error fetching cohorts:", error);
      }
    };

    // ----------------------------------------------------------------
    // Generate AI cohorts manually or automatically
    // ----------------------------------------------------------------
    const generateAICohorts = async () => {
      // Double-check fields:
      if (!objective.trim()) return;
      if (selectedPlatforms.length === 0) return;
      if (!selectedCampaign) return;
      if (!selectedSize) return;

      setIsGeneratingCohorts(true);
      try {
        const brandId = JSON.parse(localStorage.getItem("brandID")) || "";
        const productId = JSON.parse(localStorage.getItem("productID")) || "";

        // Prepare the payload from the user states
        const payload = {
          brandId,
          productId,
          postType: "Adcreative",
          objective,
          platform: selectedPlatforms[0].toLowerCase(),
          campaignType: mapCampaign(selectedCampaign), // see mapCampaign below
          imageSize: selectedSize.replace(/\(|\)/g, "").replace("*", "x"),
        };

        console.log("Generating AI cohorts => ", payload);

        await axios.post(`${baseUrl}/v2/api/cohorts/generate`, payload, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        });

        // Once completed, re-fetch to see new cohorts
        await fetchCohorts();
      } catch (err) {
        console.error("Error generating AI cohorts:", err);
      } finally {
        setIsGeneratingCohorts(false);
      }
    };

    // ----------------------------------------------------------------
    // Once user sets everything, final "Generate Creatives" for Ads
    // ----------------------------------------------------------------
    const onGenerateCreatives = () => {
      if (cohorts.length === 0 && !objective.trim()) {
        toast.error("Please enter an Objective.");
        return;
      }
      
      if (selectedPlatforms.length === 0) {
        toast.error("Please select a Platform.");
        return;
      }
      if (!selectedCampaign) {
        toast.error("Please select a Campaign type.");
        return;
      }
      if (!selectedSize) {
        toast.error("Please select an Image Size.");
        return;
      }
      if (selectedSuggestions.length === 0) {
        toast.error("Please select at least one Audience Cohort.");
        return;
      }

      const brandId = JSON.parse(localStorage.getItem("brandID")) || "";
      const productId = JSON.parse(localStorage.getItem("productID")) || "";

      const campaignType = mapCampaign(selectedCampaign);
      const payload = {
        brandId,
        productId,
        postType: "Adcreative",
        objective,
        platform: selectedPlatforms[0].toLowerCase(),
        campaignType,
        imageSize: selectedSize.replace(/\(|\)/g, "").replace("*", "x"),
        cohortIds: getSelectedCohortIds(),
        imageSource: "",
      };

      console.log("Final Ad Payload =>", payload);

      // Store the final payload in localStorage
      localStorage.setItem("creativePayload", JSON.stringify(payload));

      if (setIsLoading) setIsLoading(true);
      if (setIsCompleted) setIsCompleted(true);

      if (handleNextSection) handleNextSection();
    };

    const mapCampaign = (campaignString) => {
      switch (campaignString.toLowerCase()) {
        case "sale":
          return "sales";
        case "retargeting audience":
          return "retargeting";
        case "brand awareness":
        default:
          return "brandAwareness";
      }
    };

    const getSelectedCohortIds = () => {
      const matched = cohorts.filter((c) => selectedSuggestions.includes(c.name));
      return matched.map((m) => m.id);
    };

    // ----------------------------------------------------------------
    // Manual Setup (create or edit a cohort)
    // ----------------------------------------------------------------
    const handleFormChange = (e) => {
      const { name, value } = e.target;
      setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleInterestKeyDown = (e) => {
      if (e.key === "Enter" && interestInput.trim()) {
        setFormValues((prev) => ({
          ...prev,
          interests: [...prev.interests, interestInput.trim()],
        }));
        setInterestInput("");
      }
    };

    const saveCohort = async (cohort) => {
      try {
        const brandId = JSON.parse(localStorage.getItem("brandID")) || "";
        const productId = JSON.parse(localStorage.getItem("productID")) || "";

        const payload = {
          id: cohort.id || undefined,
          name: cohort.cohortName,
          ageGroup: `${cohort.ageGroup.min}-${cohort.ageGroup.max}`,
          genders: [cohort.gender],
          interest: cohort.interests.join(", "),
          source: "user",
          brandId,
          productId,
        };

        const response = await axios.post(`${baseUrl}/v2/api/cohorts`, payload, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        if (response.status === 200 || response.status === 201) {
          await fetchCohorts();
          setIsManualSetup(false);
          setFormValues({
            id: null,
            cohortName: "",
            ageGroup: { min: "", max: "" },
            gender: "",
            interests: [],
          });
        }
      } catch (error) {
        console.error("Error saving cohort:", error);
      }
    };

    const handleEditCohort = (cohort) => {
      setIsManualSetup(true);
      setFormValues({
        id: cohort.id,
        cohortName: cohort.name,
        ageGroup: {
          min: cohort.ageGroup.split("-")[0],
          max: cohort.ageGroup.split("-")[1],
        },
        gender: cohort.genders?.[0] || "",
        interests: cohort.interest
          ? cohort.interest.split(", ").map((i) => i.trim())
          : [],
      });
    };

    const handleDeleteCohort = async (cohortId) => {
      try {
        await axios.delete(`${baseUrl}/v2/api/cohorts/${cohortId}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        setCohorts((prev) => prev.filter((c) => c.id !== cohortId));
      } catch (error) {
        console.error("Error deleting cohort:", error);
      }
    };

    // ----------------------------------------------------------------
    // Selections
    // ----------------------------------------------------------------
    const handleCohortSelection = (cohortName) => {
      setSelectedSuggestions((prev) =>
        prev.includes(cohortName)
          ? prev.filter((name) => name !== cohortName)
          : [...prev, cohortName]
      );
    };

    const togglePlatformSelection = (platformName) => {
      setSelectedPlatforms([platformName]);
      setSelectedPlatformSlug(platformName.toLowerCase());
      setSelectedSize("");
    };

    const handleTopIconClick = (platformName) => {
      setSelectedPlatformSlug(platformName.toLowerCase());
      setSelectedSize("");
    };

    // ----------------------------------------------------------------
    // Display
    // ----------------------------------------------------------------
    const displayedSizes = selectedPlatformSlug
      ? getPlatformSizes(selectedPlatformSlug)
      : mediaSizes;

    // Refresh icon -> manual generate
    const refreshCreatives = async () => {
      setCohorts([]);
      setSelectedSuggestions([]);
      await generateAICohorts();
    };

    return (
      <>
      {/* Loader Overlay & Spinner CSS */}
      <style>{`
       .loader-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }
        .loader {
  font-size: 10px;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  position: relative;
  text-indent: -9999em;
  animation: mulShdSpin 1.1s infinite ease;
  transform: translateZ(0);
}
@keyframes mulShdSpin {
  0%,
  100% {
    box-shadow: 0em -2.6em 0em 0em #ffffff, 1.8em -1.8em 0 0em rgba(8, 42, 102, 0.2), 2.5em 0em 0 0em rgba(8, 42, 102, 0.2), 1.75em 1.75em 0 0em rgba(8, 42, 102, 0.2), 0em 2.5em 0 0em rgba(8, 42, 102, 0.2), -1.8em 1.8em 0 0em rgba(8, 42, 102, 0.2), -2.6em 0em 0 0em rgba(8, 42, 102, 0.5), -1.8em -1.8em 0 0em rgba(8, 42, 102, 0.7);
  }
  12.5% {
    box-shadow: 0em -2.6em 0em 0em rgba(8, 42, 102, 0.7), 1.8em -1.8em 0 0em #ffffff, 2.5em 0em 0 0em rgba(8, 42, 102, 0.2), 1.75em 1.75em 0 0em rgba(8, 42, 102, 0.2), 0em 2.5em 0 0em rgba(8, 42, 102, 0.2), -1.8em 1.8em 0 0em rgba(8, 42, 102, 0.2), -2.6em 0em 0 0em rgba(8, 42, 102, 0.2), -1.8em -1.8em 0 0em rgba(8, 42, 102, 0.5);
  }
  25% {
    box-shadow: 0em -2.6em 0em 0em rgba(8, 42, 102, 0.5), 1.8em -1.8em 0 0em rgba(8, 42, 102, 0.7), 2.5em 0em 0 0em #ffffff, 1.75em 1.75em 0 0em rgba(8, 42, 102, 0.2), 0em 2.5em 0 0em rgba(8, 42, 102, 0.2), -1.8em 1.8em 0 0em rgba(8, 42, 102, 0.2), -2.6em 0em 0 0em rgba(8, 42, 102, 0.2), -1.8em -1.8em 0 0em rgba(8, 42, 102, 0.2);
  }
  37.5% {
    box-shadow: 0em -2.6em 0em 0em rgba(8, 42, 102, 0.2), 1.8em -1.8em 0 0em rgba(8, 42, 102, 0.5), 2.5em 0em 0 0em rgba(8, 42, 102, 0.7), 1.75em 1.75em 0 0em #ffffff, 0em 2.5em 0 0em rgba(8, 42, 102, 0.2), -1.8em 1.8em 0 0em rgba(8, 42, 102, 0.2), -2.6em 0em 0 0em rgba(8, 42, 102, 0.2), -1.8em -1.8em 0 0em rgba(8, 42, 102, 0.2);
  }
  50% {
    box-shadow: 0em -2.6em 0em 0em rgba(8, 42, 102, 0.2), 1.8em -1.8em 0 0em rgba(8, 42, 102, 0.2), 2.5em 0em 0 0em rgba(8, 42, 102, 0.5), 1.75em 1.75em 0 0em rgba(8, 42, 102, 0.7), 0em 2.5em 0 0em #ffffff, -1.8em 1.8em 0 0em rgba(8, 42, 102, 0.2), -2.6em 0em 0 0em rgba(8, 42, 102, 0.2), -1.8em -1.8em 0 0em rgba(8, 42, 102, 0.2);
  }
  62.5% {
    box-shadow: 0em -2.6em 0em 0em rgba(8, 42, 102, 0.2), 1.8em -1.8em 0 0em rgba(8, 42, 102, 0.2), 2.5em 0em 0 0em rgba(8, 42, 102, 0.2), 1.75em 1.75em 0 0em rgba(8, 42, 102, 0.5), 0em 2.5em 0 0em rgba(8, 42, 102, 0.7), -1.8em 1.8em 0 0em #ffffff, -2.6em 0em 0 0em rgba(8, 42, 102, 0.2), -1.8em -1.8em 0 0em rgba(8, 42, 102, 0.2);
  }
  75% {
    box-shadow: 0em -2.6em 0em 0em rgba(8, 42, 102, 0.2), 1.8em -1.8em 0 0em rgba(8, 42, 102, 0.2), 2.5em 0em 0 0em rgba(8, 42, 102, 0.2), 1.75em 1.75em 0 0em rgba(8, 42, 102, 0.2), 0em 2.5em 0 0em rgba(8, 42, 102, 0.5), -1.8em 1.8em 0 0em rgba(8, 42, 102, 0.7), -2.6em 0em 0 0em #ffffff, -1.8em -1.8em 0 0em rgba(8, 42, 102, 0.2);
  }
  87.5% {
    box-shadow: 0em -2.6em 0em 0em rgba(8, 42, 102, 0.2), 1.8em -1.8em 0 0em rgba(8, 42, 102, 0.2), 2.5em 0em 0 0em rgba(8, 42, 102, 0.2), 1.75em 1.75em 0 0em rgba(8, 42, 102, 0.2), 0em 2.5em 0 0em rgba(8, 42, 102, 0.2), -1.8em 1.8em 0 0em rgba(8, 42, 102, 0.5), -2.6em 0em 0 0em rgba(8, 42, 102, 0.7), -1.8em -1.8em 0 0em #ffffff;
  }
}
      `}</style>
      <div className="p-6 pt-0">
        {/* 1) Objective */}
        <div className="mb-6 bg-[#FCFCFC40] p-6 shadow-md rounded-[20px]">
          <h3 className="text-[#374151] text-lg mb-3">Describe Your Objective</h3>
          <textarea
            className="w-full p-3 rounded-lg shadow-md border border-[#E5E7EB] mb-2"
            rows="4"
            placeholder="Example: I want to create an educational post about my services"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
          />
          {/* <div className="flex justify-end gap-4">
            <button className="text-sm custom-button text-white px-4 py-2 rounded-md">
              Enhance with AI
            </button>
            <button className="custom-button text-sm text-white px-4 py-2 rounded-md">
              Submit
            </button>
          </div> */}
        </div>

        {/* 2) Ad Networks */}
        <h4 className="text-[#082A66] font-bold lg:text-xl text-base">Ad Networks</h4>
        <div className="bg-[#FCFCFC40] p-6 shadow-md rounded-[20px] mt-4">
          <h4 className="text-[#082A66] font-bold lg:text-lg text-base">
            Select Social Media Platform
          </h4>
          <div className="flex flex-wrap gap-4 p-4">
            {[
              { name: "Instagram", icon: "src/assets/media/insta.png" },
              { name: "Facebook", icon: "src/assets/media/facebook.png" },
              { name: "LinkedIn", icon: "src/assets/media/linkedin.png" },
              { name: "Twitter", icon: "src/assets/media/twitter.png" },
              { name: "Google", icon: "src/assets/media/google.png" },
            ].map((platform, idx) => (
              <div
                key={idx}
                className="relative w-36 h-36 rounded-md bg-gray-50 border hover:shadow-md cursor-pointer p-4 flex flex-col items-center justify-center"
                onClick={() => togglePlatformSelection(platform.name)}
              >
                <img
                  src={platform.icon}
                  alt={platform.name}
                  className="w-20 h-20 object-contain mb-2"
                />
                <span className="text-sm font-medium text-center">{platform.name}</span>
                {selectedPlatforms.includes(platform.name) && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow">
                    <FaCheck className="text-white text-sm" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 3) Campaigns */}
        <div className="mb-6 bg-[#FCFCFC40] p-6 shadow-md rounded-[20px] mt-6">
          <h3 className="text-[#082A66] text-lg font-bold mb-4">Select Campaign type</h3>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Brand Awareness",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#082A66"
                  >
                    <path d="M640-440v-80h160v80H640Zm48 280-128-96 48-64 128 96-48 64Zm-80-480-48-64 128-96 48 64-128 96ZM120-360v-240h160l200-200v640L280-360H120Zm280-246-86 86H200v80h114l86 86v-252ZM300-480Z" />
                  </svg>
                ),
              },
              {
                title: "Sale",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#082A66"
                  >
                    <path d="M280-640q-33 0-56.5-23.5T200-720v-80q0-33 23.5-56.5T280-880h400q33 0 56.5 23.5T760-800v80q0 33-23.5 56.5T680-640H280Zm0-80h400v-80H280v80ZM160-80q-33 0-56.5-23.5T80-160v-40h800v40q0 33-23.5 56.5T800-80H160ZM80-240l139-313q10-22 30-34.5t43-12.5h376q23 0 43 12.5t30 34.5l139 313H80Zm260-80h40q8 0 14-6t6-14q0-8-6-14t-14-6h-40q-8 0-14 6t-6 14q0 8 6 14t14 6Zm0-80h40q8 0 14-6t6-14q0-8-6-14t-14-6h-40q-8 0-14 6t-6 14q0 8 6 14t14 6Zm0-80h40q8 0 14-6t6-14q0-8-6-14t-14-6h-40q-8 0-14 6t-6 14q0 8 6 14t14 6Zm120 160h40q8 0 14-6t6-14q0-8-6-14t-14-6h-40q-8 0-14 6t-6 14q0 8 6 14t14 6Zm0-80h40q8 0 14-6t6-14q0-8-6-14t-14-6h-40q-8 0-14 6t-6 14q0 8 6 14t14 6Zm0-80h40q8 0 14-6t6-14q0-8-6-14t-14-6h-40q-8 0-14 6t-6 14q0 8 6 14t14 6Zm120 160h40q8 0 14-6t6-14q0-8-6-14t-14-6h-40q-8 0-14 6t-6 14q0 8 6 14t14 6Zm0-80h40q8 0 14-6t6-14q0-8-6-14t-14-6h-40q-8 0-14 6t-6 14q0 8 6 14t14 6Z" />
                  </svg>
                ),
              },
              {
                title: "Retargeting Audience",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#082A66"
                  >
                    <path d="M468-240q-96-5-162-74t-66-166q0-100 70-170t170-70q97 0 166 66t74 162l-84-25q-13-54-56-88.5T480-640q-66 0-113 47t-47 113q0 57 34.5 100t88.5 56l25 84Zm48 158q-9 2-18 2h-18q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480v18q0-9-2-18l-78-24v-12q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93h12l24 78Zm305 22L650-231 600-80 480-480l400 120-151 50 171 171-79 79Z" />
                  </svg>
                ),
              },
            ].map((campaign, idx) => (
              <div
                key={idx}
                className={`relative flex flex-col items-center justify-center gap-2 w-full py-6 rounded-[20px] shadow border border-[#E5E7EB] cursor-pointer ${
                  selectedCampaign === campaign.title
                    ? "bg-[#00A0F5] text-white"
                    : "bg-white text-[#082A66]"
                }`}
                onClick={() => setSelectedCampaign(campaign.title)}
              >
                {campaign.icon}
                <p className="font-bold text-center">{campaign.title}</p>
                {selectedCampaign === campaign.title && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow">
                    <FaCheck className="text-white text-sm" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 4) Select Size */}
        <div className="bg-[#FCFCFC40] p-6 shadow-md rounded-[20px] mt-6">
          <div className="flex justify-between items-center">
            <span>
              <h4 className="text-[#082A66] font-bold lg:text-lg text-base">
                Select Social Media Size
              </h4>
              <p className="text-[#374151] lg:text-lg text-xs">
                Most common size for social media advertising
              </p>
            </span>
            <span className="flex gap-4">
              {selectedPlatforms.map((plat) => {
                const slug = plat.toLowerCase();
                if (slug === "facebook") {
                  return (
                    <FaFacebookF
                      key={plat}
                      className="bg-[#00279926] p-1 cursor-pointer"
                      size={20}
                      onClick={() => handleTopIconClick(plat)}
                    />
                  );
                } else if (slug === "google") {
                  return (
                    <FaGoogle
                      key={plat}
                      className="bg-[#00279926] p-1 cursor-pointer"
                      size={20}
                      onClick={() => handleTopIconClick(plat)}
                    />
                  );
                } else if (slug === "linkedin") {
                  return (
                    <FaLinkedinIn
                      key={plat}
                      className="bg-[#00279926] p-1 cursor-pointer"
                      size={20}
                      onClick={() => handleTopIconClick(plat)}
                    />
                  );
                } else if (slug === "whatsapp") {
                  return (
                    <FaWhatsapp
                      key={plat}
                      className="bg-[#00279926] p-1 cursor-pointer"
                      size={20}
                      onClick={() => handleTopIconClick(plat)}
                    />
                  );
                } else if (slug === "twitter") {
                  return (
                    <FaXTwitter
                      key={plat}
                      className="bg-[#00279926] p-1 cursor-pointer"
                      size={20}
                      onClick={() => handleTopIconClick(plat)}
                    />
                  );
                } else if (slug === "instagram") {
                  return (
                    <FaInstagram
                      key={plat}
                      className="bg-[#00279926] p-1 cursor-pointer"
                      size={20}
                      onClick={() => handleTopIconClick(plat)}
                    />
                  );
                } else if (slug === "youtube") {
                  return (
                    <FaYoutube
                      key={plat}
                      className="bg-[#00279926] p-1 cursor-pointer"
                      size={20}
                      onClick={() => handleTopIconClick(plat)}
                    />
                  );
                }
                return null;
              })}
            </span>
          </div>
          <div className="pt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            {displayedSizes.map((item, idx) => {
              const cleanedSize = item.size.replace(/[()]/g, "");
              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center gap-2 w-full py-4 rounded-[20px] shadow cursor-pointer ${
                    selectedSize === cleanedSize ? "bg-[#00A0F5] text-white" : "bg-white"
                  }`}
                  onClick={() => setSelectedSize(cleanedSize)}
                >
                  <img src="/image2.svg" alt="" />
                  <p className="font-bold text-center">{item.name}</p>
                  <p className="text-sm">{cleanedSize}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5) AI Suggestions (Cohorts) */}
        <div className="mb-6 bg-[#FCFCFC40] p-6 shadow-md rounded-[20px] mt-6 relative">
          {/* Top-right refresh (regenerate) button */}
          <div className="absolute right-3 top-3 flex items-center">
            <div className="relative group">
           <span className=""
           onClick={refreshCreatives}
                style={{ cursor: "pointer" }}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#082A66"><path d="M204-318q-22-38-33-78t-11-82q0-134 93-228t227-94h7l-64-64 56-56 160 160-160 160-56-56 64-64h-7q-100 0-170 70.5T240-478q0 26 6 51t18 49l-60 60ZM481-40 321-200l160-160 56 56-64 64h7q100 0 170-70.5T720-482q0-26-6-51t-18-49l60-60q22 38 33 78t11 82q0 134-93 228t-227 94h-7l64 64-56 56Z"/></svg>
              </span><div className="absolute -bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-500 text-white text-nowrap text-sm rounded py-1 px-2">
                Regenerate Creatives
              </div>
            </div>
          </div>

          <h3 className="text-[#082A66] text-lg font-bold mb-4">AI Suggestions</h3>

          {isGeneratingCohorts && (
            <div className="flex items-center justify-center my-4">
              <div className="loader-overlay">
          <div className="loader"></div>
        </div>
            </div>
          )}

          {!isGeneratingCohorts && (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {cohorts.map((cohort, idx) => (
                <div
                  key={idx}
                  className={`relative flex flex-col items-center justify-center gap-2 w-full py-6 rounded-[20px] shadow border border-[#E5E7EB] bg-white cursor-pointer ${
                    selectedSuggestions.includes(cohort.name) ? "border-[#00A0F5]" : ""
                  }`}
                  onClick={() => handleCohortSelection(cohort.name)}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                      <FaFacebookF />
                    </span>
                    <p className="font-bold text-center">{cohort.name}</p>
                  </div>
                  <div className="mt-2 text-sm text-center">
                    <p>Audience Profile:</p>
                    <p>Age: {cohort.ageGroup}</p>
                    <p>Gender: {cohort.genders}</p>
                    <p>Interest: {cohort.interest}</p>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-2">
                    {selectedSuggestions.includes(cohort.name) ? (
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow">
                        <FaCheck className="text-white text-sm" />
                      </div>
                    ) : (
                      <>
                        <button
                          className="text-blue-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditCohort(cohort);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="20px"
                            viewBox="0 -960 960 960"
                            width="20px"
                            fill="#082A66"
                          >
                            <path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z" />
                          </svg>
                        </button>
                        <button
                          className="text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCohort(cohort.id);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="20px"
                            viewBox="0 -960 960 960"
                            width="20px"
                            fill="#EA3323"
                          >
                            <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Manual Setup Button */}
          <button
            className="custom-button mt-6 px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={() => setIsManualSetup(!isManualSetup)}
          >
            I will setup Manually
          </button>

          {/* Manual Setup Form */}
          {isManualSetup && (
            <div className="bg-[#FCFCFC40] p-6 shadow-md rounded-[20px] mt-4">
              <h4 className="text-lg font-bold mb-4">Targeting Cohort</h4>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label className="font-bold">Cohort Name</label>
                  <input
                    className="border p-2 rounded"
                    name="cohortName"
                    value={formValues.cohortName}
                    onChange={handleFormChange}
                    placeholder="Enter Cohort Name"
                  />
                </div>
                <div className="flex gap-24 items-center">
                  <div className="flex flex-col flex-2">
                    <label className="font-bold">Age Group</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        className="border p-2 rounded w-1/2"
                        value={formValues.ageGroup.min}
                        onChange={(e) =>
                          setFormValues((prev) => ({
                            ...prev,
                            ageGroup: { ...prev.ageGroup, min: e.target.value },
                          }))
                        }
                        placeholder="Min-Age"
                      />
                      <input
                        type="number"
                        className="border p-2 rounded w-1/2"
                        value={formValues.ageGroup.max}
                        onChange={(e) =>
                          setFormValues((prev) => ({
                            ...prev,
                            ageGroup: { ...prev.ageGroup, max: e.target.value },
                          }))
                        }
                        placeholder="Max-Age"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col flex-1">
                    <label className="font-bold">Gender</label>
                    <select
                      className="border p-2 rounded w-full"
                      name="gender"
                      value={formValues.gender}
                      onChange={handleFormChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="All">All</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="font-bold">Interests</label>
                  <div className="flex flex-wrap items-start border rounded overflow-auto">
                    {formValues.interests.map((interest, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 m-1 bg-blue-100 text-blue-700 rounded"
                      >
                        {interest}
                        <button
                          type="button"
                          className="ml-2 text-red-500"
                          onClick={() =>
                            setFormValues((prev) => ({
                              ...prev,
                              interests: prev.interests.filter((_, i) => i !== idx),
                            }))
                          }
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                    <input
                      className="flex-1 border p-2 rounded h-10 focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      onKeyDown={handleInterestKeyDown}
                      placeholder="Add Interests"
                    />
                  </div>
                </div>
              </div>
              <button
                className="custom-button mt-4 px-4 py-2 bg-green-500 text-white rounded-md"
                onClick={() => saveCohort(formValues)}
              >
                Save Cohort
              </button>
            </div>
          )}
        </div>

        {/* 6) Generate Creatives */}
        <div className="flex items-center justify-center w-full py-8">
          <button
            className="custom-button rounded-[20px] text-white py-4 px-10 font-medium"
            onClick={onGenerateCreatives}
          >
            Generate Creatives
          </button>
        </div>
      </div>
      </>
    );
  }

  // =================================================================
  // RENDER ACCORDION
  // =================================================================
  return (
    <div ref={sectionRef}>
      <section
        className={`border border-white bg-[rgba(252,252,252,0.25)] rounded-[24px] pb-2 ${
          !isNextSectionOpen ? "p-2 lg:p-3" : "p-0"
        } flex flex-col gap-6 relative z-10`}
      >
        {/* Header */}
        <div
          className={`flex flex-wrap justify-between items-center bg-[rgba(252,252,252,0.40)] ${
            !isNextSectionOpen ? "rounded-[20px] p-2" : "rounded-t-[20px] p-4"
          } relative cursor-pointer`}
          onClick={toggleNextSectionAccordion}
        >
          {isCompleted && (
            <span className="bg-[#A7F3D0] text-[#059669] text-xs font-medium rounded-[10px] px-3 py-1 flex items-center gap-[10px] w-fit absolute right-0 -top-3">
              Completed <BiCheck size={20} />
            </span>
          )}
          <span className="flex items-center gap-4">
            <img src="/icon4.svg" alt="Icon" />
            <span className="flex flex-col">
              <h4 className="text-[#082A66] font-bold text-lg lg:text-xl">
                Creative Objective
              </h4>
              <p className="text-[#374151] text-xs lg:text-sm">
                Select your preferred platforms and sizes below.
              </p>
            </span>
          </span>
          <div className="flex items-center gap-2">
            {isNextSectionOpen ? (
              <MdArrowDropUp size={32} className="cursor-pointer" />
            ) : (
              <MdArrowDropDown size={32} className="cursor-pointer" />
            )}
          </div>
        </div>

        {/* Body */}
        {isNextSectionOpen && (
          <div className="p-4">
            {selectedOption === "Social Media Post" ? (
              <SocialMediaPostUI />
            ) : (
              <AdvertisementAdUI />
            )}
          </div>
        )}
      </section>
    </div>
  );
}

/* 
Place this in your creativeFormat.css or global CSS:

.loader {
  position: relative;
  display: flex;
}
.loader:before,
.loader:after {
  content: '';
  width: 15px;
  height: 15px;
  display: inline-block;
  position: relative;
  margin: 0 5px;
  border-radius: 50%;
  color: #FFF;
  background: currentColor;
  box-shadow: 50px 0, -50px 0;
  animation: left 1s infinite ease-in-out;
}
.loader:after {
  color: #FF3D00;
  animation: right 1.1s infinite ease-in-out;
}

@keyframes right {
  0%, 100% { transform: translateY(-10px); }
  50% { transform: translateY(10px); }
}

@keyframes left {
  0%, 100% { transform: translateY(10px); }
  50% { transform: translateY(-10px); }
}
*/

