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

  - ⚙ Babel 7
  - 📦 Webpack 4
  - 🔥 TypeScript (via Babel)
  - 🧹 Prettier
  - 🧹 Stylelint
  - 🔦 ESLint 7
  - 🌡 Jest
  - 🌡 Enzime
  - ✅ Server Side Rendering with Express
  - ✅ React i18next for multi language support
  - 🚀 React Fast Refresh
  - ✅ SASS
  - ✅ CSS Modules
  - ✅ PostCSS
  - ✅ Dependencies visualization with Graphviz
  - 📕 Storybook 6
  - ✅ Precommit hooks via lint-staged + Husky

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

Starts the app in development mode: creates a new client and server dev build using [Webpack](https://webpack.js.org/), starts the [Express](https://expressjs.com/) server build (for both file serving and server side pre-rendering) and keeps webpack open in watchmode. Updates the app (if possible) on change using HMR.

#### `npm run build`

Creates a new build optimized for production.

#### `npm run clean`

Clean the build folder.

### `npm run test`

Run all tests using Jest.

#### `npm run lint:js`

Run [ESLint](https://eslint.org/) for all JavaScript and TypeScript files.

#### `npm run lint:css`

Run [Stylelint](https://stylelint.io/) for all CSS files.

#### `npm run lint:sass`

Run [Stylelint](https://stylelint.io/) for all SASS files.

#### `npm run lint`

Run `lint:js`, `lint:css` and `lint:sass` in parallel.

#### `npm run analyze`

Starts `webpack-bundle-analyzer` to give you the opportunity to analyze your bundle(s).

#### `npm run depgraph`

Creates an image of your dependency graph. Requires [GraphVIZ](https://www.graphviz.org/).

#### `npm run storybook`

Run the [Storybook](https://storybook.js.org/) interface on the port 6006.

#### `npm run build:storybook`

Generate the static resources for [Storybook](https://storybook.js.org/). Useful to host online.

#### `npm run format`

Format the files with [Prettier](https://prettier.io/), [ESLint](https://eslint.org/) and [Stylelint](https://stylelint.io/).

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

- [ ] Add offline support using [Workbox](https://developers.google.com/web/tools/workbox)
- [ ] Import SVGs as React component

## License

MIT.
