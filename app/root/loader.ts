import { getContacts } from "../data";

export async function loader() {
  const contacts = await getContacts();
  return { contacts };
}
