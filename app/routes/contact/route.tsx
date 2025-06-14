import { Form, useLoaderData } from "react-router";
import { Favorite } from "./components/Favorite";
import type { TLoader } from "./loader";

export default function Contact() {
  const { contact } = useLoaderData<TLoader>();
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }

  return (
    <div id="contact">
      <div>
        <img
          alt={`${contact.first} ${contact.last} avatar`}
          key={contact.avatar}
          src={contact.avatar ?? undefined}
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last
            ? (<>{contact.first} {contact.last}</>)
            : (<i>No Name</i>)}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter
          ? (
            <p>
              <a href={`https://twitter.com/${contact.twitter}`}>{contact.twitter}</a>
            </p>
          )
          : null}

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
