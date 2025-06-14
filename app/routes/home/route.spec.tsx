import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Home from "./route";

describe("About component", () => {
  it("render", () => {
    render(<Home />);
    expect(screen.getByText("the docs at reactrouter.com").textContent).toBeInTheDocument();
  });
});
