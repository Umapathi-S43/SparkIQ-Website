import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { PiEyeLight } from "react-icons/pi";
import axios from "axios";
import toast from "react-hot-toast";
import logo from "../../assets/logo.png";
import { baseUrl } from "../utils/Constant";

const SignUpPage = () => {
  const navigate = useNavigate();

  // FORM FIELDS
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ERROR STATES
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // SHOW/HIDE PASSWORD
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP STATES
  const [otpValidated, setOtpValidated] = useState(false); // Step 3 visible only if true
  const [otpSent, setOtpSent] = useState(false);           // Step 2 visible if true and otpValidated is false
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(0);

  // LOADING STATE
  const [isLoading, setIsLoading] = useState(false);

  // DYNAMIC COUNTRY PHONE LENGTHS
  const countryPhoneLengths = {
    "+91": 10,
    "+1": 10,
    "+44": 10,
    "+86": 13,
    "+258": 12,
    "+55": 12,
    "+84": 9,
    "+66": 9,
    "+27": 9,
    "+34": 9,
    "+234": 10,
    "+65": 8,
    "+60": 7,
    "+94": 7,
  };

  // COUNTRY SELECT OPTIONS
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
  ].sort((a, b) => a.name.localeCompare(b.name));

  // SUBMIT DATA (used for /user/register and /user/send)
  const submitData = {
    name: username.trim().toLowerCase(),
    email: email.trim().toLowerCase(),
    phoneNumber: `${countryCode}-${mobile}`,
  };
  // --------------------
  //  Email Validation
  // --------------------
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!validateEmail(value)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  // --------------------
  //  Mobile Validation
  // --------------------
  const handleMobileChange = (e) => {
    const value = e.target.value;
    // Only allow up to 13 digits
    if (/^\d{0,13}$/.test(value)) {
      setMobile(value);
      const maxLength = countryPhoneLengths[countryCode] || 10;
      if (value.length !== 0 && value.length !== maxLength) {
        setMobileError(`Mobile number must be exactly ${maxLength} digits.`);
      } else {
        setMobileError("");
      }
    }
  };

  const validateMobile = () => {
    const maxLength = countryPhoneLengths[countryCode] || 10;
    if (mobile.length !== maxLength) {
      setMobileError(`Mobile number must be exactly ${maxLength} digits.`);
      return false;
    }
    setMobileError("");
    return true;
  };

  // --------------------
  //  Password Validation
  // --------------------
  const validatePassword = (val) => {
    // 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(val);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (!validatePassword(value)) {
      setPasswordError("Password must be at least 8 chars with upper, lower, number & special char.");
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

  // --------------------
  //  Toggle Password Visibility
  // --------------------
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  // --------------------
  //  Step 1: Register & Send OTP
  // --------------------
  const handleNextStep = async () => {
    if (!validateMobile()) {
      toast.error("Invalid mobile number");
      return;
    }
    if (emailError) {
      toast.error("Please enter a valid email");
      return;
    }
    if (!username) {
      toast.error("Please enter a username");
      return;
    }

    setIsLoading(true);
    try {
      // 1) Register user
      const response = await axios.post(`${baseUrl}/user/register`, submitData);
      if (response.data.message === "User created successfully") {
        //toast.success("User registered. Sending OTP...");
        // 2) Send OTP
        await handleSendOtp();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to register user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    try {
      await axios.post(`${baseUrl}/user/send`, submitData);
      toast.success("OTP sent successfully");
      setOtpSent(true);
      setTimer(30); // Start 60s timer
    } catch (error) {
      console.error(error);
      toast.error("Failed to send OTP");
    }
  };

  // --------------------
  //  Step 2: OTP Verification
  // --------------------
  const handleResendOtp = async () => {
    if (timer === 0) {
      await handleSendOtp();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 4) {
      toast.error("Please enter the complete 4-digit OTP.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/user/validateOtp/${otpString}`, submitData);
      if (response.data.message === "OTP validated successfully") {
        toast.success("OTP validated successfully");
        setOtpValidated(true); // Proceed to Step 3
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // OTP box changes
  const handleChangeOtp = (e, index) => {
    const { value } = e.target;
    if (/^\d?$/.test(value)) { // Accept only single-digit values
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
  
      // Move focus to the next input if not the last index
      if (value !== "" && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };
  
  const handleKeyDownOtp = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "") {
      // Move focus to the previous input on backspace if it's not the first input
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    }
  };
  

  // Countdown effect for resending OTP
  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  // --------------------
  //  Step 3: Set Password & Final Sign Up
  // --------------------
  const handleSignUp = async () => {
    if (!password || !confirmPassword || passwordError || confirmPasswordError) {
      toast.error("Please fill password fields correctly.");
      return;
    }
    if (!otpValidated) {
      toast.error("Please verify OTP before signing up.");
      return;
    }

    setIsLoading(true);
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
    } catch (error) {
      console.error(error);
      toast.error("Error creating signup");
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to Login
  const handleLoginNavigation = () => {
    navigate("/login");
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

      {/* Main Layout */}
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] px-4">
        <div className="flex flex-col items-center w-full max-w-md p-4">
          <img src={logo} alt="Logo" className="w-40 h-20 mb-6" />
          <div
            className="w-full p-8 rounded-xl shadow-2xl border border-white"
            style={{ background: "rgba(255,255,255,0.30)" }}
          >
            {/* STEP 1: Collect Basic Info */}
            {!otpSent && !otpValidated && (
              <>
                <h2 className="text-3xl text-[#082A66] font-bold pt-0 text-center mb-1">
                  Sign Up
                </h2>
                <p className={`text-center text-md text-[#0A3580] mb-6 ${otpValidated ? "pb-3" : ""}`}>
                  Join the future of marketing.
                </p>
                <div className="flex flex-col gap-4">
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
                    onChange={handleEmailChange}
                    className="w-full p-2 rounded-lg focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                  />
                  {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
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
                  {mobileError && <p className="text-red-500 text-sm">{mobileError}</p>}
                  <div className="flex justify-start items-start w-full">
                    <button
                      onClick={handleNextStep}
                      className={`custom-button mt-4 text-white py-2 w-full rounded-md shadow-lg ${(!mobile || mobileError || emailError || isLoading) && "cursor-not-allowed opacity-50"}`}
                      disabled={!mobile || mobileError || emailError || isLoading}
                    >
                      Register
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* STEP 2: OTP Verification */}
            {otpSent && !otpValidated && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => {
                      // Go back to Step 1
                      setOtpSent(false);
                      setTimer(0);
                      setOtp(["", "", "", ""]);
                    }}
                    className="text-blue-600 text-sm flex items-center"
                  >
                    <FaArrowLeft className="mr-1" /> Back
                  </button>
                  <button
                    onClick={handleResendOtp}
                    className={`text-blue-600 text-sm ${timer > 0 ? "opacity-50" : ""}`}
                    disabled={timer > 0}
                  >
                    Resend OTP {timer > 0 ? `in ${timer}s` : ""}
                  </button>
                </div>
                <h2 className="text-2xl text-[#082A66] font-bold mb-4 text-center">
                  Verify OTP
                </h2>
                <div className="flex justify-center gap-3 mb-6">
                  {[...Array(4)].map((_, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={otp[index]}
                      onChange={(e) => handleChangeOtp(e, index)}
                      onKeyDown={(e) => handleKeyDownOtp(e, index)}                      
                      className="w-12 h-12 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  ))}
                </div>
                <button
                  onClick={handleVerifyOtp}
                  className="w-full bg-[#082A66] text-white py-2 rounded-lg hover:bg-[#0056b3] transition-colors"
                  disabled={isLoading}
                >
                  Verify OTP
                </button>
                <span className="block text-center text-md mt-4 text-gray-600">
                  OTP has been sent to <strong>{email}</strong>.
                </span>
              </>
            )}

            {/* STEP 3: Create/Set Password */}
            {otpValidated && (
              <>
                <h2 className="text-2xl text-[#082A66] font-bold mb-4 text-center">
                  Set Your Password
                </h2>
                <div className="relative mb-4">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full p-2 rounded-lg focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                  />
                  <span
                    onClick={toggleShowPassword}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <PiEyeLight />}
                  </span>
                </div>
                {passwordError && <p className="text-red-500 text-sm mb-4">{passwordError}</p>}
                <div className="relative mb-4">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className="w-full p-2 rounded-lg focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                  />
                  <span
                    onClick={toggleShowConfirmPassword}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <PiEyeLight />}
                  </span>
                </div>
                {confirmPasswordError && <p className="text-red-500 text-sm mb-4">{confirmPasswordError}</p>}
                <button
                  onClick={handleSignUp}
                  className="w-full bg-[#082A66] text-white py-2 rounded-lg hover:bg-[#0056b3] transition-colors"
                  disabled={isLoading}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
          <div className="flex flex-col items-center mt-6">
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

      {/* Full Screen Loader Overlay */}
      {isLoading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
    </>
  );
};

export default SignUpPage;
