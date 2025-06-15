import { render, screen } from "@testing-utils";
import { describe, expect, it } from "vitest";
import { ContactNotes } from "./ContactNotes";

type ContactNotesProps = Parameters<typeof ContactNotes>[0]["contact"];

describe("ContactNotes コンポーネント", () => {
  const renderComponent = (contactProps: ContactNotesProps) => {
    return render(<ContactNotes contact={contactProps} />);
  };

  it("ノートが指定されている場合、ノートの内容を表示する", () => {
    const notesText = "これはテスト用のノートです。";
    const contact: ContactNotesProps = { notes: notesText };
    renderComponent(contact);

    const paragraphElement = screen.getByText(notesText);
    expect(paragraphElement).toBeInTheDocument();
    expect(paragraphElement.tagName).toBe("P");
  });

  it("ノートが空文字列の場合、何も表示しない", () => {
    const contact: ContactNotesProps = { notes: "" };
    const { container } = renderComponent(contact);
    expect(container.firstChild).toBeNull();
  });

  it("ノートが存在しない場合、何も表示しない", () => {
    const contact: ContactNotesProps = {};
    const { container } = renderComponent(contact);
    expect(container.firstChild).toBeNull();
  });
});
