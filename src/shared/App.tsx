import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import favicon from '../shared/assets/favicon.png';
import './App.scss';

import routes from './routes';
import Home from './pages/home';
import About from './pages/about';
import PageNotFound from './pages/404';

const App: React.FC<any> = () => {
  return (
    <div className={'app'}>
      <Helmet
        defaultTitle="React SSR Starter"
        titleTemplate="%s – React SSR Starter"
        link={[{ rel: 'icon', type: 'image/png', href: favicon }]}
      />
      <h1>React + Express</h1>
      <h2>Navigation</h2>
      <ul>
        <li>
          <Link to={routes.home}>Home</Link>
        </li>
        <li>
          <Link to={routes.about}>About</Link>
        </li>
      </ul>
      <div className="page-content">
        <Switch>
          <Route exact path={routes.home} component={Home} />
          <Route exact path={routes.about} component={About} />
          <Route render={() => <PageNotFound />} />
        </Switch>
      </div>
    </div>
  );
};

export default App;
