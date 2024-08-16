import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/logo.png";
import axios from "axios";
import { baseUrl } from "../utils/Constant";

const OTPVerification = ({
  onBack,
  submitData,
  userMobile,
  onOtpValidated,
}) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [resendEnabled, setResendEnabled] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    } else {
      setResendEnabled(true);
    }
  }, [timer]);

  const handleResendOtp = () => {
    setTimer(30);
    setResendEnabled(false);
    toast.info("OTP resent successfully");
  };

  const handleChangeOtp = (e, index) => {
    const value = e.target.value;

    if (/^\d$/.test(value)) {
      // Allow only digits
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Automatically move focus to the next input box
      if (index < 3) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    } else if (
      value === "" &&
      e.nativeEvent.inputType === "deleteContentBackward"
    ) {
      // Handle backspace and move focus to the previous input box
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);

      if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    }
  };

  const handlePasteOtp = (e) => {
    const paste = e.clipboardData.getData("text");
    const newOtp = paste.split("").slice(0, 4);
    setOtp(newOtp);

    // Focus on the last input field if all inputs are filled
    const lastFilledIndex = newOtp.length - 1;
    if (lastFilledIndex < 4) {
      document.getElementById(`otp-${lastFilledIndex}`).focus();
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join("");

    // Check if any OTP field is empty
    if (otp.includes("")) {
      toast.error("Please enter the complete OTP");
      return;
    }
    try {
      await axios
        .post(`${baseUrl}/user/validateOtp/${enteredOtp}`, submitData)
        .then(() => {
          toast.success("OTP validated successfully");
          setTimeout(() => {
            onOtpValidated(); // Notify parent component of OTP validation
          }, 1500);
        });
    } catch (error) {
      console.error(error);
      toast.error("Invalid OTP");
      //  setTimeout(() => {
      //       onOtpValidated(); // Notify parent component of OTP validation
      //     }, 1500);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] px-4">
      <ToastContainer position="top-center" />
      <div className="flex flex-col items-center w-full max-w-md p-4 mt-[-10vh]">
        <img src={logo} alt="Logo" className="w-40 h-20 mb-6" />
        <div
          className="w-full p-8 rounded-xl shadow-2xl border border-white"
          style={{ background: "rgba(255,255,255,0.30)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="text-blue-600 text-sm flex items-center"
            >
              <FaArrowLeft className="mr-1" /> Back
            </button>
            <button
              onClick={handleResendOtp}
              className={`text-blue-600 text-sm ${
                resendEnabled ? "" : "opacity-50"
              }`}
              disabled={!resendEnabled}
            >
              Resend OTP {timer > 0 ? `in ${timer} seconds` : ""}
            </button>
          </div>
          <div className="text-xl text-[#0A3580] mb-6 text-center font-medium">
            Verify Your Account
          </div>
          <div className="text-sm mb-4">
            We sent a verification code to {userMobile}.
            <br />
            Please check your mobile and enter the code below.
          </div>
          <div
            className="flex justify-center gap-3 mb-6"
            onPaste={handlePasteOtp}
          >
            {[...Array(4)].map((_, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={otp[index]}
                onChange={(e) => handleChangeOtp(e, index)}
                className="w-12 h-12 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ))}
          </div>
          <div className="flex justify-center items-center">
            <button
              className="custom-button px-8 py-2 text-white border-[#FCFCFC] rounded-lg shadow-2xl w-1/2"
              onClick={handleVerifyOtp}
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
