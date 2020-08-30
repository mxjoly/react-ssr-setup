import React from 'react';
import { HelmetData } from 'react-helmet-async';
import config from '../../shared/lib/i18n/config';
import { Locale } from '../../shared/lib/store/app/types';

type Props = {
  children: any;
  css: string[];
  scripts: string[];
  helmetContext: { helmet: HelmetData };
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
  initialLanguage,
}: Props) => {
  // selection rule :
  // path: no  | cookies : yes    => language in the cookies
  // path: yes | cookies : yes/no => language in the path
  // path: no  | cookies : no     => the browser language
  // otherwise we return the config fallback language
  const bestLanguage = initialLanguage
    ? `'${initialLanguage}'`
    : `navigator.languages ? navigator.languages[0].slice(0, 2) : 
  (navigator.language.slice(0, 2) || navigator.userLanguage.slice(0, 2) || '${config.fallbackLng[0]}')`;

  return (
    <html {...helmet.htmlAttributes.toComponent()}>
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
            window.initialLanguage = ${bestLanguage};
            `,
          }}
        />
      </head>
      <body {...helmet.bodyAttributes.toComponent()}>
        <div id="app" dangerouslySetInnerHTML={{ __html: children }} />
        {scripts.filter(Boolean).map((src) => (
          <script key={src} src={src} />
        ))}
      </body>
    </html>
  );
};

export default html;
