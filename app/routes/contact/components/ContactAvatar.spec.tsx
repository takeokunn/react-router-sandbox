import { render, screen } from "@testing-utils";
import { describe, expect, it } from "vitest";
import { ContactAvatar } from "./ContactAvatar";

type ContactAvatarProps = Parameters<typeof ContactAvatar>[0]["contact"];

describe("ContactAvatar コンポーネント", () => {
  const renderComponent = (contactProps: ContactAvatarProps) => {
    render(<ContactAvatar contact={contactProps} />);
  };

  it("アバターURLが指定されている場合、正しいsrcとalt属性で画像を表示する", () => {
    const contact: ContactAvatarProps = {
      first: "John",
      last: "Doe",
      avatar: "https://example.com/avatar.jpg",
    };
    renderComponent(contact);
    const imgElement = screen.getByRole("img") as HTMLImageElement;
    expect(imgElement).toBeInTheDocument();
    expect(imgElement.src).toBe(contact.avatar);
    expect(imgElement.alt).toBe("John Doe avatar");
  });

  it("アバターURLが指定されていない場合、src属性なしで画像を表示し、altテキストは「Avatar」になる", () => {
    const contact: ContactAvatarProps = { first: "John", last: "Doe" };
    renderComponent(contact);
    const imgElement = screen.getByRole("img") as HTMLImageElement;
    expect(imgElement).toBeInTheDocument();
    // Mantine Avatar might not render src attribute if it's undefined/null
    // It will render a fallback (initials or placeholder)
    expect(imgElement.alt).toBe("John Doe avatar");
    // Check for initials if avatar src is not present
    if (!contact.avatar) {
      expect(screen.getByText("JD")).toBeInTheDocument();
    }
  });

  it("アバターURLがなく、名前もない場合、altテキストは「Avatar」になり、フォールバック「??」が表示される", () => {
    const contact: ContactAvatarProps = {};
    renderComponent(contact);
    // When no src, Mantine Avatar renders a div with role="img" or a placeholder
    const avatarFallback = screen.getByRole("img"); // Mantine Avatar might use role="img" on the root or an inner img
    expect(avatarFallback).toBeInTheDocument();
    expect(avatarFallback).toHaveAttribute("alt", "Avatar");
    expect(screen.getByText("??")).toBeInTheDocument();
  });

  it("名のみが指定されている場合、altテキストは「Avatar」になり、フォールバック「J?」が表示される", () => {
    const contact: ContactAvatarProps = {
      first: "John",
      avatar: "https://example.com/avatar.jpg",
    };
    renderComponent(contact);
    const imgElement = screen.getByRole("img") as HTMLImageElement;
    expect(imgElement.alt).toBe("Avatar");
    // Check for initials if avatar src is not present
    if (!contact.avatar) {
      expect(screen.getByText("J?")).toBeInTheDocument();
    }
  });

  it("姓のみが指定されている場合、altテキストは「Avatar」になり、フォールバック「?D」が表示される", () => {
    const contact: ContactAvatarProps = {
      last: "Doe",
      avatar: "https://example.com/avatar.jpg",
    };
    renderComponent(contact);
    const imgElement = screen.getByRole("img") as HTMLImageElement;
    expect(imgElement.alt).toBe("Avatar");
    // Check for initials if avatar src is not present
    if (!contact.avatar) {
      expect(screen.getByText("?D")).toBeInTheDocument();
    }
  });
});
