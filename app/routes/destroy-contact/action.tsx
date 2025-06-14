import { redirect } from "react-router";
import type { Route } from "../../+types/destroy-contact"; // Assuming +types is relative to app/

import { deleteContact } from "../../data";

export async function action({ params }: Route.ActionArgs) {
  await deleteContact(params.contactId);
  return redirect("/");
}
