import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Wrapper from "../../assets/wrappers/RegisterAndLoginPage";
import customFetch from "../../utils/customFetch";
import { FiMail, FiLock, FiKey, FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";

const ForgotPassword = () => {
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
      await customFetch.post("/auth/forgot-password", { email });
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
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await customFetch.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      toast.success("Password reset successful! Please log in.");
      navigate("/login");
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
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium hover:underline text-[var(--text-secondary-color)] transition-colors">
            <FiArrowLeft size={18} /> Back to Login
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 text-[var(--text-color)]">Forgot Password</h1>
        <p className="text-center text-[var(--text-secondary-color)] mb-8">
          {step === 1 
            ? "Enter your email to receive a password reset code" 
            : "Enter the OTP code sent to your email and your new password"}
        </p>

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--text-color)] mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  placeholder="your_email@example.com"
                  className="w-full px-4 py-3 pl-10 rounded-lg border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary-color)]" size={18} />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 font-medium py-3 px-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-[var(--text-color)] mb-1">
                OTP Verification Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="otp"
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-3 pl-10 rounded-lg border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <FiKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary-color)]" size={18} />
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-[var(--text-color)] mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  placeholder="Minimum 8 characters"
                  className="w-full px-4 py-3 pl-10 pr-12 rounded-lg border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary-color)]" size={18} />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-secondary-color)]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--text-color)] mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-3 pl-10 pr-12 rounded-lg border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary-color)]" size={18} />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 font-medium py-3 px-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              disabled={loading}
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </Wrapper>
  );
};

export default ForgotPassword;
