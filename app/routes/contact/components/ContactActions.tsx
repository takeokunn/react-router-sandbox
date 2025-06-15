import { Button, Group } from "@mantine/core";
import type React from "react";
import { Form } from "react-router";

type Props = {
  onDeleteSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function ContactActions({ onDeleteSubmit }: Props) {
  return (
    <Group>
      <Form action="edit">
        <Button type="submit">Edit</Button>
      </Form>
      <Form action="destroy" method="post" onSubmit={onDeleteSubmit}>
        <Button type="submit" color="red">
          Delete
        </Button>
      </Form>
    </Group>
  );
}
