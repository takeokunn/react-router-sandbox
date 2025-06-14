import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import About from "./route";

describe("About component", () => {
  it("renders headings and sections", () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /About React Router Contacts/i })
    ).toBeInTheDocument();
    
    // Added a check for the link as well, similar to previous test versions
    expect(screen.getByRole("link", { name: /← Go to demo/i })).toBeInTheDocument();
  });
});
