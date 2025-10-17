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
      <BrowserRouter>
        {children}
        <ToastContainer />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe("MedCareer App", () => {
  beforeEach(() => {
    // Clear any previous mocks
    vi.clearAllMocks();
  });

  test("renders landing page", () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    expect(screen.getByText(/MedCareer/i)).toBeInTheDocument();
  });

  test("navigates to jobs page", async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    const jobsLink = screen.getByRole("link", { name: /jobs/i });
    fireEvent.click(jobsLink);

    await waitFor(() => {
      expect(screen.getByText(/Available Jobs/i)).toBeInTheDocument();
    });
  });

  test("navigates to login page", async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    const loginLink = screen.getByRole("link", { name: /login/i });
    fireEvent.click(loginLink);

    await waitFor(() => {
      expect(screen.getByText(/Login/i)).toBeInTheDocument();
    });
  });

  test("navigates to registration page", async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    const registerLink = screen.getByRole("link", { name: /register/i });
    fireEvent.click(registerLink);

    await waitFor(() => {
      expect(screen.getByText(/Register/i)).toBeInTheDocument();
    });
  });
});
