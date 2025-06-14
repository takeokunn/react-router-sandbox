import { Form, Link, NavLink, Outlet, useLoaderData, useNavigation, useSubmit } from "react-router";
import { useEffect, useState } from "react";
import { getContacts } from "../data";
import type { Route } from "../+types/root";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);

  return { contacts, q };
}

export default function SidebarLayout() {
  const { contacts, q } = useLoaderData()
  const [query, setQuery] = useState(q || "");
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching = navigation.location && new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    setQuery(q || "")
  }, [q]);

  return (
    <>
      <div id="sidebar">
        <h1>
          <Link to="about">React Router Contacts</Link>
        </h1>
        <div>
          <Form
            id="search-form"
            role="search"
            onChange={(event) => {
              const isFirstSearch = q === null;
              submit(event.currentTarget, { replace: !isFirstSearch })
            }}>
            <input
              aria-label="Search contacts"
              className={searching ? "loading" : ""}
              id="q"
              name="q"
              placeholder="Search"
              type="search"
              onChange={(event) => setQuery(event.currentTarget.value)}
              value={query}
            />
            <div
              aria-hidden
              hidden={!searching}
              id="search-spinner"
            />
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    className={navigation.state === "loading" ? "loading" : ""}
                    to={`contacts/${contact.id}`}
                  >
                    {contact.first || contact.last
                      ? (<>{contact.first} {contact.last}</>)
                      : (<i>No Name</i>)}
                    {contact.favorite ? (<span>★</span>) : null}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
