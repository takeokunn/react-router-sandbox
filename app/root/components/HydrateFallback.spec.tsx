import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HydrateFallback } from "./HydrateFallback";

describe("HydrateFallback コンポーネント", () => {
  beforeEach(() => {
    render(<HydrateFallback />);
  });

  it("「Loading, please wait...」というテキストを表示する", () => {
    expect(screen.getByText("Loading, please wait...")).toBeInTheDocument();
  });

  it("ローディングスピナー要素を表示する", () => {
    const spinnerElement = screen.getByTestId("loading-splash-spinner");
    expect(spinnerElement).toBeInTheDocument();
  });

  it("メインのラッパーdiv要素が存在する", () => {
    const mainDiv = screen.getByTestId("loading-splash");
    expect(mainDiv).toBeInTheDocument();
  });
});
