import { Form } from "react-router";

export function ContactActions() {
  return (
    <>
      <Form action="edit">
        <button type="submit">Edit</button>
      </Form>
      <Form
        action="destroy"
        method="post"
        onSubmit={(event) => {
          const response = confirm(
            "Please confirm you want to delete this record."
          );
          if (!response) {
            event.preventDefault();
          }
        }}
      >
        <button type="submit">Delete</button>
      </Form>
    </>
  );
}
