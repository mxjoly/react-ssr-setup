import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import ReactLogo from '../../assets/react.svg';
import './Header.scss';

import routes from '../../routes';
import LocaleSelect from '../organisms/LocaleSelect';

const RouteList = () => {
  return (
    <ul>
      {Object.keys(routes).map((routeName) => {
        return (
          <li key={routeName}>
            <NavLink
              exact
              to={routes[routeName]}
              className="header__link"
              activeClassName="header__link_selected"
            >
              {routeName}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
};

const Header: React.FC<any> = () => {
  return (
    <div className="header">
      <nav className="header__navigation">
        <Link to={routes.Home}>
          <img className="header__logo" src={ReactLogo} alt="logo" />
        </Link>
        <RouteList />
      </nav>
      <LocaleSelect locales={['en', 'fr']} />
    </div>
  );
};

export default Header;
