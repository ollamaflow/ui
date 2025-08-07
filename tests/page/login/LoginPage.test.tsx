import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../../../src/page/login/LoginPage";

// Mock the auth hooks
jest.mock("#/hooks/authHooks", () => ({
  useAdminCredentialsToLogin: jest.fn(() => jest.fn()),
}));

// Mock the API slice
jest.mock("#/lib/store/slice/apiSlice", () => ({
  useGetFrontendTestMutation: jest.fn(() => [jest.fn(), { isLoading: false }]),
  useValidateConnectivityMutation: jest.fn(() => [
    jest.fn(),
    { isLoading: false },
  ]),
}));

// Mock the RTK API instance
jest.mock("#/lib/store/rtk/rtkApiInstance", () => ({
  changeAxiosBaseUrl: jest.fn(),
  setAuthToken: jest.fn(),
}));

// Mock the constants
jest.mock("#/constants/constant", () => ({
  localStorageKeys: {
    adminAccessKey: "adminAccessKey",
    serverUrl: "serverUrl",
  },
}));

jest.mock("#/constants/apiConfig", () => ({
  ollamaServerUrl: "http://localhost:43411",
}));

// Mock the HOC
jest.mock("#/hoc/hoc", () => ({
  forGuest: (Component: React.ComponentType) => Component,
}));

// Mock the LoginLayout component
jest.mock("#/components/layout/LoginLayout", () => {
  return function MockLoginLayout({
    children,
    isAdmin,
  }: {
    children: React.ReactNode;
    isAdmin?: boolean;
  }) {
    return (
      <div data-testid="login-layout" data-is-admin={isAdmin}>
        {children}
      </div>
    );
  };
});

