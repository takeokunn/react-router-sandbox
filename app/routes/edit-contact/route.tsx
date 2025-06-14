import { useLoaderData, useNavigate } from "react-router";

import type { ContactRecord } from "../../data";

export default function EditContact() {
  const { contact } = useLoaderData() as { contact: ContactRecord };
  const navigate = useNavigate();

  return (
    <form key={contact.id} id="contact-form" method="post" role="form">
      <p>
        <span>Name</span>
        <input
          aria-label="First name"
          defaultValue={contact.first ?? ""}
          name="first"
          placeholder="First"
          type="text"
        />
        <input
          aria-label="Last name"
          defaultValue={contact.last ?? ""}
          name="last"
          placeholder="Last"
          type="text"
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          defaultValue={contact.twitter ?? ""}
          name="twitter"
          placeholder="@jack"
          type="text"
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          aria-label="Avatar URL"
          defaultValue={contact.avatar ?? ""}
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
          type="text"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea
          defaultValue={contact.notes ?? ""}
          name="notes"
          rows={6}
        />
      </label>
      <p>
        <button type="submit">Save</button>
        <button onClick={() => navigate(-1)} type="button">Cancel</button>
      </p>
    </form>
  );
}
