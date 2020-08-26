import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './style.scss';

export interface MenuProps {
  items: string[];
  defaultItem?: string;
  onSelect: (item: string) => void;
  placeholder?: string;
  noDropIcon?: boolean;
  capitalize?: boolean;
  uppercase?: boolean;
}

interface MenuState {
  selected: string | null;
  open: boolean;
}

const Menu: React.FC<MenuProps> = (props: MenuProps) => {
  const [state, setState] = React.useState<MenuState>({
    selected: null,
    open: false,
  });

  const toggleVisible = () => {
    setState({
      ...state,
      open: !state.open,
    });
  };

  const handleSelect = (item: string) => {
    setState({ selected: item, open: false });
    props.onSelect(item);
    close();
  };

  const close = () => {
    setState({ open: false, selected: null });
  };

  const classes = ['menu'];
  if (props.capitalize) classes.push('menu_capitalize');
  if (props.uppercase) classes.push('menu_uppercase');

  return (
    <div className={classnames(classes)}>
      <span
        className={
          props.noDropIcon
            ? 'menu__button'
            : classnames('menu__button', 'menu__button_icon')
        }
        onClick={toggleVisible}
      >
        {state.selected || props.defaultItem || props.placeholder}
      </span>
      <ul
        className={
          state.open
            ? classnames('menu__items', 'menu__items_open')
            : 'menu__items'
        }
      >
        {props.items.map((item: string) => (
          <li
            key={item}
            className="menu__item"
            onClick={() => handleSelect(item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

Menu.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  defaultItem: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  noDropIcon: PropTypes.bool,
  capitalize: PropTypes.bool,
  uppercase: PropTypes.bool,
};

Menu.defaultProps = {
  noDropIcon: false,
  capitalize: false,
  uppercase: false,
};

export default Menu;
