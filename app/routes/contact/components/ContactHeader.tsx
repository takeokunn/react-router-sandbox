import type { ContactRecord } from "../../../data";
import { Favorite } from "./Favorite";

type Props = {
  contact: Pick<ContactRecord, "first" | "last">;
  isFavorite: boolean;
};

export function ContactHeader({ contact, isFavorite }: Props) {
  return (
    <h1>
      {contact.first || contact.last
        ? (<>{contact.first} {contact.last}</>)
        : (<i>No Name</i>)}
      <Favorite isFavorite={isFavorite} />
    </h1>
  );
}
