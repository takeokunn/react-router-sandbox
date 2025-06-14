import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router";
import About from "./route";

describe("About Component", () => {
  it("renders the about page content correctly", () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    expect(screen.getByText("About React Router Contacts")).toBeInTheDocument();
  });
});
