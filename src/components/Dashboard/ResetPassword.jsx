import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaArrowLeft } from "react-icons/fa";
import { MdMail } from "react-icons/md";
import logo from "../../assets/logo.png";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [timer, setTimer] = useState(30);
  const staticOtp = "1234"; // Static OTP for validation
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    let interval = null;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleSendOtp = () => {
    setOtpSent(true);
    setShowOtpInput(true);
    setTimer(30);
    toast.success("OTP sent successfully! (Use OTP: 1234)");
  };

  const handleResendOtp = () => {
    if (timer === 0) {
      setTimer(30);
      toast.info("OTP resent successfully! (Use OTP: 1234)");
    }
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp === staticOtp) {
      toast.success("OTP validated successfully!");
      setShowOtpInput(false);
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    toast.success("Password reset successfully!");
    navigate("/login"); // Redirect to login page after success
  };

  const handleChangeOtp = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < 3) document.getElementById(`otp-${index + 1}`).focus();
    } else if (value === "" && e.nativeEvent.inputType === "deleteContentBackward") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      if (index > 0) document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] px-4">
      <div className="flex flex-col items-center w-full max-w-md p-4">
        <img src={logo} alt="Logo" className="w-40 h-20 mb-6" />
        <div
          className="w-full p-8 rounded-xl shadow-2xl border border-white"
          style={{ background: "rgba(255,255,255,0.30)" }}
        >
          {!otpSent ? (
            <>
              <h2 className="text-3xl text-[#082A66] font-bold mb-4 text-center">
                Reset Password
              </h2>
              <p className="text-center text-md mb-4">
                An OTP will be sent to the email associated with your account.
              </p>
              <div className="flex items-center mb-4">
                <MdMail className="text-blue-600 text-xl mr-2" />
                <span className="text-blue-600 text-md font-medium">{username}</span>
              </div>
              <button
                onClick={handleSendOtp}
                className="w-full bg-[#082A66] text-white py-2 rounded-lg hover:bg-[#0056b3] transition-colors"
              >
                Send OTP
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setOtpSent(false)}
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
                {showOtpInput ? "Verify OTP" : "Reset Your Password"}
              </h2>
              {showOtpInput ? (
                <>
                  <div className="flex justify-center gap-3 mb-6">
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
                  <button
                    onClick={handleVerifyOtp}
                    className="w-full bg-[#082A66] text-white py-2 rounded-lg hover:bg-[#0056b3] transition-colors"
                  >
                    Verify OTP
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="password"
                    placeholder="Enter New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full mb-4 p-2 rounded-lg focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full mb-4 p-2 rounded-lg focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                  />
                  <button
                    onClick={handleResetPassword}
                    className="w-full bg-[#082A66] text-white py-2 rounded-lg hover:bg-[#0056b3] transition-colors"
                  >
                    Reset Password
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
