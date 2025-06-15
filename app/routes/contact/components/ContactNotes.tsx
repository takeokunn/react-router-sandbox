import { Text } from "@mantine/core";
import type { ContactRecord } from "../../../data";

type Props = {
  contact: Pick<ContactRecord, "notes">;
};

export function ContactNotes({ contact }: Props) {
  if (!contact.notes) {
    return null;
  }

  return <Text test-id="contact-note">{contact.notes}</Text>;
}
