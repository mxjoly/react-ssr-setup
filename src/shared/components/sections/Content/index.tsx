import React from 'react';
import { renderRoutes } from 'react-router-config';
import './style.scss';

import routes from '../../../routes';

const Content: React.FC<any> = () => {
  return <main className="content">{renderRoutes(routes)}</main>;
};

export default Content;
