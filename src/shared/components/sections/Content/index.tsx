import React from 'react';
import { renderRoutes } from 'react-router-config';
import './styles.scss';

import routes from '../../../routes';

export const classNames = {
  ROOT: 'Content',
};

const Content: React.FC<any> = () => {
  return <main className={classNames.ROOT}>{renderRoutes(routes)}</main>;
};

export default React.memo(Content);
