import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEyeSlash } from "react-icons/fa";
import { PiEyeLight } from "react-icons/pi";
import OTPVerification from "./OTP";
import logo from "../../assets/logo.png";
import axios from "axios";
import { baseUrl } from "../utils/Constant";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValidated, setOtpValidated] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(""); // State for email validation error
  const [mobile, setMobile] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const submitData = {
    name: username,
    email: email,
    phoneNumber: `${countryCode}-${mobile}`,
  };

  // Email validation function using regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate email in real-time as the user types
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!validateEmail(value)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const handleNextStep = async () => {
    if (!validateMobile(mobile)) {
      toast.error("Invalid mobile number");
      return;
    }
    
    // Ensure no email error exists before proceeding
    if (emailError) {
      toast.error("Please enter a valid email.");
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/user/register`, submitData);
      toast.success("Success");
      setOtpValidated(true); // Directly validate OTP to move to password screen
      setShowOtpModal(false);
      console.log(response.data);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to register user");
    }
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (!validatePassword(value)) {
      setPasswordError(
        "Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters."
      );
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (value !== password) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMobileChange = (e) => {
    const value = e.target.value;
    const maxLength = countryPhoneLengths[countryCode] || 10; // Default to 10 if not specified
    if (/^\d{0,13}$/.test(value)) {
      setMobile(value);
      if (value.length !== maxLength) {
        setMobileError(`Mobile number must be exactly ${maxLength} digits.`);
      } else {
        setMobileError("");
      }
    }
  };

  const validateMobile = (mobile) => {
    const maxLength = countryPhoneLengths[countryCode] || 10; // Default to 10 if not specified
    if (mobile.length !== maxLength) {
      setMobileError(`Mobile number must be exactly ${maxLength} digits.`);
      return false;
    }
    setMobileError("");
    return true;
  };

  const handleLoginNavigation = () => {
    navigate("/login");
  };

  const handleSignUp = async () => {
    if (
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      passwordError ||
      confirmPasswordError ||
      emailError // Ensure there is no email error
    ) {
      toast.error("Please fill all fields correctly before signing up.");
      return;
    }

    const data = {
      name: username,
      email: email,
      phoneNumber: `${countryCode}-${mobile}`,
      password: password,
    };

    try {
      const response = await axios.post(`${baseUrl}/user/setpassword`, data);
      toast.success("Sign Up successful!");
      const jwtToken = response.data.data.jwt;
      localStorage.setItem("jwtToken", jwtToken);
      window.location.href = "/homepage";
      console.log(response);
    } catch (error) {
      console.error(error);
      toast.error("Error creating signup");
    }
  };

  const countries = [
    { code: "+91", name: "India" },
    { code: "+1", name: "USA" },
    { code: "+44", name: "UK" },
    { code: "+61", name: "Australia" },
    { code: "+81", name: "Japan" },
    { code: "+49", name: "Germany" },
    { code: "+86", name: "China" },
    { code: "+33", name: "France" },
    { code: "+7", name: "Russia" },
    { code: "+55", name: "Brazil" },
    { code: "+84", name: "Vietnam" },
    { code: "+66", name: "Thailand" },
    { code: "+27", name: "South Africa" },
    { code: "+34", name: "Spain" },
    { code: "+234", name: "Nigeria" },
    { code: "+65", name: "Singapore" },
    { code: "+60", name: "Malaysia" },
    { code: "+94", name: "Sri Lanka" },
    // Add more countries as needed
  ].sort((a, b) => a.name.localeCompare(b.name)); // Sort countries alphabetically by name

  const countryPhoneLengths = {
    "+91": 10, // India
    "+1": 10, // USA, Canada
    "+44": 10, // UK
    "+86": 13, // China
    "+258": 12, // Mozambique
    "+55": 12, // Brazil
    "+84": 9, // Vietnam
    "+66": 9, // Thailand
    "+27": 9, // South Africa
    "+34": 9, // Spain
    "+234": 10, // Nigeria
    "+65": 8, // Singapore
    "+60": 7, // Malaysia
    "+94": 7, // Sri Lanka
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] px-4">
      <div className="flex flex-col items-center w-full max-w-md p-4 pt-0">
        <img src={logo} alt="Logo" className="w-40 h-22 mb-3" />
        <div
          className={`w-full p-8 pt-4 rounded-xl shadow-md border border-white ${
            otpValidated ? "pt-6 pb-12 max-w-sm " : ""
          }`}
          style={{ background: "rgba(255,255,255,0.30)" }}
        >
          <h2 className="text-3xl text-[#082A66] font-bold pt-0 text-center mb-1">
            Sign Up
          </h2>
          <p
            className={`text-center text-md text-[#0A3580] mb-6 ${
              otpValidated ? "pb-3 " : ""
            }`}
          >
            Join the future of marketing.
          </p>
          <div className="flex flex-col gap-4">
            {!otpValidated && (
              <>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 rounded-lg focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={handleEmailChange} // Validate email on change
                  className="w-full p-2 rounded-lg focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                />
                {emailError && (
                  <p className="text-red-500 text-sm">{emailError}</p>
                )}
                <div className="flex items-center gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="p-2 rounded-lg focus:ring-2 focus-within:ring-blue-400 focus:outline-none overflow-auto"
                    style={{ maxHeight: "60px" }}
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.code} ({country.name})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Mobile Number"
                    value={mobile}
                    onChange={handleMobileChange}
                    className="w-full p-2 rounded-lg focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                  />
                </div>
                {mobileError && (
                  <p className="text-red-500 text-sm">{mobileError}</p>
                )}
                <div className="flex justify-start items-start w-full">
                  <button
                    onClick={handleNextStep}
                    className={`custom-button mt-4 text-white py-2 w-full rounded-md shadow-lg ${
                      (!mobile || mobileError || emailError) &&
                      "cursor-not-allowed opacity-50"
                    }`}
                    disabled={!mobile || mobileError || emailError}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
            {otpValidated && (
              <>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full p-2 rounded-lg focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                  />
                  <span
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
                    onClick={toggleShowPassword}
                  >
                    {showPassword ? <FaEyeSlash /> : <PiEyeLight />}
                  </span>
                </div>
                {passwordError && (
                  <p className="text-red-500 text-sm">{passwordError}</p>
                )}
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className="w-full p-2 rounded-lg focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                  />
                  <span
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
                    onClick={toggleShowConfirmPassword}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <PiEyeLight />}
                  </span>
                </div>
                {confirmPasswordError && (
                  <p className="text-red-500 text-sm">{confirmPasswordError}</p>
                )}
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center mt-6">
          <button
            className="custom-button text-white py-2 px-6 rounded-md shadow-lg"
            onClick={handleSignUp}
            disabled={!otpValidated}
          >
            Sign Up
          </button>
          <p className="mt-4 text-black-900 text-center">
            <span className="text-[#082A66] font-bold">
              Already have an account?
            </span>{" "}
            <button onClick={handleLoginNavigation} className="text-blue-600">
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
