import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Home from "./route";
import { MemoryRouter } from "react-router";

describe("Home component", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
  });

  it("renders the introductory text", () => {
    expect(screen.getByText(/This is a demo for React Router/i)).toBeInTheDocument();
  });

  it("renders a link to the React Router documentation", () => {
    const linkElement = screen.getByRole("link", {
      name: /the docs at reactrouter.com/i,
    });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "https://reactrouter.com");
  });
});
