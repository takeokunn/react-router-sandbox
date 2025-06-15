import { fireEvent, render, screen } from "@testing-utils";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ContactRecord } from "../../data";
import ContactRoute from "./route";

const componentMocks = vi.hoisted(() => {
  return {
    mockContactAvatar: vi.fn(() => <div data-testid="contact-avatar-mock" />),
    mockContactHeader: vi.fn(({ contact, isFavorite }) => (
      <div data-testid="contact-header-mock" data-isfavorite={String(isFavorite)}>
        {contact.first} {contact.last}
      </div>
    )),
    mockContactTwitter: vi.fn(() => <div data-testid="contact-twitter-mock" />),
    mockContactNotes: vi.fn(() => <div data-testid="contact-notes-mock" />),
    mockContactActions: vi.fn(({ onDeleteSubmit }) => (
      <form onSubmit={onDeleteSubmit} data-testid="contact-actions-form-mock">
        <button type="submit" data-testid="delete-button-mock">
          Delete
        </button>
      </form>
    )),
  };
});

const mockUseLoaderData = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useLoaderData: () => mockUseLoaderData(),
  };
});

vi.mock("./components/ContactAvatar", () => ({
  ContactAvatar: componentMocks.mockContactAvatar,
}));
vi.mock("./components/ContactHeader", () => ({
  ContactHeader: componentMocks.mockContactHeader,
}));
vi.mock("./components/ContactTwitter", () => ({
  ContactTwitter: componentMocks.mockContactTwitter,
}));
vi.mock("./components/ContactNotes", () => ({
  ContactNotes: componentMocks.mockContactNotes,
}));
vi.mock("./components/ContactActions", () => ({
  ContactActions: componentMocks.mockContactActions,
}));

const originalConfirm = window.confirm;
const mockConfirm = vi.fn();

describe("コンタクト詳細ルートコンポーネント (app/routes/contact/route.tsx)", () => {
  const mockContact: ContactRecord = {
    id: "123",
    first: "Taro",
    last: "Yamada",
    avatar: "avatar.jpg",
    twitter: "taro_yamada",
    notes: "A test note.",
    favorite: true,
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    window.confirm = mockConfirm;

    mockUseLoaderData.mockReturnValue({ contact: mockContact });
  });

  afterEach(() => {
    window.confirm = originalConfirm;
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <ContactRoute />
      </MemoryRouter>,
    );
  };

  /**
   * TODO: テスト追加
   */
  describe("正常系レンダリング", () => {
    it("コンタクトデータが存在する場合、すべての子コンポーネントが正しく表示されること", () => {
      renderComponent();
      expect(screen.getByTestId("contact-avatar-mock")).toBeInTheDocument();
      expect(screen.getByTestId("contact-header-mock")).toBeInTheDocument();
      expect(screen.getByTestId("contact-twitter-mock")).toBeInTheDocument();
      expect(screen.getByTestId("contact-notes-mock")).toBeInTheDocument();
      expect(screen.getByTestId("contact-actions-form-mock")).toBeInTheDocument();
    });
  });
});
