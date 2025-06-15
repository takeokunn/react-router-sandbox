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
    const imgElement = screen.getByRole("img", { name: "John Doe avatar" }) as HTMLImageElement;
    expect(imgElement).toBeInTheDocument();
    expect(imgElement.tagName).toBe("IMG");
    expect(imgElement.src).toBe(contact.avatar);
    // Initials should not be present if avatar src is provided
    expect(screen.queryByText("JD")).not.toBeInTheDocument();
  });

  it("アバターURLが指定されていない場合、フォールバックとしてイニシャル「JD」を表示し、altテキストは「John Doe avatar」になる", () => {
    const contact: ContactAvatarProps = { first: "John", last: "Doe" }; // No avatar URL
    renderComponent(contact);
    const avatarElement = screen.getByRole("img", { name: "John Doe avatar" });
    expect(avatarElement).toBeInTheDocument();
    // Should be a fallback (e.g., div), not an img tag with a src
    expect(avatarElement.tagName).not.toBe("IMG");
    expect(avatarElement.getAttribute("src")).toBeNull();
    // Check for initials because avatar src is not present
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("アバターURLがなく、名前もない場合、フォールバック「??」が表示され、altテキストは「Avatar」になる", () => {
    const contact: ContactAvatarProps = {}; // No avatar URL, no names
    renderComponent(contact);
    const avatarElement = screen.getByRole("img", { name: "Avatar" });
    expect(avatarElement).toBeInTheDocument();
    expect(avatarElement.tagName).not.toBe("IMG");
    expect(avatarElement.getAttribute("src")).toBeNull();
    expect(screen.getByText("??")).toBeInTheDocument();
  });

  it("アバターURLが指定され、名のみの場合、画像を表示し、altテキストは「Avatar」になる（フォールバックなし）", () => {
    const contact: ContactAvatarProps = {
      first: "John",
      avatar: "https://example.com/avatar.jpg", // Avatar URL is present
    };
    renderComponent(contact);
    // altText is "Avatar" because last name is missing
    const imgElement = screen.getByRole("img", { name: "Avatar" }) as HTMLImageElement;
    expect(imgElement).toBeInTheDocument();
    expect(imgElement.tagName).toBe("IMG");
    expect(imgElement.src).toBe(contact.avatar);
    // Initials "J" should not be present because avatar src is provided
    expect(screen.queryByText("J")).not.toBeInTheDocument();
  });

  it("アバターURLが指定され、姓のみの場合、画像を表示し、altテキストは「Avatar」になる（フォールバックなし）", () => {
    const contact: ContactAvatarProps = {
      last: "Doe",
      avatar: "https://example.com/avatar.jpg", // Avatar URL is present
    };
    renderComponent(contact);
    // altText is "Avatar" because first name is missing
    const imgElement = screen.getByRole("img", { name: "Avatar" }) as HTMLImageElement;
    expect(imgElement).toBeInTheDocument();
    expect(imgElement.tagName).toBe("IMG");
    expect(imgElement.src).toBe(contact.avatar);
    // Initials "D" should not be present because avatar src is provided
    expect(screen.queryByText("D")).not.toBeInTheDocument();
  });
});
