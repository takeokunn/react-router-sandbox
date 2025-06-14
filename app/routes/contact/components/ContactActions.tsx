import { Form } from "react-router";
import type React from "react";

type Props = {
  onDeleteSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function ContactActions({ onDeleteSubmit }: Props) {
  return (
    <>
      <Form action="edit">
        <button type="submit">Edit</button>
      </Form>
      <Form
        action="destroy"
        method="post"
        onSubmit={onDeleteSubmit}
      >
        <button type="submit">Delete</button>
      </Form>
    </>
  );
}
