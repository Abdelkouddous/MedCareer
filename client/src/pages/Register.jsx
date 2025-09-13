import React from "react";
import {
  Form,
  redirect,
  useNavigate,
  Link,
  useNavigation,
} from "react-router-dom";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import Logo from "./components/Logo";
import FormRow from "./components/FormRow";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    await customFetch.post("/auth/register", data);
    toast.success("Registration successful! Please log in.");
    return redirect("/login");
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const Register = () => {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <Wrapper>
      <Form
        method="post"
        className="form max-w-md w-full mx-auto px-8 py-10 rounded-lg shadow-lg"
      >
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleBackToHome}
            className="inline-flex items-center gap-2 text-sm font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300"
          >
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
            Back to Home
          </button>
          <div className="h-14 w-auto">
            <Logo />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-8">
          Create Your Account
        </h1>

        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormRow
              type="text"
              name="name"
              labelText="First Name"
              placeholder="John"
              required
            />
            <FormRow
              type="text"
              name="lastName"
              labelText="Last Name"
              placeholder="Doe"
              required
            />
          </div>

          <FormRow
            type="text"
            name="location"
            placeholder="City, Country"
            required
          />

          <FormRow
            type="email"
            name="email"
            labelText="Email Address"
            placeholder="your.email@example.com"
            required
          />

          <FormRow
            type="password"
            name="password"
            placeholder="Minimum 8 characters"
            required
          />

          <FormRow
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            required
          />

          <button
            type="submit"
            className="btn btn-block py-3 mt-6 text-base font-medium rounded-md shadow-md transition-all duration-300 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
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
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>

          <div className="text-center mt-8 border-t pt-6">
            <p className="text-sm mb-3">Already have an account?</p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium  border rounded-md  transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </Form>
    </Wrapper>
  );
};

export default Register;
