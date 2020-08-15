import React from 'react';
import { Request, Response } from 'express';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import App from '../../shared/App';
import Html from '../components/html';

const renderFullPage = () => (_req: Request, res: Response) => {
  const content = renderToString(
    <Provider store={res.locals.store}>
      <App />
    </Provider>
  );

  const state = JSON.stringify(res.locals.store.getState());

  return res.send(
    '<!doctype html>' +
      renderToString(
        <Html
          css={[
            res.locals.assetPath('bundle.css'),
            res.locals.assetPath('vendor.css'),
          ]}
          scripts={[
            res.locals.assetPath('bundle.js'),
            res.locals.assetPath('vendor.js'),
          ]}
          state={state}
        >
          {content}
        </Html>
      )
  );
};

export default renderFullPage;
