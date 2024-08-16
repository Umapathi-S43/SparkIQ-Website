import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEyeSlash } from "react-icons/fa";
import { PiEyeLight } from "react-icons/pi";
import logo from "../../assets/logo.png";
import googleLogo from "../../assets/dashboard_img/glogosvg.svg";
import metaLogo from "../../assets/dashboard_img/metasvg.svg";
import axios from "axios";
import { baseUrl } from "../utils/Constant";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(`${baseUrl}/user/login`, data);
      const jwtToken = response.data.data.jwt;

      localStorage.setItem("jwtToken", jwtToken);

      toast.success("Login successful!");
      navigate("/");
      console.log("JWT Token saved:", jwtToken);
    } catch (error) {
      console.error(error);
      toast.error("Login failed!");
    }
  };

  const handleSignUpNavigation = () => {
    navigate("/signup"); // Navigate to the signup page
  };

  return (
    <div className="flex items-center justify-end min-h-screen bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] px-4 lg:pr-40">
      <div className="flex flex-col items-center w-full max-w-md p-4">
        <img src={logo} alt="Logo" className="w-40 h-20 mb-6" />
        <form onSubmit={handleSubmit} className="w-full">
          <div
            className="w-full p-8 rounded-3xl shadow-md border border-white"
            style={{ background: "rgba(255,255,255,0.30)" }}
          >
            <h2 className="text-3xl text-[#082A66] font-bold mb-2 text-center">
              Login
            </h2>
            <p className="text-xl text-[#0A3580] mb-6 text-center font-medium">
              to the future of marketing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <button
                type="button"
                className="w-full sm:w-1/2 py-2 bg-white text-[#082A66] font-bold rounded-lg flex items-center justify-center shadow-sm focus-within:ring-blue-400 focus:outline-none"
              >
                <div className="flex items-center">
                  <span className="pl-2">Login with Google</span>
                  <img
                    src={googleLogo}
                    alt="Google"
                    className="w-3 h-3 ml-1 mr-1 "
                    style={{
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                </div>
              </button>
              <button
                type="button"
                className="w-full sm:w-1/2 py-2 bg-white text-[#082A66] font-bold rounded-lg flex items-center justify-center shadow-sm focus-within:ring-blue-400 focus:outline-none"
              >
                <div className="flex items-center">
                  <span>Login with Meta</span>
                  <img
                    src={metaLogo}
                    alt="Meta"
                    className="w-3 h-3 ml-2"
                    style={{
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                </div>
              </button>
            </div>
            <div className="w-full flex justify-center my-4">
              <div className="flex items-center w-2/3">
                <div className="border-t border-gray-400 flex-grow mr-2"></div>
                <span className="px-2 text-gray-500">or</span>
                <div className="border-t border-gray-400 flex-grow ml-2"></div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="umapathi@gmail.com"
                value={email}
                onChange={handleEmailChange}
                required
                className="w-full p-2 rounded-lg focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password#000"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  className="w-full p-2 rounded-lg focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                />
                <span
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? <FaEyeSlash /> : <PiEyeLight />}
                </span>
              </div>
              <p className="text-blue-600 text-center cursor-pointer">
                Forgot password?
              </p>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="custom-button p-2 pl-6 pr-6 text-white  border-[#FCFCFC] rounded-lg shadow-2xl flex justify-center w-fit"
            >
              Login
            </button>
          </div>
        </form>
        {errorMessage && (
          <p className="mt-4 text-red-500 text-center">{errorMessage}</p>
        )}
        <p className="mt-4 text-black-900 text-center">
          <span className="text-[#082A66] font-bold">
            Don’t have an account?
          </span>{" "}
          <button onClick={handleSignUpNavigation} className="text-blue-600">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
