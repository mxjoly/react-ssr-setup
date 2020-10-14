import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import Menu, { MenuProps, classNames } from '.';

describe('<Menu />', () => {
  let component: ShallowWrapper;
  let initialProps: MenuProps & { onSelect: jest.MockedFunction<any> };
  let useStateSpy: jest.SpyInstance;

  beforeEach(() => {
    initialProps = {
      items: ['item1', 'item2', 'item3'],
      onSelect: jest.fn(),
    };
    component = shallow(<Menu {...initialProps} />);
    useStateSpy = jest.spyOn(React, 'useState');
  });

  afterEach(() => {
    useStateSpy.mockRestore();
  });

  // ---------------------------------------------------- //

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

  it('should display the items when a mouveOver event is detected', () => {
    component.simulate('mouseOver');
    component.simulate('mouseOver'); // Do nothing because items are still displayed
    const items = component.find(`.${classNames.ITEMS}`);
    expect(items.hasClass(classNames.ITEMS_VISIBLE)).toBe(true);
  });

  it('should hide the items when a mouveLeave event is detected', () => {
    component.simulate('mouseOver');
    component.simulate('mouseLeave');
    component.simulate('mouseLeave'); // Do nothing because items are still hiden
    const items = component.find(`.${classNames.ITEMS}`);
    expect(items.hasClass(classNames.ITEMS_VISIBLE)).toBe(false);
  });

  // ---------------------------------------------------- //

  describe('#Button', () => {
    let button: ShallowWrapper;

    beforeEach(() => {
      button = component.find(`.${classNames.BUTTON}`);
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('has a drop icon by default', () => {
      expect(button.hasClass(classNames.BUTTON_WITH_ICON)).toBe(true);
    });

    it('has not a drop icon', () => {
      const props = { noDropIcon: true, ...initialProps };
      component.setProps(props);
      button = component.find(`.${classNames.BUTTON}`);
      expect(button.hasClass(classNames.BUTTON_WITH_ICON)).toBe(false);
    });

    it('renders the value of the current item selected as title', () => {
      useStateSpy.mockImplementation(() => [initialProps.items[0], jest.fn()]);
      component = shallow(<Menu {...initialProps} />);
      button = component.find(`.${classNames.BUTTON}`);
      expect(button.text()).toBe(initialProps.items[0]);
    });

    it('renders the default item as title', () => {
      useStateSpy.mockImplementation(() => [null, jest.fn()]);
      component = component.setProps({
        defaultItem: initialProps.items[1],
        ...initialProps,
      });
      button = component.find(`.${classNames.BUTTON}`);
      expect(button.text()).toBe(initialProps.items[1]);
    });

    it('renders the placeholder as title', () => {
      useStateSpy.mockImplementation(() => [null, jest.fn()]);
      component = component.setProps({
        placeholder: 'placeholder',
        ...initialProps,
      });
      button = component.find(`.${classNames.BUTTON}`);
      expect(button.text()).toBe('placeholder');
    });
  });

  // ---------------------------------------------------- //

  describe('#Items', () => {
    let items: ShallowWrapper;
    let button: ShallowWrapper;

    const update = () => {
      component = component.update();
      button = component.find(`.${classNames.BUTTON}`);
      items = component.find(`.${classNames.ITEMS}`);
    };

    beforeEach(() => {
      items = component.find(`.${classNames.ITEMS}`);
      button = component.find(`.${classNames.BUTTON}`);
    });

    it('is opened and closed by the button', () => {
      button.simulate('click');
      expect(items.hasClass(classNames.ITEMS_VISIBLE)).toBe(false);
      update();
      button.simulate('click');
      expect(items.hasClass(classNames.ITEMS_VISIBLE)).toBe(true);
    });

    it('has the right number of items', () => {
      expect(items.find(`.${classNames.ITEM}`)).toHaveLength(
        initialProps.items.length
      );
    });

    // ---------------------------------------------------- //

    describe('#Item', () => {
      let item: ShallowWrapper;

      beforeEach(() => {
        item = items.children().first();
      });

      it('activates the handleSelect function on click', () => {
        item.simulate('click');
        expect(initialProps.onSelect).toBeCalledTimes(1);
      });
    });
  });
});
