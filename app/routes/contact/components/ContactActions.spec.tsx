import { fireEvent, render, screen } from "@testing-utils";
import { type RouteObject, RouterProvider, createMemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { ContactActions } from "./ContactActions";

describe("ContactActions Component", () => {
  const mockOnDeleteSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  });

  const routes: RouteObject[] = [
    {
      path: "/",
      element: <ContactActions onDeleteSubmit={mockOnDeleteSubmit} />,
    },
    {
      path: "edit",
      action: () => null,
    },
    {
      path: "destroy",
      action: () => null,
    },
  ];
  const router = createMemoryRouter(routes, { initialEntries: ["/"] });

  beforeEach(() => {
    vi.clearAllMocks();
    render(<RouterProvider router={router} />);
  });

  it("renders 'Edit' and 'Delete' buttons", () => {
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("Edit form has correct action attribute", () => {
    const editButton = screen.getByRole("button", { name: "Edit" });
    const form = editButton.closest("form");
    expect(form).toHaveAttribute("action", "/edit");
  });

  it("Delete form has correct action and method attributes", () => {
    const deleteButton = screen.getByRole("button", { name: "Delete" });
    const form = deleteButton.closest("form");
    expect(form).toHaveAttribute("action", "/destroy");
    expect(form).toHaveAttribute("method", "post");
  });

  it("calls onDeleteSubmit when Delete form is submitted", () => {
    const deleteButton = screen.getByRole("button", { name: "Delete" });
    const form = deleteButton.closest("form");

    expect(form).not.toBeNull();
    if (form) {
      fireEvent.submit(form);
    }

    expect(mockOnDeleteSubmit).toHaveBeenCalledTimes(1);
  });
});
