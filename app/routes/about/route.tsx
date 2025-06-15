import { Anchor, List, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router";

export default function About() {
  return (
    <Stack id="about" p="md">
      <Anchor component={Link} to="/">
        ← Go to demo
      </Anchor>
      <Title order={1}>About React Router Contacts</Title>

      <Stack gap="md">
        <Text>
          This is a demo application showing off some of the powerful features of React Router, including dynamic
          routing, nested routes, loaders, actions, and more.
        </Text>

        <Title order={2}>Features</Title>
        <Text>Explore the demo to see how React Router handles:</Text>
        <List>
          <List.Item>Data loading and mutations with loaders and actions</List.Item>
          <List.Item>Nested routing with parent/child relationships</List.Item>
          <List.Item>URL-based routing with dynamic segments</List.Item>
          <List.Item>Pending and optimistic UI</List.Item>
        </List>

        <Title order={2}>Learn More</Title>
        <Text>
          Check out the official documentation at{" "}
          <Anchor href="https://reactrouter.com" target="_blank" rel="noopener noreferrer">
            reactrouter.com
          </Anchor>{" "}
          to learn more about building great web applications with React Router.
        </Text>
      </Stack>
    </Stack>
  );
}
