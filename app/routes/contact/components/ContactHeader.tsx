import type { ContactRecord } from "../../../data";
import { Favorite } from "./Favorite";

type Props = {
  contact: Pick<ContactRecord, "first" | "last" | "favorite">;
};

export function ContactHeader({ contact }: Props) {
  return (
    <h1>
      {contact.first || contact.last
        ? (<>{contact.first} {contact.last}</>)
        : (<i>No Name</i>)}
      <Favorite contact={contact} />
    </h1>
  );
}
