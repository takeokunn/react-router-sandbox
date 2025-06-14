import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider, type RouteObject } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";
import { Favorite } from "./Favorite";

describe("Favorite コンポーネント", () => {
  const setupRouter = (isFavorite: boolean) => {
    const routes: RouteObject[] = [
      {
        path: "/",
        element: <Favorite isFavorite={isFavorite} />,
        action: () => null, // Dummy action for the form
      },
    ];
    return createMemoryRouter(routes, { initialEntries: ["/"] });
  };

  it("ボタンのname属性が「favorite」である", () => {
    const router = setupRouter(false);
    render(<RouterProvider router={router} />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("name", "favorite");
  });

  it("フォームのmethod属性が「post」である", () => {
    const router = setupRouter(false);
    render(<RouterProvider router={router} />);
    const button = screen.getByRole("button");
    const formElement = button.closest("form");
    expect(formElement).toBeInTheDocument();
    expect(formElement).toHaveAttribute("method", "post");
  });

  describe("isFavoriteがtrueの場合", () => {
    beforeEach(() => {
      const router = setupRouter(true);
      render(<RouterProvider router={router} />);
    });

    it("「★」ボタンを表示する", () => {
      const button = screen.getByRole("button", {
        name: "Remove from favorites",
      });
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
      const router = setupRouter(false);
      render(<RouterProvider router={router} />);
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
