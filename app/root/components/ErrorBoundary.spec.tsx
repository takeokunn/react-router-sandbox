import { render, screen } from "@testing-utils";
import { isRouteErrorResponse } from "react-router";
import type { MockedFunction } from "vitest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ErrorBoundary } from "./ErrorBoundary";

vi.mock("react-router", () => ({
  isRouteErrorResponse: vi.fn(),
}));

describe("ErrorBoundary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (isRouteErrorResponse as unknown as MockedFunction<typeof isRouteErrorResponse>).mockReset();
  });

  it("handles route error response: 404", () => {
    (isRouteErrorResponse as unknown as MockedFunction<typeof isRouteErrorResponse>).mockReturnValue(true);

    const error = { status: 404, statusText: "Not Found" };
    render(<ErrorBoundary error={error} params={{}} />);

    expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
    expect(screen.getByText("The requested page could not be found.")).toBeInTheDocument();
  });

  it("handles route error response: 500", () => {
    (isRouteErrorResponse as unknown as MockedFunction<typeof isRouteErrorResponse>).mockReturnValue(true);

    const error = { status: 500, statusText: "Internal Server Error" };
    render(<ErrorBoundary error={error} params={{}} />);

    expect(screen.getByRole("heading", { name: "Error" })).toBeInTheDocument();
    expect(screen.getByText("Internal Server Error")).toBeInTheDocument();
  });

  it("handles dev Error instance", () => {
    (isRouteErrorResponse as unknown as MockedFunction<typeof isRouteErrorResponse>).mockReturnValue(false);

    const error = new Error("Something went wrong");
    render(<ErrorBoundary error={error} params={{}} />);

    expect(screen.getByRole("heading", { name: "Oops!" })).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("handles fallback case (prod or unknown error)", () => {
    (isRouteErrorResponse as unknown as MockedFunction<typeof isRouteErrorResponse>).mockReturnValue(false);

    const error = "unknown error string";
    render(<ErrorBoundary error={error} params={{}} />);

    expect(screen.getByRole("heading", { name: "Oops!" })).toBeInTheDocument();
    expect(screen.getByText("An unexpected error occurred.")).toBeInTheDocument();
    expect(screen.queryByRole("code")).not.toBeInTheDocument();
  });
});
