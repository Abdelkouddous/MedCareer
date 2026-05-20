import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Wrapper from "../../assets/wrappers/RegisterAndLoginPage";
import customFetch from "../../utils/customFetch";
import { FiMail, FiLock, FiKey, FiArrowLeft, FiUser, FiEye, FiEyeOff } from "react-icons/fi";

const ForgotPasswordJobSeeker = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1 = Request OTP, 2 = Verify OTP & Reset
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    setLoading(true);
    try {
      await customFetch.post("/jobseekers/forgot-password", { email });
      toast.success("Password reset OTP sent to your email!");
      setStep(2);
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to send reset OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await customFetch.post("/jobseekers/reset-password", {
        email,
        otp,
        newPassword,
      });
      toast.success("Password reset successful! Please log in.");
      navigate("/job-seekers/login");
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <div className="form max-w-md w-full mx-auto px-8 py-10 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <Link to="/job-seekers/login" className="inline-flex items-center gap-2 text-sm font-medium hover:underline text-[var(--text-secondary-color)] transition-colors">
            <FiArrowLeft size={18} /> Back to Login
          </Link>
        </div>

        {/* Header Icon */}
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{
              background: "var(--primary-500)",
              color: "var(--white)",
            }}
          >
            <FiUser size={24} />
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-color)] mb-2">Reset Password</h1>
          <p className="text-sm text-[var(--text-secondary-color)]">
            {step === 1 
              ? "Enter your email to receive a password reset code" 
              : "Enter the OTP code sent to your email and your new password"}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-6">
            <div className="form-row">
              <label htmlFor="email" className="form-label flex items-center gap-2">
                <FiMail size={16} /> Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="form-input"
                  style={{ paddingLeft: "2.5rem" }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: "var(--grey-400)" }} size={18} />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-block"
              style={{
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                fontWeight: "600",
                marginTop: "2rem",
              }}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="loading mr-2" style={{ width: "1rem", height: "1rem" }}></div>
                  Sending OTP...
                </div>
              ) : (
                "Send OTP"
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="form-row">
              <label htmlFor="otp" className="form-label flex items-center gap-2">
                <FiKey size={16} /> OTP Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="otp"
                  placeholder="Enter 6-digit OTP"
                  className="form-input"
                  style={{ paddingLeft: "2.5rem" }}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <FiKey className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: "var(--grey-400)" }} size={18} />
              </div>
            </div>

            <div className="form-row">
              <label htmlFor="newPassword" className="form-label flex items-center gap-2">
                <FiLock size={16} /> New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  placeholder="Enter new password"
                  className="form-input"
                  style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: "var(--grey-400)" }} size={18} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary-color)]"
                  style={{ background: "transparent", border: "none", cursor: "pointer" }}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-row">
              <label htmlFor="confirmPassword" className="form-label flex items-center gap-2">
                <FiLock size={16} /> Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirm new password"
                  className="form-input"
                  style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: "var(--grey-400)" }} size={18} />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-block"
              style={{
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                fontWeight: "600",
                marginTop: "2rem",
              }}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="loading mr-2" style={{ width: "1rem", height: "1rem" }}></div>
                  Resetting Password...
                </div>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}
      </div>
    </Wrapper>
  );
};

export default ForgotPasswordJobSeeker;
