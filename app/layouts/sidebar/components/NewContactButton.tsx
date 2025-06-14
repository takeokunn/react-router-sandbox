import { Form } from "react-router";

export function NewContactButton() {
  return (
    <Form method="post">
      <button type="submit">New</button>
    </Form>
  );
}
