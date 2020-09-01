import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './styles.scss';

export interface MenuProps {
  items: string[];
  defaultItem?: string;
  onSelect: (item: string) => void;
  placeholder?: string;
  noDropIcon?: boolean;
  capitalize?: boolean;
  uppercase?: boolean;
}

export const classNames = {
  ROOT: 'Menu',
  CAPITALIZE: 'Menu_capitalize',
  UPPERCASE: 'Menu_uppercase',
  BUTTON: 'Menu__Button',
  BUTTON_WITH_ICON: 'Menu__Button_icon',
  ITEMS: 'Menu__Items',
  ITEMS_VISIBLE: 'Menu__Items_visible',
  ITEM: 'Menu__Item',
};

const Menu: React.FC<MenuProps> = (props: MenuProps) => {
  const [selectedItem, setSelectedItem] = React.useState<string | null>(null);
  const [visible, setVisible] = React.useState<boolean>(false); // items visible ?

  const toggleVisible = () => {
    setVisible(!visible);
  };

  const addVisible = () => {
    if (!visible) {
      setVisible(true);
    }
  };

  const removeVisible = () => {
    if (visible) {
      setVisible(false);
    }
  };

  const handleSelect = (item: string) => {
    setSelectedItem(item);
    setVisible(false);
    props.onSelect(item);
  };

  const classes = [classNames.ROOT];
  if (props.capitalize) classes.push(classNames.CAPITALIZE);
  if (props.uppercase) classes.push(classNames.UPPERCASE);

  return (
    <div
      className={classnames(classes)}
      onMouseOver={addVisible}
      onMouseLeave={removeVisible}
    >
      <button
        className={
          props.noDropIcon
            ? classNames.BUTTON
            : classnames(classNames.BUTTON, classNames.BUTTON_WITH_ICON)
        }
        onClick={toggleVisible}
      >
        {selectedItem || props.defaultItem || props.placeholder}
      </button>
      <ul
        className={
          visible
            ? classnames(classNames.ITEMS, classNames.ITEMS_VISIBLE)
            : classNames.ITEMS
        }
      >
        {props.items.map((item: string) => (
          <li
            key={item}
            className={classNames.ITEM}
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
