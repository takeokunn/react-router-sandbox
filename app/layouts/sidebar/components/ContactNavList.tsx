import type { ContactMutation } from "app/data";
import { NavLink } from "react-router";
import type { Navigation } from "react-router";

type Props = {
  contacts: ContactMutation[];
  navigationState: Navigation["state"];
};

export function ContactNavList({ contacts, navigationState }: Props) {
  return (
    <nav>
      {contacts.length ? (
        <ul>
          {contacts.map((contact) => (
            <li key={contact.id}>
              <NavLink className={navigationState === "loading" ? "loading" : ""} to={`contacts/${contact.id}`}>
                {contact.first || contact.last ? (
                  <>
                    {contact.first} {contact.last}
                  </>
                ) : (
                  <i>No Name</i>
                )}
                {contact.favorite ? <span>★</span> : null}
              </NavLink>
            </li>
          ))}
        </ul>
      ) : (
        <p>
          <i>No contacts</i>
        </p>
      )}
    </nav>
  );
}
