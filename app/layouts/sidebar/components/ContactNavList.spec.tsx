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

describe("ContactNavList Component", () => {
  it("renders 'No contacts' when the contacts list is empty", () => {
    render(
      <MemoryRouter>
        <ContactNavList contacts={[]} navigationState="idle" />
      </MemoryRouter>
    );
    expect(screen.getByText(/No contacts/i)).toBeInTheDocument();
  });

  it("renders a list of contacts with names and favorite indicators", () => {
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

  it("renders 'No Name' for contacts without first or last names", () => {
    const noNameContact: ContactMutation[] = [{ id: "4", favorite: false }];
    render(
      <MemoryRouter>
        <ContactNavList contacts={noNameContact} navigationState="idle" />
      </MemoryRouter>
    );
    expect(screen.getByText(/No Name/i)).toBeInTheDocument();
  });

  it("displays a star (★) for favorite contacts", () => {
    const favoriteContact: ContactMutation[] = [
      { id: "5", first: "Fav", last: "User", favorite: true },
    ];
    render(
      <MemoryRouter>
        <ContactNavList contacts={favoriteContact} navigationState="idle" />
      </MemoryRouter>
    );
    const link = screen.getByRole("link", { name: /Fav User ★/i });
    expect(link.textContent).toContain("★");
  });

  it("does not display a star for non-favorite contacts", () => {
    const nonFavoriteContact: ContactMutation[] = [
      { id: "6", first: "NonFav", last: "User", favorite: false },
    ];
    render(
      <MemoryRouter>
        <ContactNavList contacts={nonFavoriteContact} navigationState="idle" />
      </MemoryRouter>
    );
    const link = screen.getByRole("link", { name: /NonFav User/i });
    expect(link.textContent).not.toContain("★");
  });

  it("applies 'loading' class to NavLink when navigationState is 'loading'", () => {
    render(
      <MemoryRouter>
        <ContactNavList contacts={[mockContacts[0]]} navigationState="loading" />
      </MemoryRouter>
    );
    const link = screen.getByRole("link", { name: /John Doe ★/i });
    expect(link).toHaveClass("loading");
  });

  it("does not apply 'loading' class to NavLink when navigationState is 'idle'", () => {
    render(
      <MemoryRouter>
        <ContactNavList contacts={[mockContacts[0]]} navigationState="idle" />
      </MemoryRouter>
    );
    const link = screen.getByRole("link", { name: /John Doe ★/i });
    expect(link).not.toHaveClass("loading");
  });
});
