import { Group, Title } from "@mantine/core";
import type { ContactRecord } from "../../../data";
import { Favorite } from "./Favorite";

type Props = {
  contact: Pick<ContactRecord, "first" | "last">;
  isFavorite: boolean;
};

export function ContactHeader({ contact, isFavorite }: Props) {
  return (
    <Group component="h1" wrap="nowrap" gap="sm" align="center">
      <Title order={2} style={{ whiteSpace: "nowrap" }}>
        {contact.first || contact.last ? `${contact.first || ""} ${contact.last || ""}`.trim() : <i>No Name</i>}
      </Title>
      <Favorite isFavorite={isFavorite} />
    </Group>
  );
}
