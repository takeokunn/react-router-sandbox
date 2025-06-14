import { redirect } from "react-router";
import { updateContact } from "../../data";
import invariant from "tiny-invariant";
import type { Route } from "../../+types/edit-contact"; // Assuming +types is relative to app/

export async function action({ params, request }: Route.ActionArgs) {
  invariant(params.contactId, "Missing contactId param");
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
}
