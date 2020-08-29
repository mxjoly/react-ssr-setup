import React from 'react';
import { Store, Middleware } from 'redux';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { shallow, ShallowWrapper } from 'enzyme';

import App from './App';
import { RootState } from './lib/store/rootReducer';

const middlewares: Middleware[] = [];

describe('<App />', () => {
  let wrapper: ShallowWrapper;
  let store: Store;

  beforeEach(() => {
    store = configureStore<RootState>(middlewares)();
    wrapper = shallow(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </Provider>
    );
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('renders without crashing', () => {
    expect(wrapper.length).toBe(1);
  });

  it('should match its reference snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
