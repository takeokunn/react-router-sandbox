import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContactTwitter } from "./ContactTwitter";

type ContactTwitterProps = Parameters<typeof ContactTwitter>[0]["contact"];

describe("ContactTwitter コンポーネント", () => {
  const renderComponent = (contactProps: ContactTwitterProps) => {
    return render(<ContactTwitter contact={contactProps} />);
  };

  it("Twitter ハンドルが指定されている場合、正しいリンクを表示する", () => {
    const contact: ContactTwitterProps = { twitter: "johndoe" };
    renderComponent(contact);

    const linkElement = screen.getByRole("link", { name: "johndoe" });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "https://twitter.com/johndoe");
    expect(linkElement).toHaveAttribute("target", "_blank");
    expect(linkElement).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("Twitter ハンドルが空文字列の場合、何も表示しない", () => {
    const contact: ContactTwitterProps = { twitter: "" };
    const { container } = renderComponent(contact);
    expect(container.firstChild).toBeNull();
  });

  it("Twitter ハンドルが存在しない場合、何も表示しない", () => {
    const contact: ContactTwitterProps = {};
    const { container } = renderComponent(contact);
    expect(container.firstChild).toBeNull();
  });
});
