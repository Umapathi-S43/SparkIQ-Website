import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import brandImage from "../../assets/dashboard_img/brand_img.png"; // Adjust the path as needed
import brandIcon from "../../assets/dashboard_img/brand.svg"; // Adjust the path as needed
import axios from "axios";
import { baseUrl } from "../../components/utils/Constant";
import { jwtToken } from "../../components/utils/jwtToken";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("AllBrands");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      if (!jwtToken) {
        throw new Error("No JWT token found. Please log in.");
      }
      const response = await axios.get(`${baseUrl}/product`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setProducts(response.data.data);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch products.");
    }
  };

  const fetchBrands = async () => {
    try {
      if (!jwtToken) {
        throw new Error("No JWT token found. Please log in.");
      }
      const response = await axios.get(`${baseUrl}/brand/company/123`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setBrands(response.data.data);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch brands.");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchBrands();
  }, []);

  const handleCreateProduct = () => {
    navigate("/productdetails");
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleBrandChange = (event) => {
    setSelectedBrand(event.target.value);
  };

  const filteredProducts = products?.filter((product) => {
    const matchesSearchQuery =
      (product.name &&
        product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.description &&
        product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesBrand =
      selectedBrand === "AllBrands" || product.brandID === selectedBrand;
    return matchesSearchQuery && matchesBrand;
  });

  return (
    <div
      className="flex-grow overflow-y-auto hide-scrollbar"
      style={{ maxHeight: "90vh" }}
    >
      <div className="max-w-6xl w-full mx-auto flex flex-col gap-8 border border-[#FCFCFC] rounded-3xl pb-4">
        <div className="flex justify-between items-center rounded-t-3xl bg-[rgba(252,252,252,0.40)] p-7 relative">
          <span className="flex items-center gap-4">
            <div className="relative flex items-center justify-center ml-1">
              <div className="absolute w-12 h-12 bg-[rgba(0,39,153,0.15)] rounded-2xl"></div>
              <div className="relative w-8 h-8 bg-[#082A66] rounded-xl flex items-center justify-center">
                <img src={brandIcon} className="w-4 h-4" />
              </div>
            </div>
            <span className="flex flex-col ml-2">
              <h4 className="text-[#082A66] font-bold text-xl">Products</h4>
              <p className="text-[#374151] ">
                Explore existing products or add new ones effortlessly
              </p>
            </span>
          </span>
          <img
            src={brandImage}
            alt="Brand Banner"
            className="absolute bottom-0 right-24 w-44 hidden lg:block"
          />
        </div>
        <div className="flex justify-end w-full px-5 gap-4">
          <div className="flex items-end justify-end bg-white rounded-xl mr-2">
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
          <div className="flex items-center justify-start  rounded-xl">
            <select
              value={selectedBrand}
              onChange={handleBrandChange}
              className="w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-3 pr-10 ring-1 ring-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="AllBrands">All Brands</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div
          className="flex flex-wrap justify-start pb-2 w-full gap-8 overflow-auto lg:px-10"
          style={{ maxHeight: "45vh" }}
        >
          <div className="border border-[#FCFCFC] bg-[rgba(252,252,252,0.70)] rounded-2xl m-1 flex items-center justify-center p-2 lg:w-80 lg:h-80 w-72 h-72 hover:bg-[rgba(252,252,252,0.10)]">
            <div
              onClick={handleCreateProduct}
              className="relative cursor-pointer bg-[rgba(252,252,252,0.25)] border border-[#FCFCFC] rounded-xl shadow-cyan-100 shadow-2xl p-4 w-full h-full flex flex-col items-center justify-center"
              style={{
                background:
                  "linear-gradient(to left bottom, rgba(92, 198, 255, 0.15), rgba(0, 160, 245, 0.3))",
              }}
            >
              <div className="bg-[#00A0F5] w-8 h-8 rounded-xl flex items-center justify-center">
                <FaPlus className="text-white w-6 h-6 flex justify-center text-xs" />
              </div>
              <p className="mt-4 text-lg text-[#00a7ff]">Create a Product</p>
              <p className="text-sm text-center mt-2">
                Click here to add a new product that you can use to generate
                assets.
              </p>
            </div>
          </div>
          {filteredProducts.map((product, index) => (
            <div
              key={index}
              className="group border border-[#FCFCFC] rounded-xl m-1 bg-[rgba(252,252,252,0.25)] p-3 lg:w-80 lg:h-80 md:w-80 md:h-80 w-72 h-72 flex flex-col items-center justify-between hover:transition-colors duration-200 glass-gradient-hover cursor-pointer"
              onClick={() =>
                navigate(`/productdetails?id=${encodeURIComponent(product.id)}`)
              }
            >
              {product.productImagesList?.map((item) => (
                <img
                  key={item.id}
                  src={item.imageURL}
                  alt={item.bucketName}
                  className="object-cover w-full h-48 rounded-lg"
                />
              ))}
              <div className="text-center flex justify-between w-full px-2 relative">
                <h3
                  className="text-xl font-bold text-[#082A66] group-hover:text-white overflow-hidden text-ellipsis whitespace-nowrap max-w-[15ch]"
                >
                  {product.name.length > 15 ? `${product.name.slice(0, 15)}...` : product.name}
                </h3>
                {product.name.length > 15 && (
                  <span className="tooltip absolute top-[-20px] left-0 bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 whitespace-normal z-10">
                    {product.name}
                  </span>
                )}
                {product.price > 0 && (
                <span className="font-semibold text-[#082A66] group-hover:text-white">
                  {product.price} {product.priceType}
                </span>
              )}

              </div>
              <div className="text-justify w-full px-2 line-clamp-3">
                <p className="text-sm text-[#374151] group-hover:text-white">
                  {product.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
