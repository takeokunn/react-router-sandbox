import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ContactNotes } from "./ContactNotes";
import type { ContactRecord } from "../../../data";

type ContactNotesProps = Parameters<typeof ContactNotes>[0]['contact'];

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
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toBeNull();
  });

  it("ノートが null の場合、何も表示しない", () => {
    const contact: ContactNotesProps = { notes: null };
    const { container } = renderComponent(contact);
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toBeNull();
  });

  it("ノートが undefined の場合、何も表示しない", () => {
    const contact: ContactNotesProps = { notes: undefined };
    const { container } = renderComponent(contact);
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toBeNull();
  });
});
