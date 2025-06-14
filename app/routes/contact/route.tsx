import { Form, useFetcher, useLoaderData } from "react-router";
import type { ContactRecord } from "../../data";
// Note: The original Route type import might need adjustment if it was specific to the old file structure.
// For now, assuming useLoaderData will infer correctly from the loader.
// If Route.LoaderArgs or Route.ActionArgs were used directly in the component,
// they would need to be imported from the new loader/action files or a shared type.

export default function Contact() {
  // Assuming the loader's return type is { contact: ContactRecord | null }
  const { contact } = useLoaderData() as { contact: ContactRecord | null };
  if (!contact) {
    // It's conventional for loaders to throw responses, not components.
    // This check might be redundant if the loader handles it.
    // However, keeping it for safety as per original code.
    throw new Response("Not Found", { status: 404 });
  }

  return (
    <div id="contact">
      <div>
        <img
          alt={`${contact.first} ${contact.last} avatar`}
          key={contact.avatar}
          src={contact.avatar ?? undefined} // Handle null avatar
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter ? (
          <p>
            <a
              href={`https://twitter.com/${contact.twitter}`}
            >
              {contact.twitter}
            </a>
          </p>
        ) : null}

        {contact.notes ? <p>{contact.notes}</p> : null}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm("Please confirm you want to delete this record.");
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }: { contact: Pick<ContactRecord, "favorite"> }) {
  const fetcher = useFetcher();
    const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : contact.favorite;

  return (
    <fetcher.Form method="post">
      <button
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
