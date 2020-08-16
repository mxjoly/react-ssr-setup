import React from 'react';

type Props = {
  children: any;
  css: string[];
  scripts: string[];
  helmetContext: any;
  state: string;
};

const html = ({
  children,
  css = [],
  scripts = [],
  helmetContext: { helmet },
  state = '{}',
}: Props) => (
  <html {...helmet.htmlAttributes.toString()}>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {helmet.base.toComponent()}
      {helmet.title.toComponent()}
      {helmet.meta.toComponent()}
      {helmet.link.toComponent()}
      {helmet.script.toComponent()}
      {css.filter(Boolean).map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__PRELOADED_STATE__ = ${state}`,
        }}
      />
    </head>
    <body {...helmet.bodyAttributes.toString()}>
      <div id="app" dangerouslySetInnerHTML={{ __html: children }} />
      {scripts.filter(Boolean).map((src) => (
        <script key={src} src={src} />
      ))}
    </body>
  </html>
);

export default html;
