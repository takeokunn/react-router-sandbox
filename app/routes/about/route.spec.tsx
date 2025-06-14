import { render, screen } from "@testing-library/react";
import About from "./route";

describe("About component", () => {
  it("renders headings and sections", () => {
    render(<About />);

    expect(screen.getByRole("h1").textContent).toBe("About React Router Contacts");
  });
});
