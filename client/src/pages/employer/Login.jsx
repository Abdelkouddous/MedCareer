import React from "react";
import {
  Form,
  Link,
  redirect,
  useNavigation,
  useActionData,
  useNavigate,
} from "react-router-dom";
import Wrapper from "../../assets/wrappers/RegisterAndLoginPage";

import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch";
import { FiEye, FiEyeOff } from "react-icons/fi";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  if (!data.email || !data.password) {
    toast.error("Please provide all values.");
    return { msg: "Please provide all values." };
  }
  if (data.password.length < 8) {
    toast.error("Password must be 8 characters long");
    return { msg: "Password must be 8 characters long" };
  }

  try {
    const response = await customFetch.post("/auth/login", data);
    if (response.status === 200) {
      toast.success("Successfuly logged in !");
      return redirect("/dashboard");
    }
  } catch (error) {
    return {
      msg: error?.response?.data?.msg || "An error occurred during login.",
    };
  }
};

const Login = () => {
  const errors = useActionData();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === "submitting";
  const [showPassword, setShowPassword] = React.useState(false);
  const [isGuestLoading, setIsGuestLoading] = React.useState(false);

  const handleGuestLogin = async () => {
    setIsGuestLoading(true);
    try {
      const response = await customFetch.get("/auth/guest");
      if (response.status === 200) {
        toast.success("Logged in as guest!");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Guest login failed");
    } finally {
      setIsGuestLoading(false);
    }
  };

  return (
    <Wrapper>
      <Form
        method="post"
        className="form max-w-md w-full mx-auto px-8 py-10 rounded-xl"
      >
        <div className="flex justify-between items-center mb-6">
          <button className="inline-flex items-center gap-2 text-sm font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300">
            <Link to="/" className="flex items-center  transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </button>
          {/* <Logo /> */}
          {/* <div className="h-14 w-auto">
            <Logo />
          </div> */}
        </div>

        <h1 className="text-3xl font-bold text-center mb-6">Welcome Back</h1>

        <p className="text-center  mb-8">Sign in to continue to your account</p>

        {errors?.msg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {errors.msg}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="your_email@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium  mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all pr-12"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center "
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end mt-1">
            <Link
              to="/forgot-password"
              className="text-sm text-primary-600 hover:text-primary-800 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 font-medium py-3 px-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 "
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="relative flex items-center justify-center mt-4">
            <div className="border-t border-gray-200 w-full"></div>
            <div className="bg-white px-3 text-sm text-gray-500">or</div>
            <div className="border-t border-gray-200 w-full"></div>
          </div>

          <button
            type="button"
            onClick={handleGuestLogin}
            className="w-full bg-gray-100 text-gray-800 font-medium py-3 px-4 rounded-lg shadow-sm transition-all duration-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isGuestLoading}
          >
            {isGuestLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading...
              </span>
            ) : (
              "Login as Guest"
            )}
          </button>

          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm ">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-primary-600 hover:text-primary-800 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </Form>
    </Wrapper>
  );
};

export default Login;
