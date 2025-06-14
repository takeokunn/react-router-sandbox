import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Favorite } from "./Favorite";

describe("Favorite コンポーネント", () => {
  const renderFavorite = (isFavorite: boolean) => {
    render(<Favorite isFavorite={isFavorite} />);
  };

  it("ボタンのname属性が「favorite」である", () => {
    renderFavorite(false);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("name", "favorite");
  });

  it("フォームのmethod属性が「post」である", () => {
    renderFavorite(false);
    const button = screen.getByRole("button");
    const formElement = button.closest("form");
    expect(formElement).toBeInTheDocument();
    expect(formElement).toHaveAttribute("method", "post");
  });

  describe("isFavoriteがtrueの場合", () => {
    beforeEach(() => {
      renderFavorite(true);
    });

    it("「★」ボタンを表示する", () => {
      const button = screen.getByRole("button", { name: "Remove from favorites" });
      expect(button.textContent).toBe("★");
    });

    it("aria-labelが「Remove from favorites」になる", () => {
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Remove from favorites");
    });

    it("ボタンのvalueが「false」になる", () => {
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("value", "false");
    });
  });

  describe("isFavoriteがfalseの場合", () => {
    beforeEach(() => {
      renderFavorite(false);
    });

    it("「☆」ボタンを表示する", () => {
      const button = screen.getByRole("button", { name: "Add to favorites" });
      expect(button.textContent).toBe("☆");
    });

    it("aria-labelが「Add to favorites」になる", () => {
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Add to favorites");
    });

    it("ボタンのvalueが「true」になる", () => {
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("value", "true");
    });
  });
});