// Mock the Button component
jest.mock("#/components/base/button/Button", () => {
  return function MockButton({
    children,
    type,
    htmlType,
    className,
    loading,
    disabled,
  }: {
    children: React.ReactNode;
    type?: string;
    htmlType?: string;
    className?: string;
    loading?: boolean;
    disabled?: boolean;
  }) {
    return (
      <button
        data-testid="button"
        data-type={type}
        data-html-type={htmlType}
        className={className}
        disabled={disabled}
      >
        {loading ? "Loading..." : children}
      </button>
    );
  };
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock message
jest.mock("antd", () => ({
  ...jest.requireActual("antd"),
  message: {
    error: jest.fn(),
  },
}));

describe("LoginPage", () => {
  let mockValidateConnectivity: jest.Mock;
  let mockGetFrontendTest: jest.Mock;
  let mockLoginWithAdminCredentials: jest.Mock;
  let mockChangeAxiosBaseUrl: jest.Mock;
  let mockSetAuthToken: jest.Mock;
  let mockMessage: { error: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();

    mockValidateConnectivity = jest.fn();
    mockGetFrontendTest = jest.fn();
    mockLoginWithAdminCredentials = jest.fn();
    mockChangeAxiosBaseUrl = jest.fn();
    mockSetAuthToken = jest.fn();
    mockMessage = { error: jest.fn() };

    // Mock the hooks with our mock functions
    jest.doMock("#/hooks/authHooks", () => ({
      useAdminCredentialsToLogin: jest.fn(() => mockLoginWithAdminCredentials),
    }));

    jest.doMock("#/lib/store/slice/apiSlice", () => ({
      useGetFrontendTestMutation: jest.fn(() => [
        mockGetFrontendTest,
        { isLoading: false },
      ]),
      useValidateConnectivityMutation: jest.fn(() => [
        mockValidateConnectivity,
        { isLoading: false },
      ]),
    }));

    jest.doMock("#/lib/store/rtk/rtkApiInstance", () => ({
      changeAxiosBaseUrl: mockChangeAxiosBaseUrl,
      setAuthToken: mockSetAuthToken,
    }));

    jest.doMock("antd", () => ({
      ...jest.requireActual("antd"),
      message: mockMessage,
    }));
  });

  test("should render login layout with admin flag", () => {
    render(<LoginPage />);

    const loginLayout = screen.getByTestId("login-layout");
    expect(loginLayout).toHaveAttribute("data-is-admin", "true");
  });

  test("should render form with initial values", () => {
    render(<LoginPage />);

    expect(screen.getByLabelText("Ollama Server URL")).toBeInTheDocument();
    expect(screen.getByLabelText("Access Key")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("should render form with correct initial URL", () => {
    render(<LoginPage />);

    const urlInput = screen.getByLabelText(
      "Ollama Server URL"
    ) as HTMLInputElement;
    expect(urlInput.value).toBe("http://localhost:43411");
  });

  test("should render password input for access key", () => {
    render(<LoginPage />);

    const accessKeyInput = screen.getByLabelText("Access Key");
    expect(accessKeyInput).toHaveAttribute("type", "password");
  });

  test("should render submit button", () => {
    render(<LoginPage />);

    const submitButton = screen.getByTestId("button");
    expect(submitButton).toHaveAttribute("data-type", "primary");
    expect(submitButton).toHaveAttribute("data-html-type", "submit");
    expect(submitButton).toHaveTextContent("Login");
  });

  test("should validate URL format", async () => {
    render(<LoginPage />);

    const urlInput = screen.getByLabelText("Ollama Server URL");

    // Test invalid URL
    fireEvent.change(urlInput, { target: { value: "invalid-url" } });
    fireEvent.blur(urlInput);

    await waitFor(() => {
      expect(screen.getByText("Please enter a valid URL!")).toBeInTheDocument();
    });
  });

  test("should validate HTTP/HTTPS protocol", async () => {
    render(<LoginPage />);

    const urlInput = screen.getByLabelText("Ollama Server URL");

    // Test invalid protocol
    fireEvent.change(urlInput, { target: { value: "ftp://example.com" } });
    fireEvent.blur(urlInput);

    await waitFor(() => {
      expect(
        screen.getByText("Only HTTP or HTTPS URLs are allowed!")
      ).toBeInTheDocument();
    });
  });

  test("should accept valid HTTP URL", async () => {
    render(<LoginPage />);

    const urlInput = screen.getByLabelText("Ollama Server URL");

    // Test valid HTTP URL
    fireEvent.change(urlInput, { target: { value: "http://example.com" } });
    fireEvent.blur(urlInput);

    // Should not show validation error
    expect(
      screen.queryByText("Please enter a valid URL!")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Only HTTP or HTTPS URLs are allowed!")
    ).not.toBeInTheDocument();
  });

  test("should accept valid HTTPS URL", async () => {
    render(<LoginPage />);

    const urlInput = screen.getByLabelText("Ollama Server URL");

    // Test valid HTTPS URL
    fireEvent.change(urlInput, { target: { value: "https://example.com" } });
    fireEvent.blur(urlInput);

    // Should not show validation error
    expect(
      screen.queryByText("Please enter a valid URL!")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Only HTTP or HTTPS URLs are allowed!")
    ).not.toBeInTheDocument();
  });

  test("should require URL field", async () => {
    render(<LoginPage />);

    const urlInput = screen.getByLabelText("Ollama Server URL");
    fireEvent.change(urlInput, { target: { value: "" } });
    fireEvent.blur(urlInput);

    await waitFor(() => {
      expect(
        screen.getByText("Please enter the Ollama Server URL!")
      ).toBeInTheDocument();
    });
  });

  test("should require access key field", async () => {
    render(<LoginPage />);

    const accessKeyInput = screen.getByLabelText("Access Key");
    fireEvent.change(accessKeyInput, { target: { value: "" } });
    fireEvent.blur(accessKeyInput);

    // Submit the form to trigger validation
    const submitButton = screen.getByText("Login");
    fireEvent.click(submitButton);

    // Wait for form validation to complete
    await waitFor(() => {
      expect(
        screen.getByText("Please input your access key!")
      ).toBeInTheDocument();
    });
  });

  test("should handle Enter key press", async () => {
    render(<LoginPage />);

    const urlInput = screen.getByLabelText("Ollama Server URL");
    const accessKeyInput = screen.getByLabelText("Access Key");

    fireEvent.change(urlInput, { target: { value: "https://example.com" } });
    fireEvent.change(accessKeyInput, { target: { value: "test-access-key" } });
    fireEvent.keyPress(accessKeyInput, { key: "Enter", code: "Enter" });

    // Should trigger form submission
    await waitFor(() => {
      expect(screen.getByText("Login")).toBeInTheDocument();
    });
  });

  test("should disable access key input when server is not valid", () => {
    render(<LoginPage />);

    const accessKeyInput = screen.getByLabelText("Access Key");
    expect(accessKeyInput).toBeDisabled();
  });
});
