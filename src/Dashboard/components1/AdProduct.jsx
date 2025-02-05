import React, { useState, useEffect } from "react";
import {
  FaTrash,
  FaChevronRight,
  FaChevronDown,
  FaCheck,
  FaRegLightbulb,
} from "react-icons/fa";
import { IoImageOutline } from "react-icons/io5";
import { PiFileArrowUpDuotone } from "react-icons/pi";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../components/utils/Constant";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtToken } from "../../components/utils/jwtToken";
import { FaCartShopping } from "react-icons/fa6";
import { FcServices } from "react-icons/fc";

const currencies = [
  "USD",
  "EUR",
  "GBP",
  "INR",
  "AUD",
  "CAD",
  "JPY",
  "CNY",
  "CHF",
  "SEK",
  "NZD",
  "SGD",
  "HKD",
  "NOK",
  "KRW",
];
const discountOptions = ["Price", "Percentage"];

const AdProduct = () => {
  const industryOptions = [
    "E-com",
    "Automotive",
    "Marketing",
    "B2B Consultant",
    "Other",
  ];

  const [productDetails, setProductDetails] = useState({
    productName: "",
    productDescription: "",
    type: "",
    industryName: "",
    productURL: "",
    productPrice: "",
    currency: "USD",
    discount: "Percentage",
    customDiscount: "",
    brandName: "",
    brandID: "",
    prompt: "",
    isEdit: false,
  });

  const [isProduct, setIsProduct] = useState(true); // Track whether it's Product or Service
  const [imageSrc, setImageSrc] = useState(null);

  // For storing brand info
  const [brands, setBrands] = useState([]);

  /**
   * images state:
   * Each element in images is an object of shape:
   * {
   *   file: File | null,
   *   url: string,
   *   uploaded: boolean // indicates if it's from search or if it's already uploaded
   * }
   */
  const [images, setImages] = useState([]);
  const [generatedImages, setGeneratedImages] = useState([]);

  // For managing selected images in the placeholder
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [selectedImageType, setSelectedImageType] = useState(null);

  // For pagination when searching images
  const [currentPage, setCurrentPage] = useState(1);

  // Accordion states
  const [isOpen, setIsOpen] = useState(true);
  const [expandedSubsection0, setExpandedSubsection0] = useState(true);
  const [expandedSubsection1, setExpandedSubsection1] = useState(false);
  const [expandedSubsection2, setExpandedSubsection2] = useState(false);
  const [completedSections, setCompletedSections] = useState({
    0: false,
    1: false,
    2: false,
  });

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const storedProductID = params.get("id");

  // 1. Fetch Brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        if (!jwtToken) {
          throw new Error("No JWT token found. Please log in.");
        }
        const response = await axios.get(`${baseUrl}/v2/api/brands`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        const fetchedBrands = response.data?.data || []; // Ensure it's an array
        setBrands(fetchedBrands);

        // If there's only one brand, pre-select it
        if (fetchedBrands.length === 1) {
          setProductDetails((prevDetails) => ({
            ...prevDetails,
            brandID: fetchedBrands[0].id,
            brandName: fetchedBrands[0].brandName,
          }));
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
        toast.error("Failed to fetch brands");
      }
    };

    fetchBrands();
  }, []);

  // 2. If Edit Mode, fetch existing product info
  useEffect(() => {
    const fetchProducts = async (id) => {
      try {
        if (!jwtToken) {
          throw new Error("No JWT token found. Please log in.");
        }
        const response = await axios.get(`${baseUrl}/product/${id}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        const foundProduct = response.data.data;
        if (foundProduct) {
          setProductDetails({
            productName: foundProduct.name || "",
            productDescription: foundProduct.description || "",
            productURL: foundProduct.productURL || "",
            type: foundProduct.type || "",
            industryName: foundProduct.industryName || "",
            brandID: foundProduct.brandID || "",
            logoURL: foundProduct.productImagesList[0]?.imageURL || "",
            discount: foundProduct.discountType || "Percentage",
            customDiscount: foundProduct.discount || "",
            productPrice: foundProduct.price || "",
            currency: foundProduct.priceType || "INR",
            isEdit: true,
          });

          // Map existing product images
          const existingImages = (foundProduct.productImagesList || []).map(
            (img) => ({
              file: null,
              url: img.imageURL,
              uploaded: true,
            })
          );
          setImages(existingImages);

          if (existingImages[0]) {
            setSelectedImageUrl(existingImages[0].url);
            setSelectedImageType("uploaded");
            setImageSrc(existingImages[0].url);
          }

          // Also set isProduct based on foundProduct.type
          if (foundProduct.type?.toLowerCase() === "service") {
            setIsProduct(false);
          } else {
            setIsProduct(true);
          }
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Failed to fetch product details");
      }
    };

    if (storedProductID) {
      fetchProducts(storedProductID);
    }
  }, [storedProductID]);

  // 3. Handle Form Input Changes
  const handleOnChange = (e) => {
    const { name, value } = e.target;

    if (name === "brandName") {
      // Find the brand from the list
      const selectedBrand = brands.find((brand) => brand.brandName === value);
      setProductDetails((prev) => ({
        ...prev,
        brandName: value,
        brandID: selectedBrand ? selectedBrand.id : "",
      }));
    } else {
      setProductDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 4. Submit Product (Create / Edit)
  const handleProductSubmission = async (e) => {
    e.preventDefault();

    // Convert strings to floats
    const defaultProductPrice = parseFloat(productDetails.productPrice) || 0;
    const defaultCurrency =
      productDetails.currency === "" ? "USD" : productDetails.currency;
    const defaultCustomDiscount =
      parseFloat(productDetails.customDiscount) || 0;
    const defaultDiscountType =
      productDetails.discount === "" ? "Percentage" : productDetails.discount;

    try {
      const isEditMode = productDetails.isEdit && storedProductID;

      // Build the productImagesList from images state
      const productImagesPayload = images.map((img) => ({
        imageURL: img.url,
      }));

      const productPayload = {
        id: isEditMode ? storedProductID : undefined,
        brandID: productDetails.brandID,
        type: productDetails.type||"product", // Default to product
        industryName: productDetails.industryName,
        name: productDetails.productName,
        description: productDetails.productDescription,
        productURL: productDetails.productURL||"", // Include scanned/typed URL
        price: defaultProductPrice,
        priceType: defaultCurrency,
        discount: defaultCustomDiscount,
        discountType: defaultDiscountType,
        productImagesList: productImagesPayload,
      };

      console.log("Product Payload:", productPayload);

      await axios.post(`${baseUrl}/product`, productPayload, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (isEditMode) {
        toast.success("Product updated successfully");
      } else {
        toast.success("Product created successfully");
      }
      navigate("/productspage");
    } catch (error) {
      console.error("Error during product submission:", error);
      toast.error("Failed to submit product");
    }
  };

  // 5. Handle discount logic
  const handleOnChangeProductDetails = (e) => {
    const { id, value } = e.target;
    if (id === "customDiscount") {
      const discountValue = parseFloat(value);
      const productPrice = parseFloat(productDetails.productPrice);

      if (productDetails.discount === "Percentage") {
        if (value === "" || (discountValue >= 0 && discountValue <= 100)) {
          setProductDetails({ ...productDetails, customDiscount: value });
        }
      } else if (productDetails.discount === "Price") {
        if (
          value === "" ||
          (!isNaN(discountValue) && discountValue <= productPrice)
        ) {
          setProductDetails({ ...productDetails, customDiscount: value });
        }
      }
    } else {
      setProductDetails({ ...productDetails, [id]: value });
    }
  };

  // 6. Upload / Drop file
  const handleFileChange = async (event) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (!file) return;

      const localUrl = URL.createObjectURL(file);

      // Immediately show the local preview
      const newFileObj = {
        file,
        url: localUrl,
        uploaded: false,
      };

      // Append to images
      setImages((prev) => [...prev, newFileObj]);
      setSelectedImageUrl(localUrl);
      setSelectedImageType("uploaded");
      setImageSrc(localUrl);

      // Upload the file in background
      try {
        const uploadedImageUrl = await uploadImage(file);
        // Once uploaded, update the images array to reflect the actual uploaded URL
        setImages((prevState) =>
          prevState.map((img) => {
            if (img.url === localUrl) {
              return {
                ...img,
                url: uploadedImageUrl,
                file: null,
                uploaded: true,
              };
            }
            return img;
          })
        );
        // If the placeholder was showing localUrl, update it to the final uploaded URL
        if (selectedImageUrl === localUrl) {
          setSelectedImageUrl(uploadedImageUrl);
          setImageSrc(uploadedImageUrl);
        }
      } catch (uploadErr) {
        console.error("Error uploading image:", uploadErr);
      }
    }
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      const file = event.dataTransfer.files[0];
      if (!file) return;

      const localUrl = URL.createObjectURL(file);

      // Show local preview immediately
      const newFileObj = {
        file,
        url: localUrl,
        uploaded: false,
      };
      setImages((prev) => [...prev, newFileObj]);
      setSelectedImageUrl(localUrl);
      setSelectedImageType("uploaded");
      setImageSrc(localUrl);

      toast.success("Image uploaded successfully");

      // Upload in background
      try {
        const uploadedImageUrl = await uploadImage(file);
        setImages((prevState) =>
          prevState.map((img) => {
            if (img.url === localUrl) {
              return {
                ...img,
                url: uploadedImageUrl,
                file: null,
                uploaded: true,
              };
            }
            return img;
          })
        );
        if (selectedImageUrl === localUrl) {
          setSelectedImageUrl(uploadedImageUrl);
          setImageSrc(uploadedImageUrl);
        }
      } catch (uploadErr) {
        console.error("Error uploading image:", uploadErr);
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // 7. Handle "Click" on a search image
  const handleImageClick = (imageUrl) => {
    // If not in images, append it
    setImages((prevImages) => {
      const alreadySelected = prevImages.some((img) => img.url === imageUrl);
      if (!alreadySelected) {
        return [...prevImages, { file: null, url: imageUrl, uploaded: true }];
      }
      return prevImages;
    });

    // Always set the placeholder to the newly clicked image
    setSelectedImageUrl(imageUrl);
    setSelectedImageType("uploaded");
    setImageSrc(imageUrl);
  };

  // 8. Delete image
  const handleDeleteImage = (index) => {
    const imageToRemove = images[index];
    if (!imageToRemove) {
      console.error("Image does not exist at index:", index);
      return;
    }

    // Prepare new images array
    const newImages = images.filter((_, i) => i !== index);

    // If the image we removed is currently displayed, we switch to next/previous
    if (selectedImageUrl === imageToRemove.url) {
      if (newImages.length > 0) {
        let nextIndex = index;
        if (nextIndex >= newImages.length) {
          nextIndex = newImages.length - 1;
        }
        const nextImage = newImages[nextIndex];
        setSelectedImageUrl(nextImage.url);
        setSelectedImageType(nextImage.uploaded ? "uploaded" : null);
        setImageSrc(nextImage.url);
      } else {
        // If no images remain, reset
        setSelectedImageUrl(null);
        setSelectedImageType(null);
        setImageSrc(null);
      }
    }
    setImages(newImages);
  };
/**
 * Shortens a description by taking up to maxWords words,
 * then (if possible) ending the result at the last sentence-ending punctuation
 * (".", "!", or "?") found near the end of that substring.
 *
 * @param {string} desc - The full description.
 * @param {number} maxWords - The maximum number of words to use.
 * @param {number} [boundary=50] - Look for sentence punctuation within the last boundary characters.
 * @returns {string} The shortened description.
 */
const shortenDescriptionBySentence = (desc, maxWords, boundary = 50) => {
  if (!desc) return "";
  // Split the description into words.
  const words = desc.split(/\s+/);
  // If there are fewer words than maxWords, return the full description.
  if (words.length <= maxWords) {
    return desc;
  }
  // Join the first maxWords words.
  let candidate = words.slice(0, maxWords).join(" ");
  
  // Check for the last occurrence of sentence-ending punctuation.
  const lastPeriod = candidate.lastIndexOf(".");
  const lastExclamation = candidate.lastIndexOf("!");
  const lastQuestion = candidate.lastIndexOf("?");
  const lastPunctuation = Math.max(lastPeriod, lastExclamation, lastQuestion);
  
  // If punctuation exists and is found near the end of the candidate string,
  // trim the candidate to end at that punctuation.
  if (lastPunctuation !== -1 && (candidate.length - lastPunctuation) <= boundary) {
    candidate = candidate.substring(0, lastPunctuation + 1);
  } else {
    // Optionally, if no punctuation is found near the end, you can append ellipses.
    candidate = candidate + "...";
  }
  
  return candidate;
};

  // 9. Scan URL
  const handleScanUrl = async () => {
    try {
      if (!jwtToken) {
        throw new Error("No JWT token found. Please log in.");
      }
  
      const response = await axios.post(
        `${baseUrl}/product/scrap-product-details`,
        { product_url: productDetails.productURL },
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );
  
      if (response.status === 200) {
        toast.success("Scan successful");
  
        // Extract the actual data from response.data.data
        const { data } = response.data;
        // data = { name, description, url } per your JSON
  
        setProductDetails({
          ...productDetails,
          productName: data.name || productDetails.productName,
          productDescription: data.description
      ? shortenDescriptionBySentence(data.description, 250)
      : productDetails.productDescription,
          productURL: data.url || productDetails.productURL,
        });
      } else {
        toast.error("Scan failed. Please try again.");
      }
    } catch (error) {
      console.log("Error scanning URL:", error);
      toast.error("Failed to scan the URL.");
    }
  };
  

  // 10. Discount type
  const handleDiscountChange = (e) => {
    const discountType = e.target.value;
    setProductDetails({
      ...productDetails,
      discountType: discountType,
      discount: discountType,
      customDiscount: "",
    });
  };

  // 11. Page change for search images
  const handlePageChange = async (page) => {
    setCurrentPage(page);
    try {
      const response = await axios.get(`${baseUrl}/search/get-images`, {
        params: {
          prompt: productDetails.prompt,
          page: page,
          size: 10,
        },
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setGeneratedImages(response.data.result.data);
    } catch (error) {
      console.error("Failed to generate images next page", error);
      toast.error("Failed to generate images.");
    }
  };

  // 12. Search for images
  const handleSearchForImages = async () => {
    try {
      const response = await axios.get(`${baseUrl}/search/get-images`, {
        params: {
          prompt: productDetails.prompt,
          page: currentPage,
          size: 10,
        },
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setGeneratedImages(response.data.result.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate images.");
    }
  };

  // 13. Actual image upload
  const uploadImage = async (imageFile) => {
    const uploadData = new FormData();
    uploadData.append("file", imageFile);

    try {
      const response = await axios.post(
        `${baseUrl}/sparkiq/image/upload?customerId=123`,
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Image uploaded successfully");
        return response.data.data.url;
      } else {
        toast.error("Failed to upload image");
        throw new Error("Upload failed");
      }
    } catch (error) {
      toast.error("Error uploading image");
      console.error(error);
      throw error;
    }
  };

  // 14. Toggle Product/Service
  const handleToggleType = (type) => {
    if (type === "Product") {
      setProductDetails((prev) => ({ ...prev, type: "product" }));
      setIsProduct(true);
    } else if (type === "Service") {
      setProductDetails((prev) => ({ ...prev, type: "service" }));
      setIsProduct(false);
    }
  };

  // 15. Validation & Steps completion
  const isNextStepDisabled =
    productDetails.productName === "" ||
    productDetails.productDescription === "" ||
    productDetails.brandName === "" ||
    productDetails.industryName === "";

  const handleSaveAndContinue = (currentSection) => {
    // Validation logic
    
    if (currentSection === 1 && isNextStepDisabled) {
      toast.error("Please fill in all the required fields correctly.");
      return false;
    }
    if (currentSection === 2 && images.length === 0) {
      toast.error("Please upload or select at least one image before proceeding.");
      return false;
    }

    // Mark the current section as completed
    const newCompletedSections = { ...completedSections };
    newCompletedSections[currentSection] = true;
    setCompletedSections(newCompletedSections);

    // Expand the next subsection
    if (currentSection === 0) {
      setExpandedSubsection0(false);
      setExpandedSubsection1(true);
    } else if (currentSection === 1) {
      setExpandedSubsection1(false);
      setExpandedSubsection2(true);
    } else if (currentSection === 2) {
      setExpandedSubsection2(false);
      toast.success("All sections completed!");
    }

    return true;
  };

  // 16. Industry selection
  const handleIndustrySelect = (event) => {
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      industryName: event.target.value,
    }));
  };

  // 17. Accordion toggles
  const toggleAccordion = (section, event) => {
    // Avoid toggling if user clicked inside certain elements
    const tagName = event.target.tagName;
    const excludedTags = ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "IMG", "PATH", "SVG"];
    if (excludedTags.includes(tagName)) return;

    if (completedSections[section]) {
      // Already completed, just toggle open/close
      if (section === 0) setExpandedSubsection0(!expandedSubsection0);
      if (section === 1) setExpandedSubsection1(!expandedSubsection1);
      if (section === 2) setExpandedSubsection2(!expandedSubsection2);
    } else {
      // Attempt to save & continue if not completed
      const canProceed = handleSaveAndContinue(section);
      if (!canProceed) return;
    }
  };

  const toggleAccordionSection0 = (event) => {
    toggleAccordion(0, event);
  };

  const toggleAccordionSection1 = (event) => {
    if (!completedSections[0]) {
      toast.error("Please complete the first section before proceeding.");
      return;
    }
    toggleAccordion(1, event);
  };

  const toggleAccordionSection2 = (event) => {
    if (!completedSections[1]) {
      toast.error("Please complete the second section before proceeding.");
      return;
    }
    toggleAccordion(2, event);
  };

  /** ---------------------------------- JSX RENDER ---------------------------------- **/

  return (
    <div className="flex-grow mr-8">
      <div
        className={`border border-white max-w-7xl bg-[rgba(252,252,252,0.25)] rounded-[24px] flex flex-col gap-1 relative z-10 overflow-auto ${
          isOpen ? "p-0" : "p-3"
        }`}
      >
        {/* HEADER */}
        <div
          className={`flex justify-between items-center bg-[rgba(252,252,252,0.40)] ${
            isOpen ? "rounded-t-[20px] p-4" : "rounded-[20px] lg:p-2 p-2"
          } relative cursor-pointer`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* Left Title */}
          <span className="flex items-center gap-4">
            <img src="/icon2.svg" alt="" />
            <span className="flex flex-col">
              <h4 className="text-[#082A66] font-bold text-lg lg:text-xl">
                Add Product Details
              </h4>
              <p className="text-[#374151] text-xs lg:text-sm">
                Upload photos and details of your product
              </p>
            </span>
          </span>

          {/* Right Side Info */}
          <div className="flex items-center gap-6 overflow-auto">
            {productDetails.isEdit && (
              <div className="flex items-center gap-2">
                <div className="bg-transparent rounded-[20px] px-4 py-[10px] shadow">
                  <p className="text-[#1E1154] font-medium">Edit Product</p>
                </div>
                <div className="bg-transparent rounded-[20px] px-4 py-[10px] shadow">
                  <p className="text-[#1E1154] font-medium">
                    {productDetails.productName || ""}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BODY */}
        {isOpen && (
          <div
            className="flex flex-col lg:flex-row p-8 w-full overflow-auto hide-scrollbar"
            style={{ maxHeight: "69vh" }}
          >
            {/* LEFT: Image Preview */}
            <div className="flex justify-center lg:justify-start mb-8 lg:mb-0 lg:mr-8">
              <div className="relative w-60 h-60 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-gradient-to-r from-[#F0F4F8] via-[#D9E9F2] to-[#F0F4F8] rounded-3xl flex items-center justify-center shadow-2xl transition-transform transform hover:scale-105 hover:rotate-2 duration-300">
                <div className="absolute w-[85%] h-[85%] sm:w-[90%] sm:h-[90%] md:w-[95%] md:h-[95%] bg-white rounded-3xl flex items-center justify-center shadow-inner overflow-hidden">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt="Product"
                      className="object-cover rounded-2xl w-full h-full transition-opacity duration-300"
                      style={{
                        backgroundColor: "white",
                        borderRadius: "20px",
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <IoImageOutline className="text-gray-300 text-6xl mb-4" />
                      <p className="text-gray-500 font-semibold">
                        Drag & Drop or Select an Image
                      </p>
                    </div>
                  )}
                </div>
                {/* Delete button on the placeholder preview */}
                {imageSrc && (
                  <button
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition duration-200 transform hover:scale-110"
                    onClick={() =>
                      handleDeleteImage(
                        images.findIndex((img) => img.url === imageSrc)
                      )
                    }
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT: Accordion Sections */}
            <div className="flex-grow pr-1">
              {/* SECTION 0: Basic Information */}
              <div
                onClick={toggleAccordionSection0}
                className={`relative border border-[#fcfcfc] p-0 rounded-2xl mb-4 cursor-pointer ${
                  expandedSubsection0 ? "bg-[rgba(252,252,252,0.25)]" : ""
                }`}
              >
                <div
                  className={`flex items-center justify-between ${
                    expandedSubsection0 ? "bg-[#F6F8FE]" : ""
                  } p-4 rounded-t-2xl`}
                >
                  <div className="flex items-center">
                    <div className="bg-[rgba(0,39,153,0.15)] rounded-full p-2">
                      <FaRegLightbulb className="text-[#374151] text-xl" />
                    </div>
                    <p className="ml-3 text-lg font-semibold mt-0 pt-0">
                      Basic Information
                    </p>
                  </div>

                  {/* Show "Product" or "Service" if step 0 is completed */}
                  {completedSections[0] && (
                    <div className="flex items-end rounded-xl shadow-xl bg-white border-2 p-1 px-6">
                      <p className="m-0 text-sm sm:text-base md:text-lg">
                        {isProduct ? "Product" : "Service"}
                      </p>
                    </div>
                  )}

                  <div>
                    {expandedSubsection0 ? <FaChevronDown /> : <FaChevronRight />}
                  </div>
                </div>

                {/* SECTION 0 Content */}
                {expandedSubsection0 && (
                  <div className="p-4">
                    <div className="flex flex-col md:flex-row items-center gap-5 mb-4">
                      <p className="text-base">What do you want to add?</p>
                    </div>
                    <div className="flex gap-4 mb-4">
                      <button
                        className={`w-1/4 p-3 py-5 rounded-lg shadow-xl border-2 ${
                          isProduct
                            ? "bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] border-blue-500"
                            : "bg-gray-200 border-gray-400"
                        } font-medium flex items-center justify-center gap-2`}
                        onClick={() => handleToggleType("Product")}
                      >
                        <FaCartShopping className="text-xl" /> Product
                      </button>
                      <button
                        className={`w-1/4 p-3 py-5 rounded-lg shadow-xl border-2 ${
                          !isProduct
                            ? "bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] border-blue-500"
                            : "bg-gray-200 border-gray-400"
                        } font-medium flex items-center justify-center gap-2`}
                        onClick={() => handleToggleType("Service")}
                      >
                        <FcServices className="text-xl" /> Service
                      </button>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-5 mb-4">
                      <input
                        type="text"
                        placeholder={`Your landing page for ${
                          isProduct ? "Product" : "Service"
                        } or website (e.g., spark.ai)`}
                        name="productURL"
                        value={productDetails.productURL}
                        onChange={handleOnChange}
                        className="rounded-lg py-3 pl-6 pr-4 shadow-md w-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                      />
                      <button
                        className="w-fit custom-button rounded-2xl text-white py-3 px-8 whitespace-pre font-medium"
                        onClick={handleScanUrl}
                      >
                        Scan the URL
                      </button>
                    </div>
                    <div className="flex justify-start mt-4">
                      <button
                        className="custom-button p-2 pl-4 pr-4 text-white rounded-2xl shadow-2xl"
                        onClick={() => handleSaveAndContinue(0)}
                      >
                        Save and Continue
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 1: Product/Service Details */}
              <div
                onClick={toggleAccordionSection1}
                className={`relative border border-[#fcfcfc] p-0 rounded-2xl mb-4 cursor-pointer ${
                  !completedSections[0] ? "opacity-50 cursor-not-allowed" : ""
                } ${expandedSubsection1 ? "bg-[rgba(252,252,252,0.25)]" : ""}`}
              >
                <div
                  className={`flex items-center justify-between ${
                    expandedSubsection1 ? "bg-[#F6F8FE]" : ""
                  } p-4 rounded-t-2xl`}
                >
                  <div className="flex items-center">
                    <div className="bg-[rgba(0,39,153,0.15)] rounded-full p-2">
                    <FaRegLightbulb className="text-[#374151] text-xl" />
                    </div>
                    <p className="ml-3 text-lg font-semibold mt-0 pt-0">
                      {isProduct ? "Product Details" : "Service Details"}
                    </p>
                  </div>
                  {completedSections[1] && (
                    <div className="flex items-end rounded-xl shadow-xl bg-white border-2 p-1 px-6">
                      <p className="m-0 text-sm sm:text-base md:text-lg">
                        {productDetails.productName}
                      </p>
                    </div>
                  )}
                  <div>
                    {expandedSubsection1 ? <FaChevronDown /> : <FaChevronRight />}
                  </div>
                </div>

                {expandedSubsection1 && (
                  <div className="p-4">
                    <div className="flex flex-col md:flex-row gap-5 mb-4">
                      <input
                        type="text"
                        name="productName"
                        placeholder={isProduct ? "Product Name" : "Service Name"}
                        value={productDetails.productName}
                        onChange={handleOnChange}
                        className=" w-full p-2 py-3 rounded-lg shadow-xl border border-[#fcfcfc] bg-[#FCFCFC] focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                      />
                      <select
                        className="w-full p-2 rounded-lg shadow-xl border border-[#fcfcfc] bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                        name="brandName"
                        value={productDetails.brandName}
                        onChange={handleOnChange}
                        style={{
                          backgroundRepeat: "no-repeat",
                          backgroundColor: "#D9E9F2",
                          backgroundSize: "auto",
                        }}
                      >
                        <option value="">Select Brand Name</option>
                        {brands.map((brand) => (
                          <option key={brand.id} value={brand.brandName}>
                            {brand.brandName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-4">
                      <textarea
                        name="productDescription"
                        placeholder={
                          isProduct ? "Product Description" : "Service Description"
                        }
                        rows="3"
                        value={productDetails.productDescription}
                        onChange={handleOnChange}
                        className="w-full p-2 rounded-lg shadow-xl border border-[#fcfcfc] bg-[#FCFCFC] focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col md:flex-row gap-5 mb-4">
                      <div className="relative w-full md:w-1/2">
                        <input
                          type="number"
                          placeholder="Enter Price"
                          name="productPrice"
                          value={productDetails.productPrice}
                          onChange={handleOnChange}
                          className="rounded-lg py-4 pl-32 pr-4 shadow-md w-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                          autoComplete="off"
                        />
                        <div className="absolute top-0 left-0 flex items-center h-full">
                          <select
                            name="currency"
                            value={productDetails.currency}
                            onChange={handleOnChange}
                            className="bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] border border-[#FCFCFC] rounded-[12px] px-6 m-2 h-[44px] focus:outline-none"
                            style={{
                              backgroundRepeat: "no-repeat",
                              backgroundColor: "#D9E9F2",
                              backgroundSize: "auto",
                            }}
                          >
                            {currencies.map((currency, index) => (
                              <option key={index} value={currency}>
                                {currency}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="relative w-full md:w-1/2">
                        <input
                          type="number"
                          placeholder={`Enter Discount in ${
                            productDetails.discount || "Percentage"
                          }`}
                          id="customDiscount"
                          min="0"
                          max={
                            productDetails.discount === "Percentage"
                              ? "100"
                              : undefined
                          }
                          value={productDetails.customDiscount || ""}
                          onChange={handleOnChangeProductDetails}
                          className="rounded-lg py-4 pl-44 pr-4 shadow-md w-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                          autoComplete="off"
                        />
                        <div className="absolute top-0 left-0 flex items-center h-full">
                          <select
                            id="discount"
                            onChange={(e) =>
                              setProductDetails({
                                ...productDetails,
                                discount: e.target.value,
                                customDiscount: "",
                              })
                            }
                            value={productDetails.discount}
                            className="bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] border border-[#FCFCFC] rounded-[12px] px-6 m-2 h-[44px] focus:outline-none"
                            style={{
                              backgroundRepeat: "no-repeat",
                              backgroundColor: "#D9E9F2",
                              backgroundSize: "auto",
                            }}
                          >
                            {discountOptions.map((discount, index) => (
                              <option key={index} value={discount}>
                                {discount}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="industry"
                        className="block text-sm font-medium text-gray-700 mb-3"
                      >
                        Select Industry
                      </label>
                      <select
                        id="industry"
                        name="industry"
                        value={productDetails.industryName}
                        onChange={handleIndustrySelect}
                        className="rounded-lg py-3 pl-6 pr-4 shadow-md w-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                      >
                        <option value="">-- Select an Industry --</option>
                        {industryOptions.map((industry, idx) => (
                          <option key={idx} value={industry}>
                            {industry}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex justify-start mt-4">
                      <button
                        className="custom-button p-2 pl-4 pr-4 text-white rounded-2xl shadow-2xl"
                        onClick={() => handleSaveAndContinue(1)}
                      >
                        Save and Continue
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 2: Upload or Select Image */}
              <div
                onClick={toggleAccordionSection2}
                className={`relative border border-[#fcfcfc] p-0 rounded-2xl mb-4 cursor-pointer overflow-auto hide-scrollbar ${
                  !completedSections[1] ? "opacity-50 cursor-not-allowed" : ""
                } ${expandedSubsection2 ? "bg-[rgba(252,252,252,0.25)]" : ""}`}
                style={{
                  pointerEvents: !completedSections[1] ? "none" : "auto",
                  maxHeight: "51vh",
                }}
              >
                <div
                  className={`flex items-center justify-between ${
                    expandedSubsection2 ? "bg-[#F6F8FE]" : ""
                  } p-4 rounded-t-2xl`}
                >
                  <div className="flex items-center">
                    <div className="bg-[rgba(0,39,153,0.15)] rounded-full p-2">
                      <IoImageOutline className="text-[#374151] text-xl" />
                    </div>
                    <p className="ml-3 text-lg font-semibold">
                      {isProduct
                        ? "Upload or Select Product Image"
                        : "Upload or Select Service Image"}
                    </p>
                  </div>

                  {/* If section 2 completed, show a small preview in the heading */}
                  {completedSections[2] && (
                    <div className="flex items-center ml-auto bg-white rounded-lg p-1">
                      {images[0] && (
                        <img
                          src={images[0].url}
                          alt="Product Image"
                          className="w-12 h-7 object-cover rounded-md"
                        />
                      )}
                    </div>
                  )}
                  <div className="ml-4">
                    {expandedSubsection2 ? <FaChevronDown /> : <FaChevronRight />}
                  </div>
                </div>

                {expandedSubsection2 && (
                  <div className="p-4 hide-scrollbar">
                    {/* FILE UPLOAD */}
                    <div className="border-2 border-[#fcfcfc] rounded-2xl m-2 p-1">
                      <div className="bg-white rounded-xl m-1 p-2 shadow-lg">
                        <div
                          className="border-dashed border-2 border-gray-400 bg-white rounded-lg p-1 text-center cursor-pointer hover:border-gray-600 relative"
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full h-full absolute inset-0 opacity-0 cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                            id="file-upload"
                          />
                          <label
                            htmlFor="file-upload"
                            className="flex flex-col items-center justify-center h-full cursor-pointer"
                          >
                            <PiFileArrowUpDuotone className="rounded-xl w-6 h-6" />
                            <span className="text-gray-500 text-nowrap sm:text-xs">
                              {isProduct
                                ? "Upload a product image here or drag and drop a product image here."
                                : "Upload a service image here or drag and drop a service image here."}
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* OR Icon */}
                    <div className="flex justify-center">
                      <img src="/orIcon.svg" alt="" />
                    </div>

                    {/* PROMPT / SEARCH IMAGES */}
                    <div className="flex flex-col md:flex-row p-2">
                      <div className="bg-[#FCFCFC40] shadow-md rounded-md border border-[#FCFCFC] flex flex-col gap-[18px] w-full p-2">
                        <span className="flex flex-col md:flex-row items-center gap-5">
                          <input
                            type="text"
                            placeholder="Enter Your prompt for images (e.g: Tuition classes)"
                            id="prompt"
                            name="prompt"
                            value={productDetails.prompt}
                            onChange={handleOnChangeProductDetails}
                            className="rounded-lg py-3 pl-6 pr-4 shadow-md w-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                          />
                          <button
                            className="w-fit custom-button rounded-lg text-white py-2 px-6 whitespace-pre font-medium"
                            onClick={handleSearchForImages}
                          >
                            Search for Images
                          </button>
                        </span>
                      </div>
                    </div>

                    {/* SEARCH RESULTS */}
                    <div className="flex-row">
                      {generatedImages.length > 0 && (
                        <div>
                          <div className="relative w-full overflow-x-scroll border border-[#FCFCFC] p-1 rounded-md">
                            <div className="flex space-x-4 relative">
                              {generatedImages.map((image, index) => {
                                // Check if this image is already in the user's selected images
                                const isSelected = images.some(
                                  (img) => img.url === image.imgUrl
                                );
                                return (
                                  <div
                                    key={index}
                                    className="relative flex-shrink-0 border rounded-lg"
                                  >
                                    <img
                                      src={image.imgUrl}
                                      alt={image.description}
                                      className="w-40 h-40 object-cover rounded-lg shadow-lg cursor-pointer"
                                      onClick={() => handleImageClick(image.imgUrl)}
                                    />
                                    {isSelected && (
                                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow">
                                        <FaCheck className="text-white text-sm" />
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <div className="flex justify-end gap-4 mt-2">
                            <button
                              className="custom-button px-5 text-white rounded-md shadow-2xl"
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              Prev
                            </button>
                            <button
                              className="custom-button py-1 pl-4 pr-4 text-white rounded-md shadow-2xl"
                              onClick={() => handlePageChange(currentPage + 1)}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SELECTED IMAGES LIST */}
                    {images.length > 0 && (
                      <div className="mt-4">
                        <h3 className="mb-2">Selected Images:</h3>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                          {images.map((img, idx) => (
                            <div
                              key={idx}
                              className="relative border rounded-lg overflow-hidden"
                            >
                              <img
                                src={img.url}
                                alt="Selected"
                                className="h-24 w-full object-cover"
                              />
                              <button
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition duration-200"
                                onClick={() => handleDeleteImage(idx)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-start mt-4">
                      <button
                        className="custom-button p-2 pl-4 pr-4 text-white rounded-2xl shadow-2xl"
                        onClick={() => handleSaveAndContinue(2)}
                      >
                        Save and Continue
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* FINAL SUBMIT BUTTON */}
              <div className="flex justify-start items-center">
                {completedSections[1] && completedSections[2] && (
                  <div className="flex justify-start p-4 pl-2">
                    <button
                      className="w-fit rounded-xl text-white py-3 px-6 font-medium custom-button"
                      disabled={isNextStepDisabled}
                      onClick={handleProductSubmission}
                    >
                      {!productDetails.isEdit ? "Create Product" : "Edit Product"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdProduct;
