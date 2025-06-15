import { render, screen } from "@testing-utils";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";
import { SidebarHeader } from "./SidebarHeader";

describe("SidebarHeader コンポーネント", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <SidebarHeader />
      </MemoryRouter>,
    );
  });

  it("h1 見出しを表示する", () => {
    const headingElement = screen.getByRole("heading", { level: 1 });
    expect(headingElement).toBeInTheDocument();
  });

  it("「React Router Contacts」というテキストのリンクを表示する", () => {
    const linkElement = screen.getByRole("link", {
      name: /React Router Contacts/i,
    });
    expect(linkElement).toBeInTheDocument();
  });

  it("リンクが正しい宛先（'about'）を指している", () => {
    const linkElement = screen.getByRole("link", {
      name: /React Router Contacts/i,
    });
    expect(linkElement).toHaveAttribute("href", "/about");
  });
});
