import { render, screen } from "@testing-utils";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import About from "./route";

describe("About Component", () => {
  it("renders the about page content correctly", () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>,
    );

    expect(screen.getByText("About React Router Contacts")).toBeInTheDocument();
  });
});
