import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ContactActions } from "./ContactActions";

describe("ContactActions Component", () => {
  const mockOnDeleteSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent actual form submission for testing
  });

  beforeEach(() => {
    vi.clearAllMocks();
    render(
      <MemoryRouter>
        <ContactActions onDeleteSubmit={mockOnDeleteSubmit} />
      </MemoryRouter>
    );
  });

  it("renders 'Edit' and 'Delete' buttons", () => {
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("Edit form has correct action attribute", () => {
    const editButton = screen.getByRole("button", { name: "Edit" });
    // The button is inside the form, so we find the form via the button
    const form = editButton.closest("form");
    expect(form).toHaveAttribute("action", "edit");
  });

  it("Delete form has correct action and method attributes", () => {
    const deleteButton = screen.getByRole("button", { name: "Delete" });
    const form = deleteButton.closest("form");
    expect(form).toHaveAttribute("action", "destroy");
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
