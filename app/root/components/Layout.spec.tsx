import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Layout } from "./Layout"; // Adjust path as necessary
import appStylesHref from "../../app.css?url"; // Import the CSS URL

// Mock React Router components
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
  const TestChildComponent = () => <div>{testChildText}</div>;

  beforeEach(() => {
    // Render the Layout component with a test child
    // We need to render into document.body or similar for head elements to be queryable
    // via screen.getByRole etc. if they are outside the main render container.
    // However, for basic checks, rendering directly is often fine.
    // For full head manipulation testing, a more complex setup might be needed.
    render(
      <Layout>
        <TestChildComponent />
      </Layout>
    );
  });

  it("html タグが lang='en' 属性を持っている", () => {
    // Vitest/JSDOM renders into a div by default, so <html> is the root of the JSDOM document.
    expect(document.documentElement).toHaveAttribute("lang", "en");
  });

  it("head タグ内に正しい meta タグとスタイルシートリンクが含まれている", () => {
    const head = document.head;
    const charsetMeta = head.querySelector('meta[charset="utf-8"]');
    expect(charsetMeta).toBeInTheDocument();

    const viewportMeta = head.querySelector('meta[name="viewport"]');
    expect(viewportMeta).toBeInTheDocument();
    expect(viewportMeta).toHaveAttribute("content", "width=device-width, initial-scale=1");

    const stylesheetLink = head.querySelector(`link[href="${appStylesHref}"]`);
    expect(stylesheetLink).toBeInTheDocument();
    expect(stylesheetLink).toHaveAttribute("rel", "stylesheet");
  });

  it("body タグが子要素を正しく表示する", () => {
    expect(screen.getByText(testChildText)).toBeInTheDocument();
  });

  it("ScrollRestoration コンポーネント (モック) を表示する", () => {
    expect(screen.getByTestId("scroll-restoration-mock")).toBeInTheDocument();
  });

  it("Scripts コンポーネント (モック) を表示する", () => {
    expect(screen.getByTestId("scripts-mock")).toBeInTheDocument();
  });
});
