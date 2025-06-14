import type { RouteConfig } from "@react-router/dev/routes";
import { index, layout, route } from "@react-router/dev/routes";

export default [
  layout("layouts/sidebar/index.ts", [
    index("routes/home/index.ts"),
    route("contacts/:contactId", "routes/contact/index.ts"),
    route("contacts/:contactId/edit", "routes/edit-contact/index.ts"),
    route("contacts/:contactId/destroy", "routes/destroy-contact/index.ts"),
  ]),
  route("about", "routes/about/index.ts")
] satisfies RouteConfig;
