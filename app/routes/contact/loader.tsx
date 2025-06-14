import { getContact } from "../../data";
import type { Route } from "../../+types/contact"; // Assuming +types is relative to app/

export async function loader({ params }: Route.LoaderArgs) {
  const contact = await getContact(params.contactId);
  return { contact };
}
