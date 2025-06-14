import { getContact } from "../../data";
import type { Route } from "../../+types/edit-contact"; // Assuming +types is relative to app/

export async function loader({ params }: Route.LoaderArgs) {
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  return { contact };
}
