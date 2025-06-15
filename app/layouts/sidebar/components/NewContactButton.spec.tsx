import { render, screen } from "testing-utils";
import { type RouteObject, RouterProvider, createMemoryRouter } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";
import { NewContactButton } from "./NewContactButton";

describe("NewContactButton コンポーネント", () => {
  const routes: RouteObject[] = [
    {
      path: "/",
      element: <NewContactButton />,
      action: () => null,
    },
  ];
  const router = createMemoryRouter(routes, { initialEntries: ["/"] });

  beforeEach(() => {
    render(<RouterProvider router={router} />);
  });

  it("「新規」ボタンを表示する", () => {
    const buttonElement = screen.getByRole("button", { name: /New/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveAttribute("type", "submit");
  });

  it("methodが'post'のフォームを表示する", () => {
    const buttonElement = screen.getByRole("button", { name: /New/i });
    const formElement = buttonElement.closest("form");
    expect(formElement).toBeInTheDocument();
    expect(formElement).toHaveAttribute("method", "post");
  });
});
