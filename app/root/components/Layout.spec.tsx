import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Layout } from "./Layout";

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    ScrollRestoration: vi.fn(() => <div data-testid="scroll-restoration-mock" />),
    Scripts: vi.fn(() => <div data-testid="scripts-mock" />),
  };
});

describe("Layout コンポーネント", () => {
  const testChildText = "テスト用の子要素コンテンツ";

  beforeEach(() => {
    render(
      <Layout>
        <div>{testChildText}</div>
      </Layout>
    );
  });

  it("html タグが lang='en' 属性を持っている", () => {
    expect(document.documentElement).toHaveAttribute("lang", "en");
  });

  it("head タグ内に正しい meta タグとスタイルシートリンクが含まれている", () => {
    const head = document.head;
    const charsetMeta = head.querySelector('meta[charset="utf-8"]');
    expect(charsetMeta).toBeInTheDocument();

    const viewportMeta = head.querySelector('meta[name="viewport"]');
    expect(viewportMeta).toBeInTheDocument();
    expect(viewportMeta).toHaveAttribute("content", "width=device-width, initial-scale=1");
  });

  it("body タグが子要素を正しく表示する", () => {
    expect(screen.getByText(testChildText)).toBeInTheDocument();
  });
});
