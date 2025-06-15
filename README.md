# React Router Contacts Demo

This is a demo application built with React Router.

- [React Router Docs](https://reactrouter.com/home)

## Project Document

- [./docs](./docs)

## Development

From your terminal:

```console
$ bun install
$ bun run dev
```

This installs dependencies and starts the app in development mode, rebuilding assets on file changes.

## Testing

To run the test suite:

```console
$ bun run test # you need to use `run test` instead of `test` to run `vitest`
```

This will execute tests using Vitest. You can also run tests with coverage:

```console
$ bun run test:coverage
$ bun run test:coverage:ui
```

## Deployment

First, build your app for production:

```console
$ bun run build # you need to use `run build` instead of `build`
```

This command uses `react-router build` and outputs the production-ready app to the `build/server` and `build/client` directories.

Then, to run the app in production mode:

```console
$ bun run start
```
This command uses `react-router-serve` to serve the application from `./build/server/index.js`.
