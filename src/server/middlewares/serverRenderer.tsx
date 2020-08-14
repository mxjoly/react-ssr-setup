import React from 'react';
import { Request, Response } from 'express';
import { renderToString } from 'react-dom/server';
import App from '../../shared/App';
import Html from '../components/html';

const serverRenderer = (_req: Request, res: Response) => {
  const content = renderToString(<App />);
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
        >
          {content}
        </Html>
      )
  );
};

export default serverRenderer;
