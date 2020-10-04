interface Window {
  store: any;
  initialI18nStore: any;
  initialLanguage: string;
  __PRELOADED_STATE__: any;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
}

declare const __BROWSER__: boolean;
declare const __SERVER__: boolean;

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PUBLIC_URL: string;
    PWA: 'true' | 'false' | undefined;
    ICONS_GENERATION: 'true' | 'false' | undefined;
    METADATA_GENERATION: 'true' | 'false' | undefined;
  }
}

declare namespace Express {
  interface Request {
    i18n: any;
    locals: any;
  }
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  import React from 'react';
  export const ReactComponent: React.FC<React.SVGProps<React.ReactSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.module.css' {
  const content: { [className: string]: string };
  export default classes;
}

declare module 'i18next-http-middleware';
