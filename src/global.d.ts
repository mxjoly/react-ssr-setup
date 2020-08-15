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

declare module 'express-manifest-helpers';
