# React Router Contacts Demo

This is a demo application built with React Router.

- [React Router Docs](https://reactrouter.com/home)

## Project Document

- [./docs](./docs)

## Development

From your terminal:

```console
$ pnpm install
$ pnpm dev
```

This installs dependencies and starts the app in development mode, rebuilding assets on file changes.

## Testing

To run the test suite:

```console
$ pnpm test
```

This will execute tests using Vitest. You can also run tests with coverage:

```console
$ pnpm test:coverage
$ pnpm test:coverage:ui
```

## Deployment

First, build your app for production:

```console
$ pnpm build
```

This command uses `react-router build` and outputs the production-ready app to the `build/server` and `build/client` directories.

Then, to run the app in production mode:

```console
$ pnpm start
```
This command uses `react-router-serve` to serve the application from `./build/server/index.js`.
