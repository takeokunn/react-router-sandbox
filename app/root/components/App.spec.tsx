import { render, screen } from "@testing-utils";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";
import App from "./App";

function ChildRouteComponent() {
  return <div>子ルートのコンテンツ</div>;
}

describe("App コンポーネント", () => {
  it("Outlet を介して子ルートのコンテンツを正しく表示する", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<ChildRouteComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("子ルートのコンテンツ")).toBeInTheDocument();
  });
});
