import type { ContactRecord } from "../../../data";
import { Text } from "@mantine/core";

type Props = {
  contact: Pick<ContactRecord, "notes">;
};

export function ContactNotes({ contact }: Props) {
  if (!contact.notes) {
    return null;
  }

  return <Text test-id="contact-note">{contact.notes}</Text>;
}
