import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Outlet } from "react-router";
import Layout from "./layout";
import type { ContactMutation } from "../../data";

const mockSidebarHeader = vi.fn(() => <div data-testid="sidebar-header-mock">SidebarHeader</div>);
const mockSearchFormComponent = vi.fn(
  ({ currentQuery, onQueryChange, onSubmit, isSearching, initialQuery }) => (
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
  ),
);
const mockNewContactButton = vi.fn(() => <div data-testid="new-contact-button-mock">NewContactButton</div>);
const mockContactNavList = vi.fn(({ contacts, navigationState }) => (
  <div
    data-testid="contact-nav-list-mock"
    data-contacts-length={contacts.length}
    data-nav-state={navigationState}
  >
    ContactNavList
  </div>
));

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

vi.mock("./components/SidebarHeader", () => ({ SidebarHeader: mockSidebarHeader }));
vi.mock("./components/SearchFormComponent", () => ({ SearchFormComponent: mockSearchFormComponent }));
vi.mock("./components/NewContactButton", () => ({ NewContactButton: mockNewContactButton }));
vi.mock("./components/ContactNavList", () => ({ ContactNavList: mockContactNavList }));

describe("SidebarLayout コンポーネント (app/layouts/sidebar/layout.tsx)", () => {
  const initialContacts: ContactMutation[] = [
    { id: "1", first: "Taro", last: "Yamada" },
    { id: "2", first: "Hanako", last: "Flower" },
  ];
  const initialQuery = "test";

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLoaderData.mockReturnValue({ contacts: initialContacts, q: initialQuery });
    mockUseNavigation.mockReturnValue({ state: "idle", location: undefined });
    mockUseSubmit.mockReturnValue(vi.fn());
  });

  const renderLayout = () => {
    return render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    );
  };

  describe("初期表示", () => {
    it("すべての子コンポーネントが正しく表示されること", () => {
      renderLayout();
      expect(screen.getByTestId("sidebar-header-mock")).toBeInTheDocument();
      expect(screen.getByTestId("search-form-mock")).toBeInTheDocument();
      expect(screen.getByTestId("new-contact-button-mock")).toBeInTheDocument();
      expect(screen.getByTestId("contact-nav-list-mock")).toBeInTheDocument();
      expect(screen.getByTestId("outlet-mock")).toBeInTheDocument();
    });

    // it("SearchFormComponentに初期クエリとcontactsが渡されること", () => {
    //   renderLayout();
    //   expect(mockSearchFormComponent).toHaveBeenCalledWith(
    //     expect.objectContaining({
    //       initialQuery: initialQuery,
    //       currentQuery: initialQuery,
    //     }),
    //     expect.anything(),
    //   );
    //   expect(mockContactNavList).toHaveBeenCalledWith(
    //     expect.objectContaining({
    //       contacts: initialContacts,
    //       navigationState: "idle",
    //     }),
    //     expect.anything(),
    //   );
    // });
  });

  // describe("検索機能", () => {
  //   it("検索入力が変更されると、SearchFormComponentのcurrentQueryが更新されること", async () => {
  //     renderLayout();
  //     const searchInput = screen.getByTestId("search-input-mock");
  //     await act(async () => {
  //       fireEvent.change(searchInput, { target: { value: "new query" } });
  //     });
  //     expect(mockSearchFormComponent).toHaveBeenLastCalledWith(
  //       expect.objectContaining({ currentQuery: "new query" }),
  //       expect.anything(),
  //     );
  //   });

  //   it("検索フォームを送信すると、useSubmitが正しい引数で呼び出されること (初回検索)", async () => {
  //     const submitFn = vi.fn();
  //     mockUseSubmit.mockReturnValue(submitFn);
  //     mockUseLoaderData.mockReturnValue({ contacts: initialContacts, q: null });
  //     renderLayout();

  //     const searchForm = screen.getByTestId("search-form-mock");
  //     await act(async () => {
  //       fireEvent.submit(searchForm);
  //     });

  //     expect(submitFn).toHaveBeenCalledTimes(1);
  //     expect(submitFn).toHaveBeenCalledWith(searchForm, { replace: false });
  //   });

  //   it("検索フォームを送信すると、useSubmitが正しい引数で呼び出されること (後続検索)", async () => {
  //     const submitFn = vi.fn();
  //     mockUseSubmit.mockReturnValue(submitFn);

  //     mockUseLoaderData.mockReturnValue({ contacts: initialContacts, q: "previousQuery" });
  //     renderLayout();

  //     const searchForm = screen.getByTestId("search-form-mock");
  //     await act(async () => {
  //       fireEvent.submit(searchForm);
  //     });
  //     expect(submitFn).toHaveBeenCalledTimes(1);
  //     expect(submitFn).toHaveBeenCalledWith(searchForm, { replace: true });
  //   });

  //   it("ナビゲーション中にisSearchingがSearchFormComponentに正しく渡されること (検索中)", () => {
  //     mockUseNavigation.mockReturnValue({
  //       state: "loading",
  //       location: { search: "?q=searching", pathname: "/", hash: "", state: null },
  //     });
  //     renderLayout();
  //     expect(mockSearchFormComponent).toHaveBeenCalledWith(
  //       expect.objectContaining({ isSearching: true }),
  //       expect.anything(),
  //     );
  //   });

  //   it("ナビゲーション中でない場合、isSearchingはfalseであること", () => {
  //     mockUseNavigation.mockReturnValue({ state: "idle", location: undefined });
  //     renderLayout();
  //     expect(mockSearchFormComponent).toHaveBeenCalledWith(
  //       expect.objectContaining({ isSearching: false }),
  //       expect.anything(),
  //     );
  //   });
  // });

  // describe("ローダーデータのqの変更 (useEffect)", () => {
  //   it("useLoaderDataから渡されるqが変更されると、SearchFormComponentのcurrentQueryが更新されること", () => {
  //     const { rerender } = renderLayout();
  //     expect(mockSearchFormComponent).toHaveBeenLastCalledWith(
  //       expect.objectContaining({ currentQuery: "test" }),
  //       expect.anything(),
  //     );


  //     mockUseLoaderData.mockReturnValue({ contacts: initialContacts, q: "updatedQuery" });



  //     rerender(
  //       <MemoryRouter>
  //         <Layout />
  //       </MemoryRouter>,
  //     );

  //     expect(mockSearchFormComponent).toHaveBeenLastCalledWith(
  //       expect.objectContaining({ currentQuery: "updatedQuery" }),
  //       expect.anything(),
  //     );
  //   });

  //   it("useLoaderDataから渡されるqがnullの場合、SearchFormComponentのcurrentQueryが空文字列になること", () => {
  //     const { rerender } = renderLayout();

  //     mockUseLoaderData.mockReturnValue({ contacts: initialContacts, q: null });
  //     rerender(
  //       <MemoryRouter>
  //         <Layout />
  //       </MemoryRouter>,
  //     );
  //     expect(mockSearchFormComponent).toHaveBeenLastCalledWith(
  //       expect.objectContaining({ currentQuery: "" }),
  //       expect.anything(),
  //     );
  //   });
  // });
});
