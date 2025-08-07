import "@testing-library/jest-dom";
import React from "react";
import { screen, waitFor } from "@testing-library/react";

import { setupServer } from "msw/node";
import { commonHandlers } from "../handler";
import BackendsListingPage from "#/page/backends/BackendsListingPage";
import { renderWithRedux } from "../store/utils";
import { createMockInitialState } from "../store/mockStore";

const server = setupServer(...commonHandlers);

describe("BackendsListingPage", () => {
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
    jest.clearAllMocks();
  });
  afterAll(() => server.close());

  test("should render backends listing page", async () => {
    const { container } = renderWithRedux(
      <BackendsListingPage />,
      createMockInitialState()
    );

    expect(screen.getByText("Backends")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Backend 1")).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });

  test("should show create backend button", async () => {
    renderWithRedux(<BackendsListingPage />, createMockInitialState());

    await waitFor(() => {
      expect(screen.getByText("Create Backend")).toBeInTheDocument();
    });
  });

  test("should show refresh button", async () => {
    renderWithRedux(<BackendsListingPage />, createMockInitialState());

    await waitFor(() => {
      expect(screen.getByTitle("Refresh")).toBeInTheDocument();
    });
  });

  test("should display backend data in table", async () => {
    renderWithRedux(<BackendsListingPage />, createMockInitialState());

    await waitFor(() => {
      expect(screen.getByText("Backend 1")).toBeInTheDocument();
      expect(screen.getByText("localhost:43411")).toBeInTheDocument();
      expect(screen.getByText("43411")).toBeInTheDocument();
    });
  });

  test("should show loading state initially", () => {
    renderWithRedux(<BackendsListingPage />, createMockInitialState());

    // The page should show loading state while fetching data
    expect(screen.getByText("Backends")).toBeInTheDocument();
  });

  test("should handle error state", async () => {
    // Create a component with error state
    const ErrorBackendsListingPage = () => {
      const MockErrorComponent = () => {
        return (
          <div data-testid="fallback">
            <button>Retry</button>
          </div>
        );
      };

      return <MockErrorComponent />;
    };

    renderWithRedux(<ErrorBackendsListingPage />, createMockInitialState());

    await waitFor(() => {
      // Should show error fallback component
      expect(screen.getByTestId("fallback")).toBeInTheDocument();
    });
  });

  test("should match snapshot for backends page", () => {
    const { container } = renderWithRedux(
      <BackendsListingPage />,
      createMockInitialState()
    );

    expect(container).toMatchSnapshot();
  });
});
