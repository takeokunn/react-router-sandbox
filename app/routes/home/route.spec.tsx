import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Home from "./route";
import { MemoryRouter } from "react-router";

describe("Home component", () => {
  it("render", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText("the docs at reactrouter.com")).toBeInTheDocument();
  });
});
