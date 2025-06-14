import { isRouteErrorResponse } from "react-router";
import type { Route } from "../../+types/root";

type ErrorDisplayInfo = {
  message: string;
  details: string;
  stack?: string;
};

function getErrorDisplayInfo(error: Route.ErrorBoundaryProps['error']): ErrorDisplayInfo {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return { message, details, stack };
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
