import type React from "react";

type Props = {
  onDeleteSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function ContactActions({ onDeleteSubmit }: Props) {
  return (
    <>
      <form action="edit">
        <button type="submit">Edit</button>
      </form>
      <form
        action="destroy"
        method="post"
        onSubmit={onDeleteSubmit}
      >
        <button type="submit">Delete</button>
      </form>
    </>
  );
}
