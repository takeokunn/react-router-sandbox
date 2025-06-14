import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MemoryRouter } from "react-router"; // For components using <form>
import ContactRoute from "./route"; // The component to test
import type { ContactRecord } from "../../data";

// --- Hoisted Mocks for Child Components ---
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
        <button type="submit" data-testid="delete-button-mock">Delete</button>
      </form>
    )),
  };
});

// --- Mock react-router hooks ---
const mockUseLoaderData = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useLoaderData: () => mockUseLoaderData(),
  };
});

// --- Mock Child Components ---
vi.mock("./components/ContactAvatar", () => ({ ContactAvatar: componentMocks.mockContactAvatar }));
vi.mock("./components/ContactHeader", () => ({ ContactHeader: componentMocks.mockContactHeader }));
vi.mock("./components/ContactTwitter", () => ({ ContactTwitter: componentMocks.mockContactTwitter }));
vi.mock("./components/ContactNotes", () => ({ ContactNotes: componentMocks.mockContactNotes }));
vi.mock("./components/ContactActions", () => ({ ContactActions: componentMocks.mockContactActions }));

// --- Mock window.confirm ---
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
    // Default loader data for most tests
    mockUseLoaderData.mockReturnValue({ contact: mockContact });
  });

  afterEach(() => {
    window.confirm = originalConfirm; // Restore original confirm
  });

  const renderComponent = () => {
    // MemoryRouter is needed because ContactActions uses a <form>
    return render(
      <MemoryRouter>
        <ContactRoute />
      </MemoryRouter>
    );
  };

  describe("正常系レンダリング", () => {
    it("コンタクトデータが存在する場合、すべての子コンポーネントが正しく表示されること", () => {
      renderComponent();
      expect(screen.getByTestId("contact-avatar-mock")).toBeInTheDocument();
      expect(screen.getByTestId("contact-header-mock")).toBeInTheDocument();
      expect(screen.getByTestId("contact-twitter-mock")).toBeInTheDocument();
      expect(screen.getByTestId("contact-notes-mock")).toBeInTheDocument();
      expect(screen.getByTestId("contact-actions-form-mock")).toBeInTheDocument();
    });

    it("子コンポーネントに正しいpropsが渡されること", () => {
      renderComponent();
      expect(componentMocks.mockContactAvatar).toHaveBeenCalledWith({ contact: mockContact }, expect.anything());
      expect(componentMocks.mockContactHeader).toHaveBeenCalledWith({ contact: mockContact, isFavorite: true }, expect.anything());
      expect(componentMocks.mockContactTwitter).toHaveBeenCalledWith({ contact: mockContact }, expect.anything());
      expect(componentMocks.mockContactNotes).toHaveBeenCalledWith({ contact: mockContact }, expect.anything());
      expect(componentMocks.mockContactActions).toHaveBeenCalledWith(expect.objectContaining({
        onDeleteSubmit: expect.any(Function)
      }), expect.anything());
    });

    it("コンタクトのfavoriteがfalseの場合、ContactHeaderにisFavorite: falseが渡されること", () => {
      mockUseLoaderData.mockReturnValue({ contact: { ...mockContact, favorite: false } });
      renderComponent();
      expect(componentMocks.mockContactHeader).toHaveBeenCalledWith(
        expect.objectContaining({ isFavorite: false }),
        expect.anything()
      );
    });

    it("コンタクトのfavoriteがundefinedの場合、ContactHeaderにisFavorite: falseが渡されること", () => {
      mockUseLoaderData.mockReturnValue({ contact: { ...mockContact, favorite: undefined } });
      renderComponent();
      expect(componentMocks.mockContactHeader).toHaveBeenCalledWith(
        expect.objectContaining({ isFavorite: false }),
        expect.anything()
      );
    });
  });

  describe("コンタクトが見つからない場合", () => {
    it("useLoaderDataがcontact: nullを返した場合、404レスポンスがスローされること", () => {
      mockUseLoaderData.mockReturnValue({ contact: null });
      // React Router's error handling mechanism will catch this.
      // We test that the component attempts to throw.
      expect(() => renderComponent()).toThrow(Response);
      try {
        renderComponent();
      } catch (e) {
        expect(e).toBeInstanceOf(Response);
        expect((e as Response).status).toBe(404);
        expect((e as Response).statusText).toBe("Not Found");
      }
    });
  });

  describe("削除確認ダイアログのロジック (handleDeleteSubmit)", () => {
    it("ユーザーが削除を承認した場合、event.preventDefault()が呼び出されないこと", () => {
      mockConfirm.mockReturnValue(true); // User confirms deletion
      renderComponent();
      const deleteForm = screen.getByTestId("contact-actions-form-mock");
      const mockPreventDefault = vi.fn();
      const submitEvent = new Event("submit", { cancelable: true });
      Object.defineProperty(submitEvent, 'preventDefault', { value: mockPreventDefault });

      fireEvent(deleteForm, submitEvent);

      expect(mockConfirm).toHaveBeenCalledTimes(1);
      expect(mockPreventDefault).not.toHaveBeenCalled();
    });

    it("ユーザーが削除をキャンセルした場合、event.preventDefault()が呼び出されること", () => {
      mockConfirm.mockReturnValue(false); // User cancels deletion
      renderComponent();
      const deleteForm = screen.getByTestId("contact-actions-form-mock");
      const mockPreventDefault = vi.fn();
      // Create a real Event object that is cancelable and attach mock preventDefault
      const submitEvent = new Event("submit", { cancelable: true });
      Object.defineProperty(submitEvent, 'preventDefault', { value: mockPreventDefault });

      fireEvent(deleteForm, submitEvent);

      expect(mockConfirm).toHaveBeenCalledTimes(1);
      expect(mockPreventDefault).toHaveBeenCalledTimes(1);
    });
  });
});
