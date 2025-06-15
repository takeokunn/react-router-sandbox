import { ActionIcon } from "@mantine/core";
import { Form } from "react-router";

type Props = {
  isFavorite: boolean;
};

export function Favorite({ isFavorite }: Props) {
  return (
    <Form method="post">
      <ActionIcon
        type="submit"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        name="favorite"
        value={isFavorite ? "false" : "true"}
        variant="transparent" // Use transparent or other variants as needed
        color={isFavorite ? "yellow" : "gray"} // Example colors
      >
        {isFavorite ? "★" : "☆"}
      </ActionIcon>
    </Form>
  );
}
