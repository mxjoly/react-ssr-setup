import React from 'react';
import { renderRoutes } from 'react-router-config';
import './styles.scss';

import routes from '../../../routes';

const Content: React.FC<any> = () => {
  return <main className="Content">{renderRoutes(routes)}</main>;
};

export default Content;
