import { redirect } from "react-router";
import invariant from "tiny-invariant";

import { updateContact } from "../../data";
import type { Route } from "./+types";

export async function action({ params, request }: Route.ActionArgs) {
  invariant(params.contactId, "Missing contactId param");
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
}
