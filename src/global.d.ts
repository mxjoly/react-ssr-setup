declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
  }
}

declare const __BROWSER__: boolean;
declare const __SERVER__: boolean;

interface Window {
  store: any;
  __PRELOADED_STATE__: any;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
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
  const content: any;
  export default content;
}

declare module '*.module.css' {
  const content: { [className: string]: string };
  export default classes;
}

declare module 'express-manifest-helpers';
