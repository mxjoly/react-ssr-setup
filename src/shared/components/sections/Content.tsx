import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './Content.scss';

import routes from '../../routes';
import Home from '../../pages/home';
import PageNotFound from '../../pages/404';
import Page1 from '../../pages/page-1';
import Page2 from '../../pages/page-2';
import Page3 from '../../pages/page-3';

const Content: React.FC<any> = () => {
  return (
    <main className="page-content">
      <Switch>
        <Route exact path={routes.Home} component={Home} />
        <Route exact path={routes.Page_1} component={Page1} />
        <Route exact path={routes.Page_2} component={Page2} />
        <Route exact path={routes.Page_3} component={Page3} />
        <Route render={() => <PageNotFound />} />
      </Switch>
    </main>
  );
};

export default Content;
