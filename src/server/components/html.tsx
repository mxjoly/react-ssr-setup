import React from 'react';
import { HelmetData } from 'react-helmet-async';
import HtmlReactParser from 'html-react-parser';
import path from 'path';

import { Locale } from '../../shared/lib/store/app/types';
import config from '../../shared/lib/i18n/config';

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
};

const Html = ({
  children,
  favicon,
  metadata,
  css = [],
  scripts = [],
  helmetContext: { helmet },
  state = '{}',
  initialI18nStore = '{}',
  initialLanguage,
}: HtmlProps) => {
  const bestLanguage = () => {
    if (initialLanguage) {
      return `'${initialLanguage}'`;
    }
    if (config.load !== 'languageOnly') {
      return `navigator.languages ? navigator.languages[0] :
      (navigator.language || navigator.userLanguage || '${config.fallbackLng}')`;
    }
    return `navigator.languages ? navigator.languages[0].slice(0, 2) :
      (navigator.language.slice(0, 2) || navigator.userLanguage.slice(0, 2) || '${config.fallbackLng}')`;
  };

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
      const ext = path.extname(favicon);
      const type =
        ext === '.ico'
          ? 'image/x-icon'
          : ext === '.png'
          ? 'image/png'
          : ext === '.svg'
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
    if (metadata) {
      data = data.concat(HtmlReactParser(metadata) as JSX.Element);
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
            window.initialLanguage = ${bestLanguage()};
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

export default Html;
