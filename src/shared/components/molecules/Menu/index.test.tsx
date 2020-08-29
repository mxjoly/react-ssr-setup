import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { spy, SinonSpy } from 'sinon';

import Menu, { MenuProps, classNames } from './index';

// Create a spy for the react hook useState
const setState = jest.fn();
const useStateSpy = jest.spyOn(React, 'useState');

describe('<Menu />', () => {
  let component: ShallowWrapper;
  let initialProps: MenuProps & { onSelect: SinonSpy };

  beforeEach(() => {
    initialProps = {
      items: ['item1', 'item2', 'item3'],
      onSelect: spy(),
    };
    component = shallow(<Menu {...initialProps} />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('renders without errors', () => {
    expect(component.hasClass(classNames.ROOT)).toBe(true);
  });

  it('should match its reference snapshot', () => {
    expect(component.html()).toMatchSnapshot();
  });

  it('should have its labels capitalized', () => {
    const props = { capitalize: true, ...initialProps };
    component.setProps(props);
    expect(component.hasClass(classNames.CAPITALIZE)).toBe(true);
  });

  it('should have its labels in uppercase', () => {
    const props = { uppercase: true, ...initialProps };
    component.setProps(props);
    expect(component.hasClass(classNames.UPPERCASE)).toBe(true);
  });

  describe('#Button', () => {
    let button: ShallowWrapper;

    beforeEach(() => {
      button = component.find(`.${classNames.BUTTON}`);
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('should have a drop icon by default', () => {
      expect(button.hasClass(classNames.BUTTON_WITH_ICON)).toBe(true);
    });

    it('should not have a drop icon', () => {
      const props = { noDropIcon: true, ...initialProps };
      component.setProps(props);
      button = component.find(`.${classNames.BUTTON}`);
      expect(button.hasClass(classNames.BUTTON_WITH_ICON)).toBe(false);
    });

    it('should render the value of the current item selected as title', () => {
      useStateSpy.mockImplementation(() => [initialProps.items[0], setState]);
      component = shallow(<Menu {...initialProps} />);
      button = component.find(`.${classNames.BUTTON}`);
      expect(button.text()).toBe(initialProps.items[0]);
    });

    it('should render the default item as title', () => {
      useStateSpy.mockImplementation(() => [null, setState]);
      component = component.setProps({
        defaultItem: initialProps.items[1],
        ...initialProps,
      });
      button = component.find(`.${classNames.BUTTON}`);
      expect(button.text()).toBe(initialProps.items[1]);
    });

    it('should render the placeholder as title', () => {
      useStateSpy.mockImplementation(() => [null, setState]);
      component = component.setProps({
        placeholder: 'placeholder',
        ...initialProps,
      });
      button = component.find(`.${classNames.BUTTON}`);
      expect(button.text()).toBe('placeholder');
    });
  });

  describe('#Items', () => {
    let items: ShallowWrapper;
    let button: ShallowWrapper;

    beforeEach(() => {
      items = component.find(`.${classNames.ITEMS}`);
      button = component.find(`.${classNames.BUTTON}`);
    });

    it('should be opened and closed by the button', () => {
      const update = () => {
        component = component.update();
        button = component.find(`.${classNames.BUTTON}`);
        items = component.find(`.${classNames.ITEMS}`);
      };

      button.simulate('click');
      expect(items.hasClass(classNames.ITEMS_VISIBLE)).toBe(false);
      update();
      button.simulate('click');
      expect(items.hasClass(classNames.ITEMS_VISIBLE)).toBe(true);
    });

    it('should have the right number of items', () => {
      expect(items.find(`.${classNames.ITEM}`)).toHaveLength(
        initialProps.items.length
      );
    });

    describe('#Item', () => {
      let item: ShallowWrapper;

      beforeEach(() => {
        item = items.children().first();
      });

      it('should activate the handleSelect function on click', () => {
        item.simulate('click');
        expect(initialProps.onSelect.calledOnce).toBe(true);
      });
    });
  });
});
