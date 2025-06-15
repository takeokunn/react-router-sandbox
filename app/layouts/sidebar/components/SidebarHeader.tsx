import { Anchor, Title } from "@mantine/core";
import { Link as RouterLink } from "react-router";

export function SidebarHeader() {
  return (
    <Title order={1}>
      <Anchor component={RouterLink} to="about" underline="hover">
        React Router Contacts
      </Anchor>
    </Title>
  );
}
