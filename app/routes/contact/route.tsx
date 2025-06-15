import { Group, Paper, Stack } from "@mantine/core";
import { useLoaderData } from "react-router";
import { ContactActions } from "./components/ContactActions";
import { ContactAvatar } from "./components/ContactAvatar";
import { ContactHeader } from "./components/ContactHeader";
import { ContactNotes } from "./components/ContactNotes";
import { ContactTwitter } from "./components/ContactTwitter";
import type { TLoader } from "./loader";

export default function Contact() {
  const { contact } = useLoaderData<TLoader>();
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }

  const currentFavorite = contact.favorite || false;

  const handleDeleteSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const response = confirm("Please confirm you want to delete this record.");
    if (!response) {
      event.preventDefault();
    }
  };

  return (
    <Paper p="md" shadow="xs" id="contact">
      <Group align="flex-start">
        <Stack>
          <ContactAvatar contact={contact} />
        </Stack>

        <Stack gap="sm" style={{ flexGrow: 1 }}>
          <ContactHeader contact={contact} isFavorite={currentFavorite} />
          <ContactTwitter contact={contact} />
          <ContactNotes contact={contact} />
          <Group mt="md">
            <ContactActions onDeleteSubmit={handleDeleteSubmit} />
          </Group>
        </Stack>
      </Group>
    </Paper>
  );
}
