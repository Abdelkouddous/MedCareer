import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser } from "react-icons/fi";

function LoginJobSeeker() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
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
      const res = await customFetch.post("/jobseekers/login", form);
      const { token } = res.data || {};
      if (token) localStorage.setItem("jobseeker_token", token);
      toast.success("Welcome back! Login successful");
      navigate("/job-seekers/jobs");
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4"
      style={{
        background: `linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%)`,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div className="form">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{
              background: "var(--primary-500)",
              color: "var(--white)",
            }}
          >
            <FiUser size={24} />
          </div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: "var(--text-color)" }}
          >
            Welcome Back
          </h1>
          <p style={{ color: "var(--text-secondary-color)" }}>
            Sign in to your job seeker account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-6">
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
                placeholder="Enter your password"
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
                Signing In...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <p style={{ color: "var(--text-secondary-color)" }}>
            Don't have an account?{" "}
            <Link
              to="/job-seekers/register"
              className="font-semibold hover:underline"
              style={{
                color: "var(--primary-500)",
                transition: "var(--transition)",
              }}
            >
              Create Account
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
    </div>
  );
}

export default LoginJobSeeker;
