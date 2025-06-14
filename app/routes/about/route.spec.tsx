import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import About from "./route";

describe("About Component", () => {
  it("renders the about page content correctly", () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    // Check for the main heading
    expect(
      screen.getByRole("heading", { name: /About React Router Contacts/i, level: 1 })
    ).toBeInTheDocument();

    // Check for the "Go to demo" link
    expect(
      screen.getByRole("link", { name: /← Go to demo/i })
    ).toBeInTheDocument();

    // Check for a sub-heading "Features"
    expect(
      screen.getByRole("heading", { name: /Features/i, level: 2 })
    ).toBeInTheDocument();
    
    // Check for some introductory text
    expect(
      screen.getByText(/This is a demo application showing off some of the powerful features of React Router/i)
    ).toBeInTheDocument();

    // Check for the external link to reactrouter.com
    expect(
      screen.getByRole("link", { name: /reactrouter.com/i })
    ).toBeInTheDocument();
  });
});
