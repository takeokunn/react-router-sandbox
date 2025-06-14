import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ContactHeader } from "./ContactHeader";
import type { ContactRecord } from "../../../data";

// Favoriteコンポーネントをモックする
vi.mock("./Favorite", () => ({
  Favorite: ({ isFavorite }: { isFavorite: boolean }) => (
    <button data-testid="favorite-button" data-isfavorite={String(isFavorite)}>
      {isFavorite ? "★" : "☆"}
    </button>
  ),
}));

describe("ContactHeader コンポーネント", () => {
  const mockContactBase: Pick<ContactRecord, "first" | "last"> = {
    first: "Taro",
    last: "Yamada",
  };

  const renderComponent = (
    contact: Pick<ContactRecord, "first" | "last">,
    isFavorite: boolean,
  ) => {
    render(
      <MemoryRouter>
        <ContactHeader contact={contact} isFavorite={isFavorite} />
      </MemoryRouter>,
    );
  };

  it("名と姓が提供された場合、正しく表示されること", () => {
    renderComponent(mockContactBase, false);
    expect(screen.getByRole("heading", { name: /Taro Yamada/ })).toBeInTheDocument();
    expect(screen.getByText("Taro Yamada")).toBeInTheDocument();
  });

  it("名のみが提供された場合、名のみが表示されること", () => {
    renderComponent({ ...mockContactBase, last: undefined }, false);
    expect(screen.getByRole("heading", { name: /Taro/ })).toBeInTheDocument();
    expect(screen.getByText("Taro")).toBeInTheDocument();
  });

  it("姓のみが提供された場合、姓のみが表示されること", () => {
    renderComponent({ ...mockContactBase, first: undefined }, false);
    expect(screen.getByRole("heading", { name: /Yamada/ })).toBeInTheDocument();
    expect(screen.getByText("Yamada")).toBeInTheDocument();
  });

  it("名と姓が提供されない場合、「No Name」が表示されること", () => {
    renderComponent({ first: undefined, last: undefined }, false);
    expect(screen.getByRole("heading", { name: /No Name/ })).toBeInTheDocument();
    expect(screen.getByText("No Name")).toBeInTheDocument();
  });

  it("isFavoriteがtrueの場合、Favoriteコンポーネントにtrueが渡されること", () => {
    renderComponent(mockContactBase, true);
    const favoriteButton = screen.getByTestId("favorite-button");
    expect(favoriteButton).toBeInTheDocument();
    expect(favoriteButton).toHaveAttribute("data-isfavorite", "true");
    expect(favoriteButton.textContent).toBe("★");
  });

  it("isFavoriteがfalseの場合、Favoriteコンポーネントにfalseが渡されること", () => {
    renderComponent(mockContactBase, false);
    const favoriteButton = screen.getByTestId("favorite-button");
    expect(favoriteButton).toBeInTheDocument();
    expect(favoriteButton).toHaveAttribute("data-isfavorite", "false");
    expect(favoriteButton.textContent).toBe("☆");
  });
});
