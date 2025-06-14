import type { ContactRecord } from "../../../data";

type Props = {
  contact: Pick<ContactRecord, "notes">;
};

export function ContactNotes({ contact }: Props) {
  if (!contact.notes) {
    return null;
  }

  return <p>{contact.notes}</p>;
}
