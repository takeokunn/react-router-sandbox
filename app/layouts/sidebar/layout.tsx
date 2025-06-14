import { Outlet, useLoaderData, useNavigation, useSubmit } from "react-router";
import type { FormProps, NavigateOptions } from "react-router";
import { useEffect, useState } from "react";
import type { TLoader } from "./loader";
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
