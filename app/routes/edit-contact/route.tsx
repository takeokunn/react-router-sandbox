import { Box, Button, Group, Stack, Textarea, TextInput } from "@mantine/core";
import { useLoaderData, useNavigate } from "react-router";

import type { ContactRecord } from "../../data";

export default function EditContact() {
  const { contact } = useLoaderData() as { contact: ContactRecord };
  const navigate = useNavigate();

  return (
    <Box
      component="form"
      key={contact.id}
      id="contact-form" // Keep ID if it's used by CSS not yet migrated or for other purposes
      method="post"
      aria-label="Edit contact"
      // maw={rem(640)} // max-width: 40rem (640px), can be set via sx or style
    >
      <Stack gap="md">
        <Group grow>
          <TextInput
            label="First name"
            aria-label="First name"
            defaultValue={contact.first ?? ""}
            name="first"
            placeholder="First"
          />
          <TextInput
            label="Last name"
            aria-label="Last name"
            defaultValue={contact.last ?? ""}
            name="last"
            placeholder="Last"
          />
        </Group>
        <TextInput
          label="Twitter"
          defaultValue={contact.twitter ?? ""}
          name="twitter"
          placeholder="@jack"
        />
        <TextInput
          label="Avatar URL"
          aria-label="Avatar URL"
          defaultValue={contact.avatar ?? ""}
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
        />
        <Textarea
          label="Notes"
          defaultValue={contact.notes ?? ""}
          name="notes"
          rows={6}
        />
        <Group justify="flex-start" mt="md">
          {" "}
          {/* mt="md" for margin-top, adjust as needed */}
          <Button type="submit">Save</Button>
          <Button variant="default" onClick={() => navigate(-1)} type="button">
            Cancel
          </Button>
        </Group>
      </Stack>
    </Box>
  );
}
