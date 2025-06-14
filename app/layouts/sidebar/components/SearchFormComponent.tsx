import { Form } from "react-router";

export type SearchFormComponentProps = {
  initialQuery: string | null;
  isSearching: boolean;
  currentQuery: string;
  onQueryChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function SearchFormComponent({
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
