import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactLogo from '../../../assets/react.svg';
import './styles.scss';

import LocaleSelect from '../../organisms/LocaleSelect';
import { Key, getPath } from '../../../routes';

const RouteList = ({ keys }: { keys: Key[] }) => {
  const { i18n } = useTranslation();
  return (
    <ul>
      {keys.map((key) => {
        const path = getPath(key, { locale: i18n.language });
        if (typeof path === 'string') {
          return (
            <li key={key}>
              <NavLink
                exact
                to={path}
                className="Header__Link"
                activeClassName="Header__Link_selected"
              >
                {key}
              </NavLink>
            </li>
          );
        }
      })}
    </ul>
  );
};

const Header: React.FC<any> = () => {
  const { i18n } = useTranslation();
  return (
    <div className="Header">
      <nav className="Header__Navigation">
        <Link to={`${i18n.language}/`}>
          <img className="Header__Logo" src={ReactLogo} alt="logo" />
        </Link>
        <RouteList keys={['page-1', 'page-2', 'page-3']} />
      </nav>
      <LocaleSelect />
    </div>
  );
};

export default Header;
