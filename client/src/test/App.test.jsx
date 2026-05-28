import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { describe, beforeEach, test, expect, vi } from "vitest";
import App from "../App";

// Test wrapper component
const TestWrapper = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ToastContainer />
    </QueryClientProvider>
  );
};

describe("VitalWork App", () => {
  beforeEach(() => {
    // Clear any previous mocks
    vi.clearAllMocks();
    // Reset window history to the root path to prevent routing state leakage between tests
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });

  test("renders landing page", () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    expect(screen.getAllByText(/VitalWork/i)[0]).toBeInTheDocument();
  });

  test("navigates to jobs page", async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    const jobsLink = screen.getAllByRole("link", { name: /find jobs/i })[0];
    fireEvent.click(jobsLink);

    await waitFor(() => {
      expect(screen.getByText(/Find Your Dream Job/i)).toBeInTheDocument();
    });
  });

  test("navigates to login page", async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    const loginLink = screen.getAllByRole("link", { name: /sign in/i })[0];
    fireEvent.click(loginLink);

    await waitFor(() => {
      expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
    });
  });

  test("navigates to registration page", async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    const registerLink = screen.getAllByRole("link", { name: /register/i })[0];
    fireEvent.click(registerLink);

    await waitFor(() => {
      expect(screen.getByText(/Create Your Account/i)).toBeInTheDocument();
    });
  });
});
