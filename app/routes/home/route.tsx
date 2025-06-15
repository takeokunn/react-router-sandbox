import { Anchor, Text } from "@mantine/core";

export default function Home() {
  return (
    <Text id="index-page" p="md">
      This is a demo for React Router.
      <br />
      Check out{" "}
      <Anchor href="https://reactrouter.com" target="_blank" rel="noopener noreferrer">
        the docs at reactrouter.com
      </Anchor>
      .
    </Text>
  );
}
