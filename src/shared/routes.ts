interface RouteMap {
  [key: string]: string;
}

const routes: RouteMap = {
  Home: '/',
  Page_1: '/page-1/',
  Page_2: '/page-2/',
  Page_3: '/page-3/',
};

export const getRoute = (
  path: string,
  params?: { [key: string]: string | number },
  routesConfig: any = routes
) =>
  path.split('.').reduce((routeBranch: any, pathItem: string) => {
    if (routeBranch && routeBranch[pathItem]) {
      const route = routeBranch[pathItem];
      if (typeof route === 'string') {
        if (!params || typeof params === 'undefined') {
          return route;
        }

        return Object.entries(params).reduce((replaced, [key, value]) => {
          return replaced.replace(`:${key}`, String(value));
        }, route);
      }
      return routeBranch[pathItem];
    }
  }, routesConfig);

export default routes;
