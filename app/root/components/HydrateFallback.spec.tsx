import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HydrateFallback } from "./HydrateFallback";

describe("HydrateFallback コンポーネント", () => {
  beforeEach(() => {
    render(<HydrateFallback />);
  });

  it("「Loading, please wait...」というテキストを表示する", () => {
    expect(screen.getByText("Loading, please wait...")).toBeInTheDocument();
  });

  it("ローディングスピナー要素を表示する", () => {
    // The component uses an element with id="loading-splash-spinner"
    const spinnerElement = screen.getByTestId("loading-splash-spinner"); // Or document.getElementById if not using data-testid
    expect(spinnerElement).toBeInTheDocument();
  });

  it("メインのラッパーdiv要素が存在する", () => {
    const mainDiv = screen.getByTestId("loading-splash");
    expect(mainDiv).toBeInTheDocument();
  });
});
