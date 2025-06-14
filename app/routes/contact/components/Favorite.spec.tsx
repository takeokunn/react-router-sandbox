import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Favorite } from "./Favorite";
import type React from "react";

// Mock FavoriteForm component for testing purposes
const MockForm: React.FC<{ method: string; children: React.ReactNode }> = ({ method, children }) => {
  return <form data-testid="mock-form" method={method}>{children}</form>;
};


describe("Favorite コンポーネント", () => {
  const renderFavorite = (isFavorite: boolean, FavoriteForm: React.ElementType = MockForm) => {
    render(<Favorite isFavorite={isFavorite} FavoriteForm={FavoriteForm} />);
  };

  it("isFavoriteがtrueの場合、「★」ボタンを表示する", () => {
    renderFavorite(true);
    const button = screen.getByRole("button", { name: "Remove from favorites" });
    expect(button).toBeInTheDocument();
    expect(button.textContent).toBe("★");
  });

  it("isFavoriteがfalseの場合、「☆」ボタンを表示する", () => {
    renderFavorite(false);
    const button = screen.getByRole("button", { name: "Add to favorites" });
    expect(button).toBeInTheDocument();
    expect(button.textContent).toBe("☆");
  });

  it("isFavoriteがtrueの場合、aria-labelが「Remove from favorites」になる", () => {
    renderFavorite(true);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Remove from favorites");
  });

  it("isFavoriteがfalseの場合、aria-labelが「Add to favorites」になる", () => {
    renderFavorite(false);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Add to favorites");
  });

  it("isFavoriteがtrueの場合、ボタンのvalueが「false」になる", () => {
    renderFavorite(true);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("value", "false");
  });

  it("isFavoriteがfalseの場合、ボタンのvalueが「true」になる", () => {
    renderFavorite(false);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("value", "true");
  });

  it("ボタンのname属性が「favorite」である", () => {
    renderFavorite(false); // isFavorite value doesn't matter for this test
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("name", "favorite");
  });
  
  it("渡されたFavoriteFormコンポーネントを使用し、methodが「post」である", () => {
    renderFavorite(true, MockForm);
    const formElement = screen.getByTestId("mock-form");
    expect(formElement).toBeInTheDocument();
    expect(formElement).toHaveAttribute("method", "post");
    // Check if the button is inside the form
    const button = screen.getByRole("button");
    expect(formElement).toContainElement(button);
  });
});
