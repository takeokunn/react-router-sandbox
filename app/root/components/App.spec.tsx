import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router";
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
      </MemoryRouter>
    );

    expect(screen.getByText("子ルートのコンテンツ")).toBeInTheDocument();
  });
});
