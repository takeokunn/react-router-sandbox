import type React from "react";
import type { ContactRecord } from "../../../data";
import { Favorite } from "./Favorite";

type Props = {
  contact: Pick<ContactRecord, "first" | "last">; // Favorite is now handled by parent
  isFavorite: boolean;
  FavoriteForm: React.ElementType;
};

export function ContactHeader({ contact, isFavorite, FavoriteForm }: Props) {
  return (
    <h1>
      {contact.first || contact.last
        ? (<>{contact.first} {contact.last}</>)
        : (<i>No Name</i>)}
      <Favorite isFavorite={isFavorite} FavoriteForm={FavoriteForm} />
    </h1>
  );
}
