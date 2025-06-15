import type { ContactMutation } from "@app/data";
import { render, screen } from "@testing-utils";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Layout from "./layout";

const componentMocks = vi.hoisted(() => {
  return {
    mockSidebarHeader: vi.fn(() => <div data-testid="sidebar-header-mock">SidebarHeader</div>),
    mockSearchFormComponent: vi.fn(({ currentQuery, onQueryChange, onSubmit, isSearching, initialQuery }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e);
        }}
        data-testid="search-form-mock"
      >
        <input
          type="search"
          value={currentQuery}
          onChange={(e) => onQueryChange(e.target.value)}
          data-testid="search-input-mock"
          data-is-searching={String(isSearching)}
          data-initial-query={initialQuery || ""}
        />
        <button type="submit">Search</button>
      </form>
    )),
    mockNewContactButton: vi.fn(() => <div data-testid="new-contact-button-mock">NewContactButton</div>),
    mockContactNavList: vi.fn(({ contacts, navigationState }) => (
      <div data-testid="contact-nav-list-mock" data-contacts-length={contacts.length} data-nav-state={navigationState}>
        ContactNavList
      </div>
    )),
  };
});

const mockUseLoaderData = vi.fn();
const mockUseNavigation = vi.fn();
const mockUseSubmit = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useLoaderData: () => mockUseLoaderData(),
    useNavigation: () => mockUseNavigation(),
    useSubmit: () => mockUseSubmit(),
    Outlet: () => <div data-testid="outlet-mock">Outlet Content</div>,
  };
});

vi.mock("./components/SidebarHeader", () => ({
  SidebarHeader: componentMocks.mockSidebarHeader,
}));
vi.mock("./components/SearchFormComponent", () => ({
  SearchFormComponent: componentMocks.mockSearchFormComponent,
}));
vi.mock("./components/NewContactButton", () => ({
  NewContactButton: componentMocks.mockNewContactButton,
}));
vi.mock("./components/ContactNavList", () => ({
  ContactNavList: componentMocks.mockContactNavList,
}));

describe("SidebarLayout コンポーネント (app/layouts/sidebar/layout.tsx)", () => {
  const initialContacts: ContactMutation[] = [
    { id: "1", first: "Taro", last: "Yamada" },
    { id: "2", first: "Hanako", last: "Flower" },
  ];
  const initialQuery = "test";

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLoaderData.mockReturnValue({
      contacts: initialContacts,
      q: initialQuery,
    });
    mockUseNavigation.mockReturnValue({ state: "idle", location: undefined });
    mockUseSubmit.mockReturnValue(vi.fn());
  });

  /**
   * TODO: テスト項目を増やす
   */
  describe("初期表示", () => {
    it("すべての子コンポーネントが正しく表示されること", () => {
      render(
        <MemoryRouter>
          <Layout />
        </MemoryRouter>,
      );
      expect(screen.getByTestId("sidebar-header-mock")).toBeInTheDocument();
      expect(screen.getByTestId("search-form-mock")).toBeInTheDocument();
      expect(screen.getByTestId("new-contact-button-mock")).toBeInTheDocument();
      expect(screen.getByTestId("contact-nav-list-mock")).toBeInTheDocument();
      expect(screen.getByTestId("outlet-mock")).toBeInTheDocument();
    });
  });
});
