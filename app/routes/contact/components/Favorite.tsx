import type React from "react";

type FavoriteProps = {
  isFavorite: boolean;
  FavoriteForm: React.ElementType; // Will be fetcher.Form passed from parent
};

export function Favorite({ isFavorite, FavoriteForm }: FavoriteProps) {
  return (
    <FavoriteForm method="post">
      <button
        aria-label={
          isFavorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
        name="favorite"
        value={isFavorite ? "false" : "true"}
      >
        {isFavorite ? "★" : "☆"}
      </button>
    </FavoriteForm>
  );
}
