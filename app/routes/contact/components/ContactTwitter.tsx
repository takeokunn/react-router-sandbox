import { Anchor, Text } from "@mantine/core";
import type { ContactRecord } from "../../../data";

type Props = {
  contact: Pick<ContactRecord, "twitter">;
};

export function ContactTwitter({ contact }: Props) {
  if (!contact.twitter) {
    return null;
  }

  return (
    <Text test-id="contact-twitter">
      <Anchor href={`https://twitter.com/${contact.twitter}`} target="_blank" rel="noopener noreferrer">
        {contact.twitter}
      </Anchor>
    </Text>
  );
}
