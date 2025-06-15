import { Loader, TextInput } from "@mantine/core";

export type SearchFormComponentProps = {
  initialQuery: string | null;
  isSearching: boolean;
  currentQuery: string;
  onQueryChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function SearchFormComponent({ isSearching, currentQuery, onQueryChange, onSubmit }: SearchFormComponentProps) {
  return (
    <form id="search-form" onChange={onSubmit}>
      <TextInput
        aria-label="Search contacts"
        id="q"
        name="q"
        placeholder="Search"
        type="search"
        onChange={(event) => onQueryChange(event.currentTarget.value)}
        value={currentQuery}
        rightSection={isSearching ? <Loader size="xs" data-testid="search-loader" /> : null}
      />
    </form>
  );
}
