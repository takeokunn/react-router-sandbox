import { isRouteErrorResponse } from "react-router";
import type { Route } from "../../+types/root";

type ErrorDisplayInfo = {
  message: string;
  details: string;
  stack?: string;
};

/**
 * Determines the appropriate message, details, and stack trace to display for an error.
 *
 * @param error - The error object caught by the ErrorBoundary.
 * @returns An object containing the message, details, and optional stack trace.
 */
function getErrorDisplayInfo(error: Route.ErrorBoundaryProps['error']): ErrorDisplayInfo {
  // Handle errors thrown by React Router (e.g., 404 Not Found)
  if (isRouteErrorResponse(error)) {
    const message = error.status === 404 ? "404" : "Error"; // Specific message for 404
    const details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || "An unexpected error occurred."; // Use statusText or a generic message
    return { message, details, stack: undefined }; // No stack trace for route errors typically
  }

  // Handle standard JavaScript errors in development mode
  // In DEV, show more detailed error information including stack trace
  if (import.meta.env.DEV && error && error instanceof Error) {
    const message = "Oops!"; // Generic message for JS errors
    const details = error.message; // Specific error message from the Error object
    const stack = error.stack; // Stack trace for debugging
    return { message, details, stack };
  }

  // Default fallback for other types of errors or production environment JS errors
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
