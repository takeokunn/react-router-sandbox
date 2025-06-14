import { redirect } from "react-router";
import { createEmptyContact } from "../data";

export async function action() {
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
}
