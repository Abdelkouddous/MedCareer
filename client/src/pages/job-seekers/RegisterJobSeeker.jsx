import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import {
  FiEye,
  FiEyeOff,
  FiMail,
  FiLock,
  FiUser,
  FiMapPin,
  FiPhone,
  FiUserPlus,
} from "react-icons/fi";
import Wrapper from "../../assets/wrappers/RegisterAndLoginPage";

function RegisterJobSeeker() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    location: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "First name is required";
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (form.phoneNumber && !/^\+?[\d\s\-()]+$/.test(form.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      // In your Register.jsx after successful registration
      const response = await customFetch.post("/jobseekers/register", form);

      // Redirect to confirm page (public route)
      let url = `/job-seekers/confirm-account?token=${response.data.userId}`;

      // 👇 Auto-fill OTP in dev
      if (import.meta.env.NODE_ENV === "development" && response.data.devOtp) {
        url += `&otp=${response.data.devOtp}`;
        toast.success(`Dev OTP: ${response.data.devOtp}`);
      } else {
        toast.success("Account created successfully! Please confirm your email!");
      }

      navigate(url);
      // navigate("/job-seekers/login");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <div className="form" style={{ maxWidth: "600px", width: "100%" }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{
              background: "var(--primary-500)",
              color: "var(--white)",
            }}
          >
            <FiUserPlus size={24} />
          </div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: "var(--text-color)" }}
          >
            Create Your Account
          </h1>
          <p style={{ color: "var(--text-secondary-color)" }}>
            Join our platform and discover amazing job opportunities
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Name Fields Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="form-row">
              <label className="form-label" htmlFor="name">
                <FiUser className="inline mr-2" />
                First Name
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter first name"
                  value={form.name}
                  onChange={onChange}
                  className={`form-input ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  style={{
                    paddingLeft: "2.5rem",
                    borderColor: errors.name
                      ? "var(--red-dark)"
                      : "var(--grey-300)",
                  }}
                  required
                />
                <FiUser
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: "var(--grey-400)" }}
                  size={18}
                />
              </div>
              {errors.name && (
                <div className="form-alert mt-1">{errors.name}</div>
              )}
            </div>

            {/* Last Name */}
            <div className="form-row">
              <label className="form-label" htmlFor="lastName">
                <FiUser className="inline mr-2" />
                Last Name
              </label>
              <div className="relative">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Enter last name"
                  value={form.lastName}
                  onChange={onChange}
                  className={`form-input ${
                    errors.lastName ? "border-red-500" : ""
                  }`}
                  style={{
                    paddingLeft: "2.5rem",
                    borderColor: errors.lastName
                      ? "var(--red-dark)"
                      : "var(--grey-300)",
                  }}
                  required
                />
                <FiUser
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: "var(--grey-400)" }}
                  size={18}
                />
              </div>
              {errors.lastName && (
                <div className="form-alert mt-1">{errors.lastName}</div>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div className="form-row">
            <label className="form-label" htmlFor="email">
              <FiMail className="inline mr-2" />
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={onChange}
                className={`form-input ${errors.email ? "border-red-500" : ""}`}
                style={{
                  paddingLeft: "2.5rem",
                  borderColor: errors.email
                    ? "var(--red-dark)"
                    : "var(--grey-300)",
                }}
                required
              />
              <FiMail
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: "var(--grey-400)" }}
                size={18}
              />
            </div>
            {errors.email && (
              <div className="form-alert mt-1">{errors.email}</div>
            )}
          </div>

          {/* Password Field */}
          <div className="form-row">
            <label className="form-label" htmlFor="password">
              <FiLock className="inline mr-2" />
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={form.password}
                onChange={onChange}
                className={`form-input ${
                  errors.password ? "border-red-500" : ""
                }`}
                style={{
                  paddingLeft: "2.5rem",
                  paddingRight: "2.5rem",
                  borderColor: errors.password
                    ? "var(--red-dark)"
                    : "var(--grey-300)",
                }}
                required
              />
              <FiLock
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: "var(--grey-400)" }}
                size={18}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--grey-400)",
                  cursor: "pointer",
                }}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {errors.password && (
              <div className="form-alert mt-1">{errors.password}</div>
            )}
          </div>

          {/* Location and Phone Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location */}
            <div className="form-row">
              <label className="form-label" htmlFor="location">
                <FiMapPin className="inline mr-2" />
                Location
              </label>
              <div className="relative">
                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="City, Country"
                  value={form.location}
                  onChange={onChange}
                  className="form-input"
                  style={{ paddingLeft: "2.5rem" }}
                />
                <FiMapPin
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: "var(--grey-400)" }}
                  size={18}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="form-row">
              <label className="form-label" htmlFor="phoneNumber">
                <FiPhone className="inline mr-2" />
                Phone Number
              </label>
              <div className="relative">
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={form.phoneNumber}
                  onChange={onChange}
                  className={`form-input ${
                    errors.phoneNumber ? "border-red-500" : ""
                  }`}
                  style={{
                    paddingLeft: "2.5rem",
                    borderColor: errors.phoneNumber
                      ? "var(--red-dark)"
                      : "var(--grey-300)",
                  }}
                />
                <FiPhone
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: "var(--grey-400)" }}
                  size={18}
                />
              </div>
              {errors.phoneNumber && (
                <div className="form-alert mt-1">{errors.phoneNumber}</div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-block"
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              fontWeight: "600",
              marginTop: "2rem",
            }}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div
                  className="loading mr-2"
                  style={{ width: "1rem", height: "1rem" }}
                ></div>
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <p style={{ color: "var(--text-secondary-color)" }}>
            Already have an account?{" "}
            <Link
              to="/job-seekers/login"
              className="font-semibold hover:underline"
              style={{
                color: "var(--primary-500)",
                transition: "var(--transition)",
              }}
            >
              Sign In
            </Link>
          </p>
        </div>

        {/* Additional Links */}
        <div className="text-center mt-4">
          <Link
            to="/"
            className="text-sm hover:underline"
            style={{
              color: "var(--text-secondary-color)",
              transition: "var(--transition)",
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </Wrapper>
  );
}

export default RegisterJobSeeker;
