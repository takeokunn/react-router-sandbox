import { render, screen } from "@testing-utils";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ContactRecord } from "../../../data";
import { ContactHeader } from "./ContactHeader";

vi.mock("./Favorite", () => ({
  Favorite: ({ isFavorite }: { isFavorite: boolean }) => (
    <button type="button" data-testid="favorite-button" data-isfavorite={String(isFavorite)}>
      {isFavorite ? "★" : "☆"}
    </button>
  ),
}));

describe("ContactHeader コンポーネント", () => {
  const mockContactBase: Pick<ContactRecord, "first" | "last"> = {
    first: "Taro",
    last: "Yamada",
  };

  const renderInRouter = (contact: Pick<ContactRecord, "first" | "last">, isFavorite: boolean) => {
    render(
      <MemoryRouter>
        <ContactHeader contact={contact} isFavorite={isFavorite} />
      </MemoryRouter>,
    );
  };

  describe("連絡先名の表示", () => {
    it("名と姓が提供された場合、正しく表示されること", () => {
      renderInRouter(mockContactBase, false);
      expect(screen.getByRole("heading", { name: /Taro Yamada/ })).toBeInTheDocument();
      expect(screen.getByText("Taro Yamada")).toBeInTheDocument();
    });

    it("名のみが提供された場合、名のみが表示されること", () => {
      renderInRouter({ ...mockContactBase, last: undefined }, false);
      expect(screen.getByRole("heading", { name: /Taro/ })).toBeInTheDocument();
      expect(screen.getByText("Taro")).toBeInTheDocument();
    });

    it("姓のみが提供された場合、姓のみが表示されること", () => {
      renderInRouter({ ...mockContactBase, first: undefined }, false);
      expect(screen.getByRole("heading", { name: /Yamada/ })).toBeInTheDocument();
      expect(screen.getByText("Yamada")).toBeInTheDocument();
    });

    it("名と姓が提供されない場合、「No Name」が表示されること", () => {
      renderInRouter({ first: undefined, last: undefined }, false);
      expect(screen.getByRole("heading", { name: /No Name/ })).toBeInTheDocument();
      expect(screen.getByText("No Name")).toBeInTheDocument();
    });
  });

  describe("Favoriteコンポーネントの表示", () => {
    describe("isFavoriteがtrueの場合", () => {
      beforeEach(() => {
        renderInRouter(mockContactBase, true);
      });

      it("Favoriteコンポーネントにtrueが渡され、「★」が表示されること", () => {
        const favoriteButton = screen.getByTestId("favorite-button");
        expect(favoriteButton).toBeInTheDocument();
        expect(favoriteButton).toHaveAttribute("data-isfavorite", "true");
        expect(favoriteButton.textContent).toBe("★");
      });
    });

    describe("isFavoriteがfalseの場合", () => {
      beforeEach(() => {
        renderInRouter(mockContactBase, false);
      });

      it("Favoriteコンポーネントにfalseが渡され、「☆」が表示されること", () => {
        const favoriteButton = screen.getByTestId("favorite-button");
        expect(favoriteButton).toBeInTheDocument();
        expect(favoriteButton).toHaveAttribute("data-isfavorite", "false");
        expect(favoriteButton.textContent).toBe("☆");
      });
    });
  });
});
