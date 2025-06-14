import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import type { ContactRecord } from "../../data";
import EditContact from "./route";

///////////////////////////////////////////////////////////////////////////////
//                                    mock                                   //
///////////////////////////////////////////////////////////////////////////////

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
const mockNavigate = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useLoaderData: () => ({ contact: mockContact }),
    useNavigate: () => mockNavigate,
  };
});

///////////////////////////////////////////////////////////////////////////////
//                                    test                                   //
///////////////////////////////////////////////////////////////////////////////

describe("EditContact コンポーネント", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    render(
      <MemoryRouter initialEntries={["/contacts/123/edit"]}>
        <EditContact />
      </MemoryRouter>,
    );
  });

  it("フォームに連絡先のデータが事前入力されて表示される", () => {
    expect(screen.getByPlaceholderText("First")).toHaveValue(mockContact.first);
    expect(screen.getByPlaceholderText("Last")).toHaveValue(mockContact.last);
    expect(screen.getByPlaceholderText("@jack")).toHaveValue(mockContact.twitter);
    expect(screen.getByPlaceholderText("https://example.com/avatar.jpg")).toHaveValue(mockContact.avatar);
    expect(screen.getByRole("textbox", { name: "Notes" })).toHaveValue(mockContact.notes);
  });

  it("「保存」ボタンと「キャンセル」ボタンが表示される", () => {
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("「キャンセル」ボタンがクリックされたときに navigate(-1) が呼び出される", () => {
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("フォームが正しいメソッドとIDを持っている", () => {
    const formElement = screen.getByRole("form", { name: "Edit contact" });
    expect(formElement).toBeInTheDocument();
    expect(formElement).toHaveAttribute("method", "post");
    expect(formElement).toHaveAttribute("id", "contact-form");
  });
});
