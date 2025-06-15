import { NavLink as MantineNavLink, Stack, Text } from "@mantine/core";
import type { ContactMutation } from "app/data";
import { NavLink as RouterNavLink } from "react-router";
import type { Navigation } from "react-router";

type Props = {
  contacts: ContactMutation[];
  navigationState: Navigation["state"];
};

export function ContactNavList({ contacts, navigationState }: Props) {
  const isLoading = navigationState === "loading";

  return (
    <Stack component="nav" gap="xs">
      {contacts.length ? (
        contacts.map((contact) => {
          const contactName =
            contact.first || contact.last ? `${contact.first || ""} ${contact.last || ""}`.trim() : null;
          const displayName = contactName || <Text component="em">No Name</Text>;
          const label = contact.favorite ? `${contactName || "No Name"} ★` : displayName;

          return (
            <MantineNavLink
              key={contact.id}
              label={label}
              component={RouterNavLink}
              to={`contacts/${contact.id}`}
              disabled={isLoading}
              // Mantine NavLink uses `data-active` for its own active state,
              // react-router's NavLink will handle its active class separately.
              // If a visual cue for loading specifically on the link is needed,
              // custom styling or a different approach might be required.
              // For now, `disabled` will provide some feedback.
            />
          );
        })
      ) : (
        <Text component="em">No contacts</Text>
      )}
    </Stack>
  );
}
