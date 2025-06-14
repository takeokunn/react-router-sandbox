import type { ContactRecord } from "../../../data";

type Props = {
  contact: Pick<ContactRecord, "first" | "last" | "avatar">;
};

export function ContactAvatar({ contact }: Props) {
  const altText = contact.first || contact.last
    ? `${contact.first ?? ""} ${contact.last ?? ""} avatar`.trim()
    : "Avatar";

  return (
    <img
      alt={altText}
      key={contact.avatar} // key on avatar URL to force re-render if URL changes
      src={contact.avatar ?? undefined}
    />
  );
}
