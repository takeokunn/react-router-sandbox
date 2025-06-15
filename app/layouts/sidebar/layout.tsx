import { AppShell, ScrollArea, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { Outlet, useLoaderData, useNavigation, useSubmit } from "react-router";
import type { SubmitOptions } from "react-router-dom";
import { ContactNavList } from "./components/ContactNavList";
import { NewContactButton } from "./components/NewContactButton";
import { SearchFormComponent } from "./components/SearchFormComponent";
import { SidebarHeader } from "./components/SidebarHeader";
import type { TLoader } from "./loader";

export default function Layout() {
  const { contacts, q } = useLoaderData<Awaited<ReturnType<TLoader>>>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const [opened] = useDisclosure();

  const [query, setQuery] = useState<string>(q || "");
  const isSearching: boolean =
    navigation.location === undefined ? false : new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    setQuery(q || "");
  }, [q]);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const isFirstSearch = q === null;
    submit(event.currentTarget, {
      replace: !isFirstSearch,
    } as SubmitOptions);
  };

  return (
    <AppShell
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Navbar p="md" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <SidebarHeader />
        <Stack gap="sm" my="md">
          <SearchFormComponent
            initialQuery={q}
            isSearching={isSearching}
            currentQuery={query}
            onQueryChange={setQuery}
            onSubmit={handleSearchSubmit}
          />
          <NewContactButton />
        </Stack>
        <ScrollArea style={{ flexGrow: 1 }}>
          <ContactNavList contacts={contacts} navigationState={navigation.state} />
        </ScrollArea>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
