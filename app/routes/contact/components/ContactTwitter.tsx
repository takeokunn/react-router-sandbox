import type { ContactRecord } from "../../../data";
import { Anchor, Text } from "@mantine/core";

type Props = {
  contact: Pick<ContactRecord, "twitter">;
};

export function ContactTwitter({ contact }: Props) {
  if (!contact.twitter) {
    return null;
  }

  return (
    <Text>
      <Anchor
        href={`https://twitter.com/${contact.twitter}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {contact.twitter}
      </Anchor>
    </Text>
  );
}
