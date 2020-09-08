import React from 'react';
import { HelmetData } from 'react-helmet-async';
import HtmlReactParser from 'html-react-parser';

import config from '../../shared/lib/i18n/config';
import { Locale } from '../../shared/lib/store/app/types';

export type HtmlProps = {
  children: string;
  css: string[];
  scripts: string[];
  helmetContext: { helmet: HelmetData };
  state: string;
  initialI18nStore: string;
  initialLanguage: Locale;
  // Props for common website
  favicon?: string;
  // Props for pwa
  metadata?: string;
  manifest?: string;
};

const html = ({
  children,
  favicon,
  manifest,
  metadata,
  css = [],
  scripts = [],
  helmetContext: { helmet },
  state = '{}',
  initialI18nStore = '{}',
  initialLanguage,
}: HtmlProps) => {
  // selection rule :
  // path: no  | cookies : yes    => language in the cookies
  // path: yes | cookies : yes/no => language in the path
  // path: no  | cookies : no     => the browser language
  // otherwise we return the config fallback language
  const bestLanguage = initialLanguage
    ? `'${initialLanguage}'`
    : `navigator.languages ? navigator.languages[0].slice(0, 2) : 
  (navigator.language.slice(0, 2) || navigator.userLanguage.slice(0, 2) || '${config.fallbackLng}')`;

  // Metadata for the common website and pwa
  const sharedMetaData = () => {
    const data: JSX.Element[] = [];
    return data;
  };

  // Metadata for the common website
  const commonHeadMetaData = () => {
    let data: JSX.Element[] = [];
    data = data.concat(sharedMetaData());
    if (favicon) {
      const ext = favicon.split('.').pop();
      const type =
        ext === 'ico'
          ? 'image/x-icon'
          : ext === 'png'
          ? 'image/png'
          : ext === 'svg'
          ? 'image/svg+xml'
          : undefined;
      if (type === undefined) {
        console.warn('The extension of the favicon is not supported :', ext);
      }
      data.push(<link key={favicon} rel="icon" type={type} href={favicon} />);
    }
    data.push(<meta key="theme-color" name="theme-color" content="#ffffff" />);
    return data;
  };

  // Metadata for the pwa
  const pwaMetaData = () => {
    let data: JSX.Element[] = [];
    data = data.concat(sharedMetaData());
    if (manifest) {
      // Must be before the props metadata
      data.push(<link key={manifest} rel="manifest" href={manifest} />);
    }
    if (metadata) {
      data = data.concat(HtmlReactParser(metadata));
    }
    return data;
  };

  return (
    <html {...helmet.htmlAttributes.toComponent()}>
      <head>
        {helmet.title.toComponent()}
        {helmet.base.toComponent()}
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {helmet.meta.toComponent()}
        {process.env.PWA === 'true' ? pwaMetaData() : commonHeadMetaData()}
        {helmet.link.toComponent()}
        {css.filter(Boolean).map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
        {helmet.script.toComponent()}
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
