import React from 'react';
import { Helmet } from 'react-helmet-async';

const PageNotFound: React.FC<any> = () => (
  <React.Fragment>
    <Helmet>
      <title>404</title>
    </Helmet>
    <p>Page Not Found</p>
  </React.Fragment>
);

export default PageNotFound;
