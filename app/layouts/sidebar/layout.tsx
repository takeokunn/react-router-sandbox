import { Outlet, useLoaderData, useNavigation, useSubmit } from "react-router";
import type { FormProps, NavigateOptions } from "react-router";
import { useEffect, useState } from "react";
import type { TLoader } from "./loader";
// ContactMutation is used by ContactNavList, which is now imported
// So this direct import might not be needed here anymore if not used elsewhere in this file.
// Let's check its usage below. If only used by the props of ContactNavList, it can be removed.
// It is used in ContactNavListProps, which is also imported.
// However, the `contacts` variable destructured from useLoaderData is typed via TLoader,
// and TLoader's return type includes `contacts` which should align with ContactMutation[].
// Let's keep it for now to be safe, or remove it if ContactNavListProps correctly infers/uses it.
// Upon review, ContactNavListProps is imported, and it uses ContactMutation.
// The `contacts` variable in Layout is passed to ContactNavList.
// The type `Awaited<ReturnType<TLoader>>` for useLoaderData should provide the correct type for `contacts`.
// So, `ContactMutation` might not be directly needed here.
// For now, I will remove the direct import of ContactMutation and the local type definitions
// for SearchFormComponentProps and ContactNavListProps as they are now imported.

import { SidebarHeader } from "./components/SidebarHeader";
import { SearchFormComponent } from "./components/SearchFormComponent";
import { NewContactButton } from "./components/NewContactButton";
import { ContactNavList } from "./components/ContactNavList";


export default function Layout() {
  const { contacts, q } = useLoaderData<Awaited<ReturnType<TLoader>>>();
  const navigation = useNavigation();
  const submit = useSubmit();

  const [query, setQuery] = useState<string>(q || "");
  const isSearching: boolean = navigation.location === undefined
    ? false
    : new URLSearchParams(navigation.location.search).has("q");

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
            isSearching={isSearching}
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
