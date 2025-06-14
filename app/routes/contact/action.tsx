import { updateContact } from "../../data";
import type { Route } from "./+types";

export async function action({ params, request }: Route.ActionArgs) {
  const formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
}
