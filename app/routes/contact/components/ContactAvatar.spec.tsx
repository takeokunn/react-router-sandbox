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
    expect(imgElement.hasAttribute("src")).toBe(false);
    expect(imgElement.alt).toBe("John Doe avatar");
  });

  it("アバターURLがなく、名前もない場合、altテキストは「Avatar」になる", () => {
    const contact: ContactAvatarProps = {};
    renderComponent(contact);
    const imgElement = screen.getByRole("img") as HTMLImageElement;
    expect(imgElement).toBeInTheDocument();
    expect(imgElement.hasAttribute("src")).toBe(false);
    expect(imgElement.alt).toBe("Avatar");
  });

  it("名のみが指定されている場合、altテキストは「Avatar」になる", () => {
    const contact: ContactAvatarProps = {
      first: "John",
      avatar: "https://example.com/avatar.jpg",
    };
    renderComponent(contact);
    const imgElement = screen.getByRole("img") as HTMLImageElement;
    console.log(imgElement.alt);
    expect(imgElement.alt).toBe("Avatar");
  });

  it("姓のみが指定されている場合、altテキストは「Avatar」になる", () => {
    const contact: ContactAvatarProps = {
      last: "Doe",
      avatar: "https://example.com/avatar.jpg",
    };
    renderComponent(contact);
    const imgElement = screen.getByRole("img") as HTMLImageElement;
    expect(imgElement.alt).toBe("Avatar");
  });
});
