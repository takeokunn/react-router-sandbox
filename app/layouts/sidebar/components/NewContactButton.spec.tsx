import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { NewContactButton } from "./NewContactButton";

describe("NewContactButton コンポーネント", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <NewContactButton />
      </MemoryRouter>,
    );
  });

  it("「新規」ボタンを表示する", () => {
    const buttonElement = screen.getByRole("button", { name: /New/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveAttribute("type", "submit");
  });

  it("methodが'post'のフォームを表示する", () => {
    const buttonElement = screen.getByRole("button", { name: /New/i });
    const formElement = buttonElement.closest("form");
    expect(formElement).toBeInTheDocument();
    expect(formElement).toHaveAttribute("method", "post");
  });
});
