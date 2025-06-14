import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import EditContact from "./route";
import type { ContactRecord } from "../../data";

const mockContact: ContactRecord = {
  id: "123",
  first: "John",
  last: "Doe",
  avatar: "https://example.com/avatar.jpg",
  twitter: "@johndoe",
  notes: "Some notes here",
  favorite: true,
  createdAt: new Date().toISOString(),
};

// Mock react-router hooks
const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual, // Import and retain default behavior
    useLoaderData: () => ({ contact: mockContact }),
    useNavigate: () => mockNavigate,
  };
});

describe("EditContact Component", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
    render(
      // The form needs a route to be part of, even if simple
      <MemoryRouter initialEntries={["/contacts/123/edit"]}>
        <EditContact />
      </MemoryRouter>
    );
  });

  it("renders the form with pre-filled contact data", () => {
    expect(screen.getByPlaceholderText("First")).toHaveValue(mockContact.first);
    expect(screen.getByPlaceholderText("Last")).toHaveValue(mockContact.last);
    expect(screen.getByPlaceholderText("@jack")).toHaveValue(mockContact.twitter);
    expect(screen.getByPlaceholderText("https://example.com/avatar.jpg")).toHaveValue(mockContact.avatar);
    expect(screen.getByRole("textbox", { name: "Notes" })).toHaveValue(mockContact.notes);
  });

  it("renders 'Save' and 'Cancel' buttons", () => {
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("calls navigate(-1) when 'Cancel' button is clicked", () => {
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("form has the correct method and id", () => {
    const formElement = screen.getByRole("form");
    expect(formElement).toHaveAttribute("method", "post");
    expect(formElement).toHaveAttribute("id", "contact-form");
  });
});
