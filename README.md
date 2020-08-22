# ⚛ React + Express (Setup)

This project is a template of a server side rendering a [React](https://en.reactjs.org/) application.

## Summary

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Tricks](#tricks)
  - [Avoid source map generation for faster builds](#avoid-source-map-generation-for-faster-builds)
  - [Change the port of the dev environment](#change-the-port-of-the-dev-environment)
- [Todo](#todo)
- [License](#License)

## Features

- General Setup

  - 🔥 Babel 7
  - 📦 Webpack 4
  - 🔥 ESLint 7
  - 🔥 TypeScript (via Babel)
  - 🔥 Prettier
  - ✅ Server Side Rendering with Express
  - ✅ React i18next for multi language support
  - 🚀 React Fast Refresh
  - ✅ SASS
  - ✅ CSS Modules
  - ✅ PostCSS
  - ✅ Dependencies visualization with Graphviz
  - 📕 Storybook 6

- Libs and dependencies

  - ⚛ React 16.x (latest), with Hooks!
  - ✅ Express 4.x
  - ✅ React i18next for multi language support
  - ✅ Redux + Thunk middleware
  - ✅ Immer
  - ✅ Reselect
  - ✅ React Router 5
  - ✅ React Helmet

## Installation

Clone the repository, `cd` into the directory and run `npm install` on your command line to install all the dependencies. You're ready to go now!

## Usage

There are npm scripts for all the relevant things. The server will always be started on port 8500 unless otherwise specified in process.env.PORT. You can use a .env file to specify env vars. If you want to use them in your client side code, don't forget to add them in config/env.ts.

#### `npm start`

Starts the app in development mode: creates a new client and server dev build using Webpack, starts the Express server build (for both file serving and server side pre-rendering) and keeps webpack open in watchmode. Updates the app (if possible) on change using HMR.

#### `npm run build`

Creates a new build optimized for production.

#### `npm run lint:js`

Run ESLint for all JavaScript and TypeScript files

#### `npm run lint:css`

Run Stylelint for all CSS files

#### `npm run lint:sass`

Run Stylelint for all SASS files

#### `npm run lint`

Run lint:js, lint:css and lint:sass in parallel

#### `npm run analyze`

Starts `webpack-bundle-analyzer` to give you the opportunity to analyze your bundle(s)

#### `npm run depgraph`

Creates an image of your dependency graph. Requires [GraphVIZ](https://www.graphviz.org/).

#### `npm run start:storybook`

Run the Storybook interface on the port 6006.

#### `npm run build:storybook`

Generate the static resources for Storybook. Useful to host online.

## Environment Variables

There are a few environment variables you can set to adjust the setup to your needs

| Variable         | Default            | Description                                                      |
| ---------------- | ------------------ | ---------------------------------------------------------------- |
| `PORT`           | `8500`             | Port number your application will be served                      |
| `HOST`           | `http://localhost` | Host (including protocol!) your application will be served on.   |
| `DEVSERVER_HOST` | `http://localhost` | Optional. Different host for the Webpack Dev Server to be served |

## Tricks

### Avoid source map generation for faster builds

In some cases you might not want to generate source maps for the generated files. In this case you can set the `OMIT_SOURCEMAP` environment variable to `true`. No source map files will be generated then. This works no matter if you're in devmode or building for production.

### Change the port of the dev environment

By default if you run `npm start` the development server will use port 8500. You can change this by specifying a `PORT` environment variable.

## Todo

- [ ] Add test with Jest
- [x] React Helmet support
- [x] Add Routing with react-router and react-router-dom
- [x] Set up Redux
- [x] Internationalization with i18n
- [ ] Add Storybook
- [x] Add CSS modules

## License

MIT.
