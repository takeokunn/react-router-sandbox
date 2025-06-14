import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router";
import { ContactNavList } from "./ContactNavList";
import type { ContactMutation } from "app/data";

const mockContacts: ContactMutation[] = [
  { id: "1", first: "John", last: "Doe", favorite: true },
  { id: "2", first: "Jane", last: "Smith", favorite: false },
  { id: "3" /* No name */, favorite: false },
];

describe("ContactNavList コンポーネント", () => {
  it("連絡先リストが空の場合に「No contacts」と表示する", () => {
    render(
      <MemoryRouter>
        <ContactNavList contacts={[]} navigationState="idle" />
      </MemoryRouter>
    );
    expect(screen.getByText(/No contacts/i)).toBeInTheDocument();
  });

  it("連絡先リストに名前とお気に入りインジケータを表示する", () => {
    render(
      <MemoryRouter>
        <ContactNavList contacts={mockContacts} navigationState="idle" />
      </MemoryRouter>
    );

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(mockContacts.length);

    // Check first contact
    const contact1Link = screen.getByRole("link", { name: /John Doe ★/i });
    expect(contact1Link).toBeInTheDocument();
    expect(contact1Link).toHaveAttribute("href", "/contacts/1");

    // Check second contact
    const contact2Link = screen.getByRole("link", { name: /Jane Smith/i });
    expect(contact2Link).toBeInTheDocument();
    expect(contact2Link).toHaveAttribute("href", "/contacts/2");
    expect(contact2Link.textContent).not.toContain("★");


    // Check third contact (No Name)
    const contact3Link = screen.getByRole("link", { name: /No Name/i });
    expect(contact3Link).toBeInTheDocument();
    expect(contact3Link).toHaveAttribute("href", "/contacts/3");
    expect(contact3Link.textContent).not.toContain("★");
  });

  it("名または姓がない連絡先には「No Name」と表示する", () => {
    const noNameContact: ContactMutation[] = [{ id: "4", favorite: false }];
    renderContactNavList(noNameContact, "idle");
    expect(screen.getByText(/No Name/i)).toBeInTheDocument();
  });

  it("お気に入りの連絡先には星（★）を表示する", () => {
    const favoriteContact: ContactMutation[] = [
      { id: "5", first: "Fav", last: "User", favorite: true },
    ];
    renderContactNavList(favoriteContact, "idle");
    const link = screen.getByRole("link", { name: /Fav User ★/i });
    expect(link.textContent).toContain("★");
  });

  it("お気に入りでない連絡先には星を表示しない", () => {
    const nonFavoriteContact: ContactMutation[] = [
      { id: "6", first: "NonFav", last: "User", favorite: false },
    ];
    renderContactNavList(nonFavoriteContact, "idle");
    const link = screen.getByRole("link", { name: /NonFav User/i });
    expect(link.textContent).not.toContain("★");
  });

  it("navigationStateが'loading'の場合にNavLinkに'loading'クラスを適用する", () => {
    renderContactNavList([mockContacts[0]], "loading");
    const link = screen.getByRole("link", { name: /John Doe ★/i });
    expect(link).toHaveClass("loading");
  });

  it("navigationStateが'idle'の場合にNavLinkに'loading'クラスを適用しない", () => {
    renderContactNavList([mockContacts[0]], "idle");
    const link = screen.getByRole("link", { name: /John Doe ★/i });
    expect(link).not.toHaveClass("loading");
  });
});
