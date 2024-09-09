import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PiFileArrowUpDuotone } from "react-icons/pi";
import {
  FaChevronRight,
  FaChevronDown,
  FaRegLightbulb,
  FaCheck,
} from "react-icons/fa";
import brandImage from "../../assets/dashboard_img/brand_img.png";
import gallery from "../../assets/dashboard_img/gallerylogo.png";
import sound from "../../assets/dashboard_img/sound.png";
import brandIcon from "../../assets/dashboard_img/brand.svg"; // Adjust the path as needed
import "./brandsetup.css"; // Import the CSS file
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { baseUrl } from "../../components/utils/Constant";
import { jwtToken } from "../../components/utils/jwtToken";
import axios from "axios";

const BrandSetup = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const brandName = params.get("name");

  const [formInputs, setFormInputs] = useState({
    brandName: brandName || "",
    brandDescription: "",
    brandLogo: null,
    brandId: "",
    imageFile: null,
    logoURL: "",
    showSubmitButton: false,
    isEdit: false,
  });

  const [completedSections, setCompletedSections] = useState({
    1: false,
    2: false,
  });
  const [expandedSection, setExpandedSection] = useState(1); // Open first section by default
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState("");

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setFormInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  useEffect(() => {
    let isMounted = true;

    const fetchBrands = async (name) => {
      try {
        if (!jwtToken) {
          throw new Error("No JWT token found. Please log in.");
        }
        const response = await axios.get(`${baseUrl}/brand/company/123`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        console.log(response.data);
        if (isMounted) {
          const foundBrand = response.data.data.find(
            (brand) => brand.name === name
          );
          if (foundBrand) {
            setFormInputs({
              brandName: foundBrand.name,
              brandDescription: foundBrand.description,
              logoURL: foundBrand.logoURL,
              brandId: foundBrand.id,
              isEdit: true,
              showSubmitButton: true,
            });
            setCompletedSections({ 1: true, 2: true });
            setExpandedSection(null);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (brandName) {
      fetchBrands(brandName);
    }

    return () => {
      isMounted = false;
    };
  }, [brandName]);

  useEffect(() => {
    if (formInputs.brandLogo) {
      setImageSrc(formInputs.brandLogo);
    } else if (formInputs.logoURL) {
      setImageSrc(formInputs.logoURL);
    } else {
      setImageSrc(gallery);
    }
  }, [formInputs.brandLogo, formInputs.logoURL]);

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormInputs({
        ...formInputs,
        brandLogo: URL.createObjectURL(file),
        imageFile: file,
      });
    }
  };

  const handleSaveAndContinue = (section) => {
    if (
      (section === 1 &&
        (!formInputs.brandName || !formInputs.brandDescription)) ||
      (section === 2 && !formInputs.brandLogo && !formInputs.logoURL)
    ) {
      toast.error("Please fill in all the required fields.");
      return;
    }
    const newCompletedSections = { ...completedSections };
    newCompletedSections[section] = true;
    setCompletedSections(newCompletedSections);

    if (section === 2) {
      setFormInputs({ ...formInputs, showSubmitButton: true });
    }

    setExpandedSection(section + 1); // Automatically open the next section
  };

  const uploadImage = async () => {
    const uploadData = new FormData();
    uploadData.append("file", formInputs.imageFile);
    uploadData.append("customerId", "123");
  
    try {
      if (!jwtToken) {
        throw new Error("No JWT token found. Please log in.");
      }
      const response = await axios.post(`${baseUrl}/sparkiq/image/upload`, uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${jwtToken}`,
        },
      });
  
      const logoURL = response.data.data.url;
      setFormInputs((prevInputs) => ({
        ...prevInputs,
        logoURL, // Set the uploaded logo URL
        showSubmitButton: true, // Now show the submit button after logo is uploaded
      }));
  
      toast.success("Image upload successful");
    } catch (error) {
      console.log(error);
    }
  };
  

  const toggleSection = (section) => {
    if (section === 1 || completedSections[section - 1]) {
      setExpandedSection((prev) => (prev === section ? null : section));
    }
  };

  const truncateText = (text, maxLength) => {
    if (text?.length <= maxLength) {
      return text;
    }
    return text?.substring(0, maxLength) + "...";
  };

  const getDisplayText = (name, description) => {
    const upperCaseName = name.toUpperCase();
    if (upperCaseName.length >= 30) {
      return upperCaseName;
    }
    const maxLength = 30;
    const availableLength = maxLength - upperCaseName.length - 1;
    const truncatedDescription = description
      .split(" ")
      .reduce((acc, word) => {
        if (
          (acc + word.charAt(0).toUpperCase() + word.slice(1)).length <=
          availableLength
        ) {
          return acc + " " + word.charAt(0).toUpperCase() + word.slice(1);
        }
        return acc;
      }, "")
      .trim();
    return `${upperCaseName} ${truncatedDescription}`;
  };

  const handleCreateOrEditBrand = async (logoURL) => {
    const newBrand = {
      id: formInputs.isEdit ? formInputs.brandId : "123",
      name: formInputs.brandName,
      description: formInputs.brandDescription,
      logoURL: logoURL || formInputs.logoURL,
      brandColours: '#FCFCFC', // Pass empty array for colors
    };

    try {
      if (!jwtToken) {
        throw new Error("No JWT token found. Please log in.");
      }

      await axios
        .post(`${baseUrl}/brand`, newBrand, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        })
        .then((res) => {
          toast.success(
            formInputs.isEdit ? "Brand edited successfully" : "Brand created successfully"
          );

          localStorage.setItem("task1Completed", "true");

          navigate("/homepage");
          console.log(res);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex-grow">
      <div className="max-w-6xl mx-auto border border-[#fcfcfc] rounded-3xl flex flex-col items-center">
        <div className="w-full bg-[rgba(252,252,252,0.40)] rounded-t-3xl lg:p-1 p-4">
          <div className="flex items-center ml-4">
            <div className="flex items-center justify-center w-12 h-12 bg-[rgba(0,39,153,0.15)] rounded-2xl">
              <div className="relative w-8 h-8 bg-[#082A66] rounded-xl flex items-center justify-center">
                <img src={brandIcon} className="w-4 h-4" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#082a66] ml-4 md:mr-auto text-nowrap">
              {formInputs.isEdit ? "Edit Brand" : "Brand Setup"}
            </h1>
            <img
              src={brandImage}
              alt="Brand Banner"
              className="w-24 h-12 sm:w-32 sm:h-16 md:w-[180px] md:h-[90px] lg:mr-20 sm:ml-4 md:m-auto hidden lg:block"
            />
          </div>
        </div>
        <div
          className="flex flex-col lg:flex-row p-8 w-full mb-2 overflow-y-auto hide-scrollbar"
          style={{ maxHeight: "64vh" }}
        >
          <div className="flex justify-center lg:justify-start mb-8 lg:mb-0 lg:mr-8">
            <div className="relative w-60 h-60 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-white rounded-3xl flex items-center justify-center">
              <div className="absolute w-48 h-48 sm:w-64 sm:h-64 md:w-[21rem] md:h-[20rem] bg-[#859398] rounded-3xl flex items-center justify-center">
                <div className="absolute w-36 h-28 sm:w-48 sm:h-40 bg-[rgba(255,255,255,0.24)] rounded-2xl flex items-center justify-center border border-red-500">
                  <img
                    src={imageSrc}
                    alt="Brand"
                    className="w-32 h-24 sm:w-36 sm:h-28 object-cover rounded-xl"
                  />
                </div>
              </div>
              <div className="absolute top-0 w-full flex flex-col items-center justify-center p-4 text-white">
                <h2 className="text-md sm:text-xl md:text-2xl font-bold capitalize md:pt-8 sm:pt-1">
                  {truncateText(formInputs.brandName, 15)}
                </h2>
                <p className="text-xs sm:text-base md:text-lg text-center">
                  {truncateText(formInputs?.brandDescription, 35)}
                </p>
              </div>
              <img
                src={sound}
                alt="Microphone"
                className="absolute top-0 right-2 w-6 h-6 sm:w-8 sm:h-8"
              />
            </div>
          </div>
          <div className="flex-grow pr-1">
            <div
              onClick={() => toggleSection(1)}
              className={`relative border border-[#fcfcfc] p-0 rounded-2xl mb-4 cursor-pointer ${
                expandedSection === 1 ? "bg-[rgba(252,252,252,0.25)]" : ""
              }`}
            >
              {completedSections[1] && (
                <div className="absolute -top-3 -right-6 flex items-center bg-[#A7F3D0] text-[#059669] px-2 py-1 rounded-xl">
                  <div className="text-xs">Completed</div>
                  <FaCheck className="ml-1" />
                </div>
              )}
              <div
                className={`flex items-center justify-between ${
                  expandedSection === 1 ? "bg-[#F6F8FE]" : ""
                } p-4 rounded-t-2xl`}
              >
                <div className="flex items-center">
                  <div className="bg-[rgba(0,39,153,0.15)] rounded-full p-2">
                    <FaRegLightbulb className="text-[#374151] text-xl" />
                  </div>
                  <p className="ml-3 lg:text-nowrap">
                    Write Brand Name & Description
                  </p>
                </div>
                {completedSections[1] && (
                  <div className="flex items-end bg-white rounded-2xl p-1 pl-2 pr-2 ml-2">
                    <p className="m-0 text-sm sm:text-base md:text-lg">
                      {truncateText(
                        getDisplayText(
                          formInputs.brandName,
                          formInputs.brandDescription
                        ),
                        15
                      )}
                    </p>
                  </div>
                )}
                <div>
                  {expandedSection === 1 ? (
                    <FaChevronDown />
                  ) : (
                    <FaChevronRight />
                  )}
                </div>
              </div>
              {expandedSection === 1 && (
                <div className="p-4">
                  <input
                    type="text"
                    placeholder="Brand Name"
                    value={formInputs.brandName}
                    name="brandName"
                    onChange={handleOnChange}
                    className="w-full p-2 rounded-lg shadow-xl border border-[#fcfcfc] mb-2 bg-[#FCFCFC] focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <textarea
                    placeholder="Brand Description"
                    rows="3"
                    value={formInputs.brandDescription}
                    name="brandDescription"
                    onChange={handleOnChange}
                    className="w-full p-2 rounded-lg shadow-xl border border-[#fcfcfc] mb-2 bg-[#FCFCFC] focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    className="custom-button p-2 pl-4 pr-4 text-white rounded-2xl shadow-2xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveAndContinue(1);
                    }}
                  >
                    Save and Continue
                  </button>
                </div>
              )}
            </div>
            <div
              onClick={() =>
                formInputs.isEdit || completedSections[1]
                  ? toggleSection(2)
                  : null
              }
              className={`relative border border-[#fcfcfc] p-0 rounded-2xl mb-4 cursor-pointer ${
                expandedSection === 2 ? "bg-[rgba(252,252,252,0.25)]" : ""
              } ${
                !formInputs.isEdit && !completedSections[1]
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {completedSections[2] && (
                <div className="absolute -top-3 -right-6 flex items-center bg-[#A7F3D0] text-[#059669] px-2 py-1 rounded-xl">
                  <div className="text-xs">Completed</div>
                  <FaCheck className="ml-1" />
                </div>
              )}
              <div
                className={`flex items-center justify-between ${
                  expandedSection === 2 ? "bg-[#F6F8FE]" : ""
                } p-4 rounded-t-2xl`}
              >
                <div className="flex items-center">
                  <div className="bg-[rgba(0,39,153,0.15)] rounded-full p-2">
                    <FaRegLightbulb className="text-[#374151] text-xl" />
                  </div>
                  <p className="ml-3 flex items-center justify-center">
                    Select Brand Logo
                  </p>
                </div>
                {completedSections[2] && (
                  <div className="flex items-center ml-auto bg-white rounded-lg p-1">
                    <img
                      src={formInputs.brandLogo || formInputs.logoURL}
                      alt="Brand Logo"
                      className="w-12 h-7 object-cover rounded-md"
                    />
                  </div>
                )}
                <div className="ml-4">
                  {expandedSection === 2 ? (
                    <FaChevronDown />
                  ) : (
                    <FaChevronRight />
                  )}
                </div>
              </div>
              {expandedSection === 2 && (
                <div className="p-4">
                  <p className="text-sm">
                    Upload your logo here. A dark-colored logo with a
                    transparent background is recommended.
                  </p>
                  <div className="border-2 border-[#fcfcfc] rounded-2xl m-2 p-1 ">
                    <div className="bg-white rounded-xl m-1 p-2 shadow-lg">
                      <div className="border-dashed border-2 border-gray-400 bg-white rounded-lg p-1 m-1 text-center cursor-pointer hover:border-gray-600 relative">
                        <input
                          type="file"
                          onChange={handleLogoUpload}
                          className="w-full h-full absolute inset-0 opacity-0 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="flex flex-col items-center justify-center h-full cursor-pointer"
                        >
                          <PiFileArrowUpDuotone className="rounded-xl w-6 h-6" />
                          <span className="text-gray-500 text-nowrap">
                            Upload a logo here
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <button
                    className="custom-button p-2 pl-4 pr-4 mt-4 text-white rounded-2xl shadow-2xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveAndContinue(2);
                      if (formInputs.imageFile) {
                        // Upload the image and then enable the submission button
                        uploadImage();
                      }
                    }}
                  >
                    Save and Continue
                  </button>
                </div>
              )}
            </div>
            {formInputs.showSubmitButton && (
              <div className="flex justify-start mt-4">
                <button
                  className="custom-button p-2 pl-6 ml-2 pr-6 text-white rounded-lg"
                  onClick={() => {
                    if (formInputs.logoURL) {
                      handleCreateOrEditBrand(); // Now create or update brand after logo is uploaded and button is clicked
                    } else if (formInputs.imageFile) {
                      // If the image is not uploaded yet, first upload it and then create or update the brand
                      uploadImage().then(() => handleCreateOrEditBrand());
                    }
                  }}
                >
                  {formInputs.isEdit ? "Update" : "Create Brand"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandSetup;
