import { isRouteErrorResponse } from "react-router";
import type { Route } from "../../+types/root";

type ErrorDisplayInfo = {
  message: string;
  details: string;
  stack?: string;
};

/**
 * エラーに対して表示する適切なメッセージ、詳細、およびスタックトレースを決定します。
 * この関数は以下の条件分岐ロジックを含みます：
 * 1. `isRouteErrorResponse(error)` が true の場合:
 *    - React Router によってスローされたエラー（例: 404 Not Found）を処理します。
 *    - エラーのステータスに応じてメッセージと詳細を設定します。スタックトレースは通常表示されません。
 * 2. `import.meta.env.DEV && error && error instanceof Error` が true の場合:
 *    - 開発モードにおける標準的な JavaScript エラーを処理します。
 *    - エラーオブジェクトからメッセージとスタックトレースを取得し、詳細なデバッグ情報を提供します。
 * 3. 上記以外の場合 (デフォルトのフォールバック):
 *    - その他の種類のエラー、または本番環境での JavaScript エラーを処理します。
 *    - 一般的なエラーメッセージと詳細を表示します。
 *
 * @param error - ErrorBoundaryによってキャッチされたエラーオブジェクト。
 * @returns メッセージ、詳細、およびオプションのスタックトレースを含むオブジェクト。
 */
function getErrorDisplayInfo(error: Route.ErrorBoundaryProps["error"]): ErrorDisplayInfo {
  if (isRouteErrorResponse(error)) {
    const message = error.status === 404 ? "404" : "Error";
    const details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || "An unexpected error occurred.";
    return { message, details, stack: undefined };
  }

  if (import.meta.env.DEV && error && error instanceof Error) {
    const message = "Oops!";
    const details = error.message;
    const stack = error.stack;
    return { message, details, stack };
  }

  return {
    message: "Oops!",
    details: "An unexpected error occurred.",
    stack: undefined,
  };
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { message, details, stack } = getErrorDisplayInfo(error);

  return (
    <main id="error-page">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
