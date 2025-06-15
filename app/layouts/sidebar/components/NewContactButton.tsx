import { Button } from "@mantine/core";
import { Form } from "react-router";

export function NewContactButton() {
  return (
    <Form method="post">
      <Button type="submit">New</Button>
    </Form>
  );
}
