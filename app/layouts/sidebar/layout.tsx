import { Form, Link, NavLink, Outlet, useLoaderData, useNavigation, useSubmit, NavLinkProps } from "react-router";
import type { FormProps, NavigateOptions } from "react-router";
import { useEffect, useState } from "react";
import { loader } from "./loader";

// Define a local Contact type based on what's used in this component
type Contact = {
  id: string;
  first?: string | null;
  last?: string | null;
  favorite?: boolean | null;
};

// Infer the return type of the loader for more precise props
type LoaderData = Awaited<ReturnType<typeof loader>>;

function SidebarHeader() {
  return (
    <h1>
      <Link to="about">React Router Contacts</Link>
    </h1>
  );
}

type SearchFormComponentProps = {
  initialQuery: string | null;
  isSearching: boolean;
  currentQuery: string;
  onQueryChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

function SearchFormComponent({
  isSearching,
  currentQuery,
  onQueryChange,
  onSubmit,
}: SearchFormComponentProps) {
  return (
    <Form id="search-form" role="search" onChange={onSubmit}>
      <input
        aria-label="Search contacts"
        className={isSearching ? "loading" : ""}
        id="q"
        name="q"
        placeholder="Search"
        type="search"
        onChange={(event) => onQueryChange(event.currentTarget.value)}
        value={currentQuery}
      />
      <div aria-hidden hidden={!isSearching} id="search-spinner" />
    </Form>
  );
}

function NewContactButton() {
  return (
    <Form method="post">
      <button type="submit">New</button>
    </Form>
  );
}

type ContactNavListProps = {
  contacts: Contact[];
  navigationState: ReturnType<typeof useNavigation>['state'];
};

function ContactNavList({ contacts, navigationState }: ContactNavListProps) {
  return (
    <nav>
      {contacts.length ? (
        <ul>
          {contacts.map((contact) => (
            <li key={contact.id}>
              <NavLink
                className={navigationState === "loading" ? "loading" : ""}
                to={`contacts/${contact.id}`}
              >
                {contact.first || contact.last ? (
                  <>
                    {contact.first} {contact.last}
                  </>
                ) : (
                  <i>No Name</i>
                )}
                {contact.favorite ? <span>★</span> : null}
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
  );
}

export default function Layout() {
  const { contacts, q } = useLoaderData<LoaderData>();
  const [query, setQuery] = useState(q || "");
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching = navigation.location && new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    setQuery(q || "");
  }, [q]);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const isFirstSearch = q === null;
    submit(event.currentTarget, { replace: !isFirstSearch } as NavigateOptions & {
      formData: FormProps["encType"] extends "multipart/form-data" ? FormData : URLSearchParams;
    });
  };

  return (
    <>
      <div id="sidebar">
        <SidebarHeader />
        <div>
          <SearchFormComponent
            initialQuery={q}
            isSearching={searching}
            currentQuery={query}
            onQueryChange={setQuery}
            onSubmit={handleSearchSubmit}
          />
          <NewContactButton />
        </div>
        <ContactNavList contacts={contacts} navigationState={navigation.state} />
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
