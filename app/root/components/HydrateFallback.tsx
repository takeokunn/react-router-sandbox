import { Center, Loader, Stack, Text } from "@mantine/core";

export function HydrateFallback() {
  return (
    <Center h="100vh" id="loading-splash" data-testid="loading-splash">
      <Stack align="center">
        <Loader data-testid="loading-splash-spinner" />
        <Text>Loading, please wait...</Text>
      </Stack>
    </Center>
  );
}
