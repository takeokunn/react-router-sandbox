import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ErrorBoundary } from "./ErrorBoundary"; // Target component
import { isRouteErrorResponse as mockIsRouteErrorResponse } from "react-router";

// react-routerのisRouteErrorResponseをモック
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    isRouteErrorResponse: vi.fn(),
  };
});

// import.meta.env.DEV の元の値を保存
const originalDevEnv = import.meta.env.DEV;

describe("ErrorBoundary コンポーネント", () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.resetAllMocks();
  });

  afterEach(() => {
    // 各テストの後に import.meta.env.DEV を元の値に戻す
    import.meta.env.DEV = originalDevEnv;
  });

  const renderErrorBoundary = (error: unknown) => {
    render(<ErrorBoundary error={error} />);
  };

  describe("ルートエラーレスポンスの場合 (isRouteErrorResponse が true)", () => {
    it("404エラーの場合、適切なメッセージと詳細を表示すること", () => {
      (mockIsRouteErrorResponse as vi.Mock).mockReturnValue(true);
      const error = { status: 404, statusText: "Not Found" };
      renderErrorBoundary(error);

      expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
      expect(screen.getByText("The requested page could not be found.")).toBeInTheDocument();
      expect(screen.queryByRole("code")).not.toBeInTheDocument(); // スタックトレースは表示されない
    });

    it("404以外のルートエラーの場合、エラーのステータステキストを表示すること", () => {
      (mockIsRouteErrorResponse as vi.Mock).mockReturnValue(true);
      const error = { status: 500, statusText: "Internal Server Error" };
      renderErrorBoundary(error);

      expect(screen.getByRole("heading", { name: "Error" })).toBeInTheDocument();
      expect(screen.getByText("Internal Server Error")).toBeInTheDocument();
      expect(screen.queryByRole("code")).not.toBeInTheDocument();
    });

    it("ステータステキストがない場合、一般的なエラー詳細を表示すること", () => {
      (mockIsRouteErrorResponse as vi.Mock).mockReturnValue(true);
      const error = { status: 503 }; // statusTextなし
      renderErrorBoundary(error);

      expect(screen.getByRole("heading", { name: "Error" })).toBeInTheDocument();
      expect(screen.getByText("An unexpected error occurred.")).toBeInTheDocument();
      expect(screen.queryByRole("code")).not.toBeInTheDocument();
    });
  });

  describe("標準的なJavaScriptエラーの場合", () => {
    beforeEach(() => {
      (mockIsRouteErrorResponse as vi.Mock).mockReturnValue(false);
    });

    it("開発モード(DEV)の場合、エラーメッセージとスタックトレースを表示すること", () => {
      import.meta.env.DEV = true;
      const error = new Error("Something went wrong");
      error.stack = "Error stack trace here";
      renderErrorBoundary(error);

      expect(screen.getByRole("heading", { name: "Oops!" })).toBeInTheDocument();
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
      expect(screen.getByText("Error stack trace here")).toBeInTheDocument();
      expect(screen.getByRole("code")).toBeInTheDocument();
    });

    it("本番モードの場合、一般的なメッセージを表示し、スタックトレースは表示しないこと", () => {
      import.meta.env.DEV = false;
      const error = new Error("Something went wrong");
      error.stack = "Error stack trace here";
      renderErrorBoundary(error);

      expect(screen.getByRole("heading", { name: "Oops!" })).toBeInTheDocument();
      expect(screen.getByText("An unexpected error occurred.")).toBeInTheDocument();
      expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
      expect(screen.queryByRole("code")).not.toBeInTheDocument();
    });
  });

  describe("その他のエラータイプの場合", () => {
    beforeEach(() => {
      (mockIsRouteErrorResponse as vi.Mock).mockReturnValue(false);
    });

    it("開発モード(DEV)でエラーがErrorインスタンスでない場合、一般的なメッセージを表示すること", () => {
      import.meta.env.DEV = true;
      const error = "Just a string error";
      renderErrorBoundary(error);

      expect(screen.getByRole("heading", { name: "Oops!" })).toBeInTheDocument();
      expect(screen.getByText("An unexpected error occurred.")).toBeInTheDocument();
      expect(screen.queryByRole("code")).not.toBeInTheDocument();
    });

    it("本番モードでエラーがErrorインスタンスでない場合、一般的なメッセージを表示すること", () => {
      import.meta.env.DEV = false;
      const error = { message: "An object error" };
      renderErrorBoundary(error);

      expect(screen.getByRole("heading", { name: "Oops!" })).toBeInTheDocument();
      expect(screen.getByText("An unexpected error occurred.")).toBeInTheDocument();
      expect(screen.queryByRole("code")).not.toBeInTheDocument();
    });

    it("エラーがnullまたはundefinedの場合でもクラッシュせず、一般的なメッセージを表示すること", () => {
      import.meta.env.DEV = true; // DEVモードでも同様
      renderErrorBoundary(null);

      expect(screen.getByRole("heading", { name: "Oops!" })).toBeInTheDocument();
      expect(screen.getByText("An unexpected error occurred.")).toBeInTheDocument();
      expect(screen.queryByRole("code")).not.toBeInTheDocument();

      // undefinedの場合もテスト
      renderErrorBoundary(undefined);
      expect(screen.getByRole("heading", { name: "Oops!" })).toBeInTheDocument(); // 再度確認
    });
  });
});
