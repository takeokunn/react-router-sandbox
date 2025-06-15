import { Avatar } from "@mantine/core";
import type { ContactRecord } from "../../../data";

type Props = {
  contact: Pick<ContactRecord, "first" | "last" | "avatar">;
};

export function ContactAvatar({ contact }: Props) {
  const altText =
    contact.first === undefined || contact.last === undefined
      ? "Avatar"
      : `${contact.first} ${contact.last} avatar`.trim();

  const initials = `${contact.first?.[0] || ""}${contact.last?.[0] || ""}`.toUpperCase() || "??";

  return (
    <Avatar src={contact.avatar} alt={altText} radius="xl" size="xl">
      {!contact.avatar && initials}
    </Avatar>
  );
}
