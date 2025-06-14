import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ErrorBoundary } from "./ErrorBoundary"; // Adjust path as necessary
import { isRouteErrorResponse } from "react-router";

// Mock isRouteErrorResponse
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    isRouteErrorResponse: vi.fn(),
  };
});

const mockedIsRouteErrorResponse = isRouteErrorResponse as vi.MockedFunction<typeof isRouteErrorResponse>;

describe("ErrorBoundary コンポーネント", () => {
  // Helper to render the component with a given error
  const renderErrorBoundary = (error: any) => {
    render(<ErrorBoundary error={error} />);
  };

  beforeEach(() => {
    // Reset mocks and environment variables before each test
    mockedIsRouteErrorResponse.mockReset();
    vi.stubGlobal('importMetaEnv', { ...import.meta.env }); // Preserve other env vars
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("React Router の 404 エラーを正しく表示する", () => {
    const routeError = { status: 404, statusText: "Not Found", data: {}, internal: false };
    mockedIsRouteErrorResponse.mockReturnValue(true);
    renderErrorBoundary(routeError);

    expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
    expect(screen.getByText("The requested page could not be found.")).toBeInTheDocument();
    expect(screen.queryByRole("code")).not.toBeInTheDocument(); // No stack trace
  });

  it("React Router のその他のルートエラーを正しく表示する", () => {
    const routeError = { status: 500, statusText: "Internal Server Error", data: {}, internal: false };
    mockedIsRouteErrorResponse.mockReturnValue(true);
    renderErrorBoundary(routeError);

    expect(screen.getByRole("heading", { name: "Error" })).toBeInTheDocument();
    expect(screen.getByText("Internal Server Error")).toBeInTheDocument();
    expect(screen.queryByRole("code")).not.toBeInTheDocument();
  });
  
  it("React Router のルートエラーで statusText がない場合、汎用メッセージを表示する", () => {
    const routeError = { status: 503, statusText: "", data: {}, internal: false };
    mockedIsRouteErrorResponse.mockReturnValue(true);
    renderErrorBoundary(routeError);

    expect(screen.getByRole("heading", { name: "Error" })).toBeInTheDocument();
    expect(screen.getByText("An unexpected error occurred.")).toBeInTheDocument();
  });

  it("開発モードで標準的な JavaScript エラーをメッセージとスタックトレース付きで表示する", () => {
    vi.stubGlobal('importMetaEnv', { DEV: true });
    const jsError = new Error("Something went wrong");
    jsError.stack = "Error: Something went wrong\n    at <anonymous>:1:1";
    mockedIsRouteErrorResponse.mockReturnValue(false);
    renderErrorBoundary(jsError);

    expect(screen.getByRole("heading", { name: "Oops!" })).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText(jsError.stack)).toBeInTheDocument();
  });

  it("本番モードで標準的な JavaScript エラーを汎用メッセージで表示する (スタックトレースなし)", () => {
    vi.stubGlobal('importMetaEnv', { DEV: false });
    const jsError = new Error("Sensitive error details");
    jsError.stack = "Error: Sensitive error details\n    at <anonymous>:1:1";
    mockedIsRouteErrorResponse.mockReturnValue(false);
    renderErrorBoundary(jsError);

    expect(screen.getByRole("heading", { name: "Oops!" })).toBeInTheDocument();
    expect(screen.getByText("An unexpected error occurred.")).toBeInTheDocument();
    // Stack trace should not be shown in production for generic errors
    expect(screen.queryByText(jsError.stack)).not.toBeInTheDocument();
  });
  
  it("その他の未知のエラータイプに対して汎用メッセージを表示する", () => {
    const unknownError = { customError: "weird error" };
    mockedIsRouteErrorResponse.mockReturnValue(false);
    vi.stubGlobal('importMetaEnv', { DEV: true }); // Check DEV behavior for unknown
    renderErrorBoundary(unknownError);

    expect(screen.getByRole("heading", { name: "Oops!" })).toBeInTheDocument();
    expect(screen.getByText("An unexpected error occurred.")).toBeInTheDocument();
    expect(screen.queryByRole("code")).not.toBeInTheDocument();
  });
});
