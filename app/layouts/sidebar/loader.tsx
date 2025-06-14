import { getContacts } from "../../data";
import type { Route } from "../../+types/root";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);

  return { contacts, q };
}

export type TLoader = typeof loader
