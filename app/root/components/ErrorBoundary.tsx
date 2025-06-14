import { isRouteErrorResponse } from "react-router";
import type { Route } from "../../+types/root";

type ErrorDisplayInfo = {
  message: string;
  details: string;
  stack?: string;
};

function getErrorDisplayInfo(error: Route.ErrorBoundaryProps['error']): ErrorDisplayInfo {
  if (isRouteErrorResponse(error)) {
    const message = error.status === 404 ? "404" : "Error";
    const details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || "An unexpected error occurred.";
    return { message, details, stack: undefined };
  }

  if (import.meta.env.DEV && error && error instanceof Error) {
    const message = "Oops!"; // Or derive from error.name if desired
    const details = error.message;
    const stack = error.stack;
    return { message, details, stack };
  }

  // Default case
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
