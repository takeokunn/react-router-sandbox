import { getContact } from "../../data";
import type { Route } from "./+types";

export async function loader({ params }: Route.LoaderArgs) {
  const contact = await getContact(params.contactId);
  return { contact };
}
