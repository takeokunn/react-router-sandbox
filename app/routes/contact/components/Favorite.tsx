type Props = {
  isFavorite: boolean;
};

export function Favorite({ isFavorite }: Props) {
  return (
    <form method="post">
      <button
        type="submit"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        name="favorite"
        value={isFavorite ? "false" : "true"}
      >
        {isFavorite ? "★" : "☆"}
      </button>
    </form>
  );
}
