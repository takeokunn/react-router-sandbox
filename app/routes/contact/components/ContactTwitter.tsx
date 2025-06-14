import type { ContactRecord } from "../../../data";

type Props = {
  contact: Pick<ContactRecord, "twitter">;
};

export function ContactTwitter({ contact }: Props) {
  if (!contact.twitter) {
    return null;
  }

  return (
    <p>
      <a target="_blank" href={`https://twitter.com/${contact.twitter}`} rel="noopener noreferrer">
        {contact.twitter}
      </a>
    </p>
  );
}
