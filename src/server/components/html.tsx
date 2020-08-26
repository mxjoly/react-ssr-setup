import React from 'react';
import config from '../../shared/lib/i18n/config';
import { Locale } from '../../shared/lib/redux/store/app/types';

type Props = {
  children: any;
  css: string[];
  scripts: string[];
  helmetContext: any;
  state: string;
  initialI18nStore: string;
  initialLanguage: Locale;
};

const html = ({
  children,
  css = [],
  scripts = [],
  helmetContext: { helmet },
  state = '{}',
  initialI18nStore = '{}',
  initialLanguage = config.fallbackLng[0],
}: Props) => (
  <html lang={initialLanguage} {...helmet.htmlAttributes.toString()}>
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
          __html: `
            window.__PRELOADED_STATE__ = ${state};
            window.initialI18nStore = ${initialI18nStore};
            window.initialLanguage = '${initialLanguage}';
            `,
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
