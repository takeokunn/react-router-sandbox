import { render, screen } from "@testing-utils";
import { describe, expect, it } from "vitest";
import { ContactAvatar } from "./ContactAvatar";

type ContactAvatarProps = Parameters<typeof ContactAvatar>[0]["contact"];

describe("ContactAvatar コンポーネント", () => {
  const renderComponent = (contactProps: ContactAvatarProps) => {
    return render(<ContactAvatar contact={contactProps} />);
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
    expect(screen.queryByText("JD")).not.toBeInTheDocument();
  });

  it("アバターURLが指定されていない場合、フォールバックとしてイニシャル「JD」を表示し、altテキストは「John Doe avatar」になる", () => {
    const contact: ContactAvatarProps = { first: "John", last: "Doe" };
    const { container } = renderComponent(contact);
    expect(screen.getByText("JD")).toBeInTheDocument();

    const placeholderSpan = screen.getByTitle("John Doe avatar");
    expect(placeholderSpan).toBeInTheDocument();
    expect(placeholderSpan.tagName).toBe("SPAN");
    expect(placeholderSpan).toHaveTextContent("JD");
    expect(container.querySelector('img[alt="John Doe avatar"]')).toBeNull();
  });

  it("アバターURLがなく、名前もない場合、フォールバック「??」が表示され、altテキストは「Avatar」になる", () => {
    const contact: ContactAvatarProps = {};
    const { container } = renderComponent(contact);

    expect(screen.getByText("??")).toBeInTheDocument();

    const placeholderSpan = screen.getByTitle("Avatar");
    expect(placeholderSpan).toBeInTheDocument();
    expect(placeholderSpan.tagName).toBe("SPAN");
    expect(placeholderSpan).toHaveTextContent("??");
    expect(container.querySelector('img[alt="Avatar"]')).toBeNull();
  });

  it("アバターURLが指定され、名のみの場合、画像を表示し、altテキストは「Avatar」になる（フォールバックなし）", () => {
    const contact: ContactAvatarProps = {
      first: "John",
      avatar: "https://example.com/avatar.jpg",
    };
    renderComponent(contact);

    const imgElement = screen.getByRole("img", { name: "Avatar" }) as HTMLImageElement;
    expect(imgElement).toBeInTheDocument();
    expect(imgElement.tagName).toBe("IMG");
    expect(imgElement.src).toBe(contact.avatar);
    expect(screen.queryByText("J")).not.toBeInTheDocument();
  });

  it("アバターURLが指定され、姓のみの場合、画像を表示し、altテキストは「Avatar」になる（フォールバックなし）", () => {
    const contact: ContactAvatarProps = {
      last: "Doe",
      avatar: "https://example.com/avatar.jpg",
    };
    renderComponent(contact);

    const imgElement = screen.getByRole("img", { name: "Avatar" }) as HTMLImageElement;
    expect(imgElement).toBeInTheDocument();
    expect(imgElement.tagName).toBe("IMG");
    expect(imgElement.src).toBe(contact.avatar);
    expect(screen.queryByText("D")).not.toBeInTheDocument();
  });
});
