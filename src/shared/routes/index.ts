import React from 'react';
import { RouteConfig } from 'react-router-config';

import Home from '../pages/home';
import PageNotFound from '../pages/404';
import Page1 from '../pages/page-1';
import Page2 from '../pages/page-2';
import Page3 from '../pages/page-3';

// Does not yet work with server side rendering, waiting react updates
// const Home = React.lazy(() => import('../pages/home'));
// const PageNotFound = React.lazy(() => import('../pages/404'));
// const Page1 = React.lazy(() => import('../pages/page-1'));
// const Page2 = React.lazy(() => import('../pages/page-2'));
// const Page3 = React.lazy(() => import('../pages/page-3'));

const config: RouteConfig[] = [
  {
    key: 'home',
    path: '/:locale/',
    exact: true,
    component: Home,
  },
  {
    key: 'page-1',
    path: '/:locale/page-1/',
    exact: true,
    component: Page1,
  },
  {
    key: 'page-2',
    path: '/:locale/page-2/',
    exact: true,
    component: Page2,
  },
  {
    key: 'page-3',
    path: '/:locale/page-3/',
    exact: true,
    component: Page3,
  },
  {
    key: '404',
    component: PageNotFound,
  },
];

export type Key = 'home' | '404' | 'page-1' | 'page-2' | 'page-3';

export const getRouteKeys = (routeConfig = config) => {
  let keys: React.Key[] = [];
  routeConfig.forEach((route) => {
    if (route.key) keys = keys.concat(route.key);
    if (route.routes) keys = keys.concat(getRouteKeys(route.routes));
  });
  return keys;
};

export const getPath = (
  key: Key,
  params: { [key: string]: string | number } | null,
  routeConfig = config
): string | string[] | null => {
  for (const route of routeConfig) {
    if (route.key === key && typeof route.key === 'string') {
      let path = route.path;
      if (path) {
        if (typeof path === 'string' && path.includes(':') && params) {
          Object.entries(params).forEach(([key, value]) => {
            path = (path as string).replace(`:${key}`, String(value));
          });
        }
        return path;
      }
      return null;
    }
    if (route.routes && route.routes.length > 0) {
      return getPath(key, params, route.routes);
    }
  }
  return null;
};

export default config;
