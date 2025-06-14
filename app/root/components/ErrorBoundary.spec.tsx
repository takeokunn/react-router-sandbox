import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "./ErrorBoundary";
import { isRouteErrorResponse } from "react-router";

vi.mock("react-router", () => ({
  isRouteErrorResponse: vi.fn()
}));

describe("ErrorBoundary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("handles route error response: 404", () => {
    (isRouteErrorResponse as any).mockReturnValue(true);

    const error = { status: 404, statusText: "Not Found" };
    render(<ErrorBoundary error={error} />);

    expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
    expect(screen.getByText("The requested page could not be found.")).toBeInTheDocument();
  });

  it("handles route error response: 500", () => {
    (isRouteErrorResponse as any).mockReturnValue(true);

    const error = { status: 500, statusText: "Internal Server Error" };
    render(<ErrorBoundary error={error} />);

    expect(screen.getByRole("heading", { name: "Error" })).toBeInTheDocument();
    expect(screen.getByText("Internal Server Error")).toBeInTheDocument();
  });

  it("handles dev Error instance", () => {
    (isRouteErrorResponse as any).mockReturnValue(false);

    const error = new Error("Something went wrong");
    render(<ErrorBoundary error={error} />);

    expect(screen.getByRole("heading", { name: "Oops!" })).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("handles fallback case (prod or unknown error)", () => {
    (isRouteErrorResponse as any).mockReturnValue(false);

    const error = "unknown error string";
    render(<ErrorBoundary error={error} />);

    expect(screen.getByRole("heading", { name: "Oops!" })).toBeInTheDocument();
    expect(screen.getByText("An unexpected error occurred.")).toBeInTheDocument();
    expect(screen.queryByRole("code")).not.toBeInTheDocument();
  });
});
