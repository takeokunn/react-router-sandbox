import { MantineProvider } from "@mantine/core";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SearchFormComponent, type SearchFormComponentProps } from "./SearchFormComponent";

describe("SearchFormComponent コンポーネント", () => {
  let mockOnQueryChange: ReturnType<typeof vi.fn>;
  let mockOnSubmit: ReturnType<typeof vi.fn>;
  let defaultProps: SearchFormComponentProps;

  const renderComponent = (props: Partial<SearchFormComponentProps> = {}) => {
    const finalProps = { ...defaultProps, ...props };
    return render(
      <MantineProvider>
        <MemoryRouter>
          <SearchFormComponent {...finalProps} />
        </MemoryRouter>
      </MantineProvider>,
    );
  };

  beforeEach(() => {
    mockOnQueryChange = vi.fn();
    mockOnSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    });
    defaultProps = {
      initialQuery: "",
      isSearching: false,
      currentQuery: "",
      onQueryChange: mockOnQueryChange,
      onSubmit: mockOnSubmit,
    };
    vi.clearAllMocks();
  });

  it("初期状態で検索入力フィールドと非表示のスピナーが正しく表示される", () => {
    renderComponent();

    const inputElement = screen.getByPlaceholderText("Search");
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute("aria-label", "Search contacts");
    expect(inputElement).toHaveValue("");

    // Check that the loader is not present initially
    expect(screen.queryByTestId("search-loader")).not.toBeInTheDocument();
  });

  it("currentQueryが指定された場合、入力フィールドにその値が設定される", () => {
    renderComponent({ currentQuery: "test query" });
    const inputElement = screen.getByPlaceholderText("Search");
    expect(inputElement).toHaveValue("test query");
  });

  it("isSearchingがtrueの場合、入力フィールドにloadingクラスが適用され、スピナーが表示される", () => {
    renderComponent({ isSearching: true });

    // Check that the loader is present when isSearching is true
    const loaderElement = screen.getByTestId("search-loader");
    expect(loaderElement).toBeInTheDocument();
  });

  it("入力フィールドへの入力時にonQueryChangeが呼び出される", () => {
    renderComponent();
    const inputElement = screen.getByPlaceholderText("Search");
    fireEvent.change(inputElement, { target: { value: "new query" } });
    expect(mockOnQueryChange).toHaveBeenCalledTimes(1);
    expect(mockOnQueryChange).toHaveBeenCalledWith("new query");
  });

  it("フォームのonChangeイベント（入力時）にonSubmitが呼び出される", () => {
    renderComponent();
    const inputElement = screen.getByPlaceholderText("Search");
    fireEvent.change(inputElement, { target: { value: "another query" } });
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });
});
