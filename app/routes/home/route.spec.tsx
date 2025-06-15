import { render, screen } from "@testing-utils";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import Home from "./route";

describe("Home コンポーネント", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );
  });

  it("紹介テキストを表示する", () => {
    expect(screen.getByText(/This is a demo for React Router/i)).toBeInTheDocument();
  });

  it("React Router のドキュメントへのリンクを表示する", () => {
    const linkElement = screen.getByRole("link", {
      name: /the docs at reactrouter.com/i,
    });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "https://reactrouter.com");
  });
});
