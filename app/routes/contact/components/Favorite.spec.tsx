import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Favorite } from "./Favorite";

describe("Favorite コンポーネント", () => {
  const renderFavorite = (isFavorite: boolean) => {
    render(<Favorite isFavorite={isFavorite} />);
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
    renderFavorite(false);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("name", "favorite");
  });

  it("フォームのmethod属性が「post」である", () => {
    renderFavorite(false); // isFavorite value doesn't matter for this test
    const button = screen.getByRole("button");
    const formElement = button.closest("form");
    expect(formElement).toBeInTheDocument();
    expect(formElement).toHaveAttribute("method", "post");
  });
});
