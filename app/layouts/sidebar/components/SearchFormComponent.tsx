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
      <div aria-hidden hidden={!isSearching} id="search-spinner" data-testid="search-spinner" />
    </form>
  );
}
