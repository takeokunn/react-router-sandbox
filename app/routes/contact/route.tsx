import { useLoaderData } from "react-router";
import type { TLoader } from "./loader";
import { ContactAvatar } from "./components/ContactAvatar";
import { ContactHeader } from "./components/ContactHeader";
import { ContactTwitter } from "./components/ContactTwitter";
import { ContactNotes } from "./components/ContactNotes";
import { ContactActions } from "./components/ContactActions";

export default function Contact() {
  const { contact } = useLoaderData<TLoader>();
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }

  const currentFavorite = contact.favorite || false;

  const handleDeleteSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const response = confirm("Please confirm you want to delete this record.");
    if (!response) {
      event.preventDefault();
    }
  };

  return (
    <div id="contact">
      <div>
        <ContactAvatar contact={contact} />
      </div>

      <div>
        <ContactHeader
          contact={contact}
          isFavorite={currentFavorite}
        />
        <ContactTwitter contact={contact} />
        <ContactNotes contact={contact} />
        <div>
          <ContactActions onDeleteSubmit={handleDeleteSubmit} />
        </div>
      </div>
    </div>
  );
}
