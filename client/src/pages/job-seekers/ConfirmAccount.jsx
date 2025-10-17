// ConfirmAccount.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import Wrapper from "../../assets/wrappers/RegisterAndLoginPage";

const ConfirmAccount = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("token");
  const devOtp = searchParams.get("otp"); // Only present in dev

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  // 👇 Auto-fill OTP in development
  useEffect(() => {
    if (
      import.meta.env.NODE_ENV === "development" &&
      devOtp &&
      devOtp.length === 6
    ) {
      const otpArray = devOtp.split("");
      setOtp(otpArray);

      // Optional: auto-submit after 1.5s in dev
      const timer = setTimeout(() => {
        handleVerify(new Event("auto"));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [devOtp]);

  const handleVerify = async (e) => {
    if (e.preventDefault) e.preventDefault(); // Handle real submit

    const otpString = otp.join("");
    if (otpString.length !== 6 || !/^\d{6}$/.test(otpString)) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      await customFetch.post("/jobseekers/confirm-email", {
        userId: userId,
        otp: otpString,
      });

      toast.success("Account confirmed successfully!");
      navigate("/job-seekers/login");
    } catch (error) {
      const message = error?.response?.data?.message || "Invalid OTP";
      toast.error(message);
    }
  };

  const handleResend = async () => {
    try {
      const { data } = await customFetch.post("/jobseekers/resend-otp", {
        userId: userId,
      });
      toast.success(data?.message || "OTP resent successfully!");

      // In development, auto-fill returned OTP and auto-submit for convenience
      if (import.meta.env.NODE_ENV === "development" && data?.devOtp) {
        setOtp(data.devOtp.split(""));
        setTimeout(() => {
          handleVerify(new Event("auto"));
        }, 1000);
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to resend OTP";
      toast.error(message);
    }
  };

  // ... (rest of input handling logic remains the same)
  const handleInputChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <Wrapper>
      <div className="form" style={{ maxWidth: "450px", width: "100%", textAlign: "center" }}>
        <div
          style={{
            width: "60px",
            height: "60px",
            backgroundColor: "#5AC8C8",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
          }}
        >
          <span style={{ fontSize: "24px", color: "white" }}>📧</span>
        </div>

        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#1A2B3C",
            marginBottom: "0.5rem",
          }}
        >
          Confirm Your Account
        </h1>
        <p style={{ color: "#6C7A89", marginBottom: "2rem", fontSize: "1rem" }}>
          Enter the 6-digit code sent to your email
        </p>

        <form onSubmit={handleVerify}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "2rem",
            }}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength={1}
                style={{
                  width: "50px",
                  height: "50px",
                  textAlign: "center",
                  fontSize: "1.5rem",
                  border: "2px solid #D1E0E8",
                  borderRadius: "8px",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#5AC8C8")}
                onBlur={(e) => (e.target.style.borderColor = "#D1E0E8")}
              />
            ))}
          </div>

          <button type="submit" className="btn btn-block">
            Verify OTP
          </button>
        </form>

        <p
          style={{ marginTop: "1.5rem", color: "#6C7A89", fontSize: "0.9rem" }}
        >
          Didn&apos;t receive the code?{" "}
          <button
            onClick={handleResend}
            style={{
              color: "#5AC8C8",
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            Resend OTP
          </button>
        </p>
      </div>
    </Wrapper>
  );
};

export default ConfirmAccount;
