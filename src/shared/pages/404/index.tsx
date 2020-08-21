import React from 'react';
import { Helmet } from 'react-helmet-async';

const PageNotFound: React.FC<any> = () => (
  <React.Fragment>
    <Helmet>
      <title>404</title>
    </Helmet>
    <h2>Page Not Found</h2>
  </React.Fragment>
);

export default PageNotFound;
