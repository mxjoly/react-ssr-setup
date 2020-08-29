import React from 'react';
import { Store } from 'redux';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { shallow, ShallowWrapper } from 'enzyme';

import App from './App';
import { RootState } from './lib/store/rootReducer';

describe('<App />', () => {
  let wrapper: ShallowWrapper;
  let store: Store;

  beforeEach(() => {
    store = configureStore<RootState>([thunk])();
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
