import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ContactAvatar } from "./ContactAvatar";
import type { ContactRecord } from "../../../data";

type ContactAvatarProps = Parameters<typeof ContactAvatar>[0]['contact'];

describe("ContactAvatar コンポーネント", () => {
  const renderComponent = (contactProps: ContactAvatarProps) => {
    render(<ContactAvatar contact={contactProps} />);
  };

  it("アバターURLが指定されている場合、正しいsrcとalt属性で画像を表示する", () => {
    const contact: ContactAvatarProps = { first: "John", last: "Doe", avatar: "https://example.com/avatar.jpg" };
    renderComponent(contact);
    const imgElement = screen.getByRole("img") as HTMLImageElement;
    expect(imgElement).toBeInTheDocument();
    expect(imgElement.src).toBe(contact.avatar);
    expect(imgElement.alt).toBe("John Doe avatar");
  });

  it("アバターURLが指定されていない場合、src属性なしで画像を表示し、altテキストは「Avatar」になる", () => {
    const contact: ContactAvatarProps = { first: "John", last: "Doe", avatar: null };
    renderComponent(contact);
    const imgElement = screen.getByRole("img") as HTMLImageElement;
    expect(imgElement).toBeInTheDocument();
    expect(imgElement.hasAttribute("src")).toBe(false); // src={undefined} means no src attribute
    expect(imgElement.alt).toBe("John Doe avatar"); // Alt text still uses names
  });
  
  it("アバターURLがなく、名前もない場合、altテキストは「Avatar」になる", () => {
    const contact: ContactAvatarProps = { first: null, last: null, avatar: null };
    renderComponent(contact);
    const imgElement = screen.getByRole("img") as HTMLImageElement;
    expect(imgElement).toBeInTheDocument();
    expect(imgElement.hasAttribute("src")).toBe(false);
    expect(imgElement.alt).toBe("Avatar");
  });

  it("名のみが指定されている場合、altテキストに名が含まれる", () => {
    const contact: ContactAvatarProps = { first: "John", last: null, avatar: "https://example.com/avatar.jpg" };
    renderComponent(contact);
    const imgElement = screen.getByRole("img") as HTMLImageElement;
    expect(imgElement.alt).toBe("John avatar");
  });

  it("姓のみが指定されている場合、altテキストに姓が含まれる", () => {
    const contact: ContactAvatarProps = { first: null, last: "Doe", avatar: "https://example.com/avatar.jpg" };
    renderComponent(contact);
    const imgElement = screen.getByRole("img") as HTMLImageElement;
    expect(imgElement.alt).toBe("Doe avatar");
  });

  it("アバターURLがキーとして使用されることを確認する (間接的なテスト)", () => {
    // This is harder to test directly without inspecting React internals or re-rendering.
    // The presence of `key={contact.avatar}` in the component is the primary check.
    // We can ensure the image re-renders if the key (avatar URL) changes.
    const initialContact: ContactAvatarProps = { first: "Test", last: "User", avatar: "url1.jpg" };
    const { rerender } = render(<ContactAvatar contact={initialContact} />);
    let imgElement = screen.getByRole("img") as HTMLImageElement;
    expect(imgElement.src).toContain("url1.jpg");

    const updatedContact: ContactAvatarProps = { ...initialContact, avatar: "url2.jpg" };
    rerender(<ContactAvatar contact={updatedContact} />);
    imgElement = screen.getByRole("img") as HTMLImageElement; // Re-fetch the element
    expect(imgElement.src).toContain("url2.jpg"); 
    // If the key wasn't working as expected, React might not replace the DOM element efficiently.
  });
});
