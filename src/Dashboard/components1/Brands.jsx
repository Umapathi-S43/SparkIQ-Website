import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import brandImage from "../../assets/dashboard_img/brand_img.png";
import picon from "../../assets/dashboard_img/picon.svg";
import SvgBackground from "../../components/Dashboard/SvgBackground";
import brandIcon from "../../assets/dashboard_img/brand.svg"; // Adjust the path as needed
import { baseUrl } from "../../components/utils/Constant";
import api from "../../utils/axiosFetch";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleCreateBrand = () => {
    navigate("/brandsetup/");
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const truncateText = (text, maxLength) => {
    if (text?.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await api.get(`${baseUrl}/brand/company/123`);
        setBrands(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await api.get(`${baseUrl}/product`);
        setProducts(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBrands();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (brands.length > 0 && products.length > 0) {
      const updatedBrands = brands.map((brand) => {
        const productCount = products.filter(product => product.brandID === brand.id).length;
        return {
          ...brand,
          productsCreated: productCount,
        };
      });
      setBrands(updatedBrands);
    }
  }, [brands, products]);

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-grow mb-6">
      <div className="max-w-6xl mx-auto border border-[#fcfcfc] rounded-3xl flex flex-col items-center">
        <div className="w-full bg-[rgba(252,252,252,0.40)] rounded-t-3xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative flex items-center justify-center lg:ml-4">
                <div className="absolute flex items-center justify-center lg:w-12 lg:h-12 w-10 h-10 bg-[rgba(0,39,153,0.15)] rounded-2xl"></div>
                <div className="relative lg:w-8 lg:h-8  w-7 h-7 bg-[#082A66] rounded-xl flex items-center justify-center">
                  <img src={brandIcon} className="w-4 h-4" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="lg:text-3xl text-xl font-bold text-[#082a66] lg:ml-4">
                  Brands
                </h1>
                <p className="lg:text-sm text-xs text-[#082a66] lg:ml-4">
                  Explore existing products or add new ones effortlessly
                </p>
              </div>
            </div>
            <img
              src={brandImage}
              alt="Brand Banner"
              className="w-[180px] h-[90px] mr-20 md:-mb-4 hidden lg:block"
            />
          </div>
        </div>
        <div className="flex items-center justify-end w-full px-3 m-8 mb-2">
          <div className="flex items-center bg-white mb-4 rounded-xl shadow-xl lg:mr-12 mr-4 ">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-3 pr-10 ring-1 ring-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
              />
              <MagnifyingGlassIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 focus:text-blue-500" />
            </div>
          </div>
        </div>

        <div
          className="flex flex-wrap justify-between w-full ml-4 p-4 items-center overflow-auto hide-scrollbar grid-cols-4 gap-4"
          style={{ maxHeight: "46vh" }}
        >
          <div className="w-full flex flex-wrap justify-start gap-4 ml-4 pl-2">
            <div className="flex items-center justify-center bg-[rgba(252,252,252,0.70)] border border-white rounded-3xl p-1 w-60 h-72 mr-3 hover:bg-[rgba(252,252,252,0.15)]">
              <div
                onClick={handleCreateBrand}
                className="relative p-4 rounded-3xl shadow-sm cursor-pointer bg-[rgba(252,252,252,0.25)] border border-[#FCFCFC] flex flex-col items-center justify-center w-full h-full"
                style={{
                  background:
                    "linear-gradient(to left bottom, rgba(92, 198, 255, 0.15), rgba(0, 160, 245, 0.3))",
                }}
              >
                <div className="bg-[#00A0F5] w-8 h-8 rounded-xl flex items-center justify-center">
                  <FaPlus className="text-white w-6 h-6 flex justify-center text-xs" />
                </div>
                <p className="mt-4 text-lg text-[#00a7ff]">Create a Brand</p>
                <p className="text-sm text-center mt-2">
                  Click here to add an additional brand that you can use to
                  generate assets.
                </p>
              </div>
            </div>
            {filteredBrands.map((brand, index) => (
              <div
                key={index}
                className="group brand-card1 flex items-center justify-center w-64 h-80"
                onClick={() =>
                  navigate(`/brandsetup?name=${encodeURIComponent(brand.name)}`)
                }
              >
                <div className="relative flex flex-col items-center justify-center text-white w-full h-full overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full">
                    <SvgBackground />
                  </div>
                  <div className="absolute top-8 bg-white p-2 rounded-lg mt-0 mb-8">
                    <img
                      src={brand.logoURL}
                      alt={brand.name}
                      className="w-16 h-16 object-cover rounded-lg group-hover:mt-0"
                    />
                  </div>
                  <div className="absolute top-30 text-center">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-xl">
                      {brand.name}
                    </h3>
                    <p className="text-md font-thin text-start ml-4 truncate-line-clamp group-hover:font-light">
                      {truncateText(brand?.description, 55)}
                    </p>
                  </div>
                  <div className="absolute top-52 text-sm mt-4 flex items-center">
                    <img
                      src={picon}
                      alt="Products Icon"
                      className="w-5 h-5 p-1 mr-2 opacity-80 rounded-md"
                      style={{ background: "rgba(0, 0, 0, 0.2)" }}
                    />
                    <span className="opacity-80">
                      {brand.productsCreated || 0} Products Created
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brands;
