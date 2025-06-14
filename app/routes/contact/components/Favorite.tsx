import { Form } from "react-router";

type Props = {
  isFavorite: boolean;
};

export function Favorite({ isFavorite }: Props) {
  return (
    <Form method="post">
      <button
        type="submit"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        name="favorite"
        value={isFavorite ? "false" : "true"}
      >
        {isFavorite ? "★" : "☆"}
      </button>
    </Form>
  );
}
