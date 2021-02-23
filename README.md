[![Dependency Status][dependency-shield]][repo-url]
[![styled with prettier][prettier-shield]][prettier-url]
[![License][licence-shield]][license-url]

# ⚛ React + Express (Setup)

This project is a template of a server side rendering a [React][react-url] application.

## Summary

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Tricks](#tricks)
  - [Avoid source map generation for faster builds](#avoid-source-map-generation-for-faster-builds)
  - [Change the port of the dev environment](#change-the-port-of-the-dev-environment)
  - [Progressive Web App](#progressive-web-app)
- [Todo](#todo)
- [License](#license)

## Features

- General Setup

  - ⚙ Babel 7
  - 📦 Webpack 5
  - 🔥 TypeScript 4 (via Babel)
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
  - 🔥 PWA support
  - 🔥 PWA assets and metadate automatically created

- Libs and dependencies

  - ⚛ React 17
  - ✅ Express 4.x
  - ✅ React i18next for multi language support
  - ✅ Redux + Thunk middleware
  - ✅ Immer
  - ✅ Reselect
  - ✅ React Router 5
  - ✅ React Helmet

## Installation

Clone the repository, `cd` into the directory and run `yarn` (or `npm install`) on your command line to install all the dependencies. You're ready to go now !

## Usage

There are npm scripts for all the relevant things. The server will always be started on port 8500 unless otherwise specified in process.env.PORT. You can use a .env file to specify env vars. If you want to use them in your client side code, don't forget to add them in config/env.ts.

#### `yarn start`

Starts the app in development mode: creates a new client and server dev build using [Webpack][webpack-url], starts the [Express][express-url] server build (for both file serving and server side pre-rendering) and keeps webpack open in watchmode. Updates the app (if possible) on change using HMR.

#### `yarn build`

Creates a new build optimized for production.

#### `yarn clean`

Clean the build folder.

#### `yarn test`

Run all tests using Jest.

#### `yarn lint:js`

Run [ESLint][eslint-url] for all JavaScript and TypeScript files.

#### `yarn lint:css`

Run [Stylelint][stylelint-url] for all CSS files.

#### `yarn lint:sass`

Run [Stylelint][stylelint-url] for all SASS files.

#### `yarn lint`

Run `lint:js`, `lint:css` and `lint:sass` in parallel.

#### `yarn analyze`

Starts `webpack-bundle-analyzer` to give you the opportunity to analyze your bundle(s).

#### `yarn depgraph`

Creates an image of your dependency graph. Requires [GraphVIZ][graphviz-url].

#### `yarn storybook`

Run the [Storybook][storybook-url] interface on the port 6006.

#### `yarn build:storybook`

Generate the static resources for [Storybook][storybook-url]. Useful to host online.

#### `yarn format`

Format the files with [Prettier][prettier-url], [ESLint][eslint-url] and [Stylelint][stylelint-url].

#### `yarn plop`

Display intructions on the command line to create files easily.

## Environment Variables

There are a few environment variables you can set to adjust the setup to your needs

| Variable         | Default            | Description                                                      |
| ---------------- | ------------------ | ---------------------------------------------------------------- |
| `PORT`           | `8500`             | Port number your application will be served                      |
| `HOST`           | `http://localhost` | Url (including protocol!) your application will be served on.    |
| `DEVSERVER_HOST` | `http://localhost` | Optional. Different host for the Webpack Dev Server to be served |

## Tricks

### Avoid source map generation for faster builds

In some cases you might not want to generate source maps for the generated files. In this case you can set the `SOURCEMAP` environment variable to `false`. No source map files will be generated then. This works no matter if you're in devmode or building for production.

### Change the port of the dev environment

By default if you run `npm start` the development server will use port 8500. You can change this by specifying a `PORT` environment variable.

### Progressive Web App

Set the `PWA` environment variable to `true` and add a file named `app.json` to the root of the project with your manifest properties :

| Key                | Default                   | Description                                                                       |
| ------------------ | ------------------------- | --------------------------------------------------------------------------------- |
| `name`             | `null`                    | Your application's name.                                                          |
| `short_name`       | `null`                    | Your application's short_name.                                                    |
| `description`      | `null`                    | Your application's description.                                                   |
| `lang`             | `en`                      | Primary language for name and short_name                                          |
| `dir`              | `auto`                    | The base direction in which to display direction-capable members of the manifest. |
| `background_color` | `#ffffff`                 | Background colour for flattened icons.                                            |
| `theme_color`      | `#ffffff`                 | Theme color user for example in Android's task switcher.                          |
| `display`          | `standalone`              | Display mode: `fullscreen`, `standalone`, `minimal-ui` or `browser`.              |
| `scope`            | `/`                       | set of URLs that the browser considers within your app                            |
| `start_url`        | `/?utm_source=homescreen` | Start URL when launching the application from a device.                           |
| `orientation`      | `any`                     | The orientation to use                                                            |

You can add more properties. For more informations see https://developer.mozilla.org/en-US/docs/Web/Manifest.

To complete the configuration of your web application, specify the path of your favicon in the file `config/paths` (you must use svg icon). When you finally enabled the environment for your web application, the metadata and the icons will be generated automatically for you. But you can still customize the icons generated by creating a file `icons.json` at the root of your project with the json schema defined [there](https://github.com/mxjoly/pwa-webpack-plugin/blob/master/lib/schema.json). If you do not want to generate the metadata or the icons, you can set the `METADATA_GENERATION` or `ICONS_GENERATION` environment variables to `false`.

## Todo

- [x] Add offline support using [Workbox][workbox-url]
- [ ] Import SVGs as React component
- [x] Migrate to Webpack 5
- [ ] Add official enzyme adaptater for react 17

## License

[MIT.][license-url]

<!-- MARKDOWN LINKS -->

[dependency-shield]: https://img.shields.io/david/mxjoly/react-ssr-setup.svg
[prettier-shield]: https://img.shields.io/badge/styled_with-prettier-ff69b4.svg
[licence-shield]: https://img.shields.io/github/license/mxjoly/react-ssr-setup.svg
[license-url]: https://github.com/mxjoly/react-ssr-setup/blob/master/LICENSE
[repo-url]: https://github.com/mxjoly/react-ssr-setup
[dependency-url]: https://david-dm.org/mxjoly/react-ssr-setup
[prettier-url]: https://prettier.io/
[react-url]: https://en.reactjs.org/
[webpack-url]: https://webpack.js.org/
[express-url]: https://expressjs.com/
[eslint-url]: https://eslint.org/
[stylelint-url]: https://stylelint.io/
[graphviz-url]: https://www.graphviz.org/
[storybook-url]: https://storybook.js.org/
[workbox-url]: https://developers.google.com/web/tools/workbox
