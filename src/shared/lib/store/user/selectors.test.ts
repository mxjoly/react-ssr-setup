import rootReducer from '../rootReducer';
import reducer from './reducer';
import * as selectors from './selectors';
import * as actions from './actions';

// The initial root state
const initialState = rootReducer(undefined, { type: 'undefined' });

describe('User selectors', () => {
  it('should select the User branch of the state', () => {
    expect(selectors.getUser(initialState)).toEqual(initialState.user);
  });

  it('should have a selector to get the items', () => {
    expect(selectors.getUserItems(initialState)).toBe(initialState.user.items);
  });

  it('should have a selector to detect if the data is expired', () => {
    const action = {
      type: actions.ActionTypes.USER_SUCCESS,
      payload: {
        updatedAt: new Date().getDate() - 1, // yesterday
      },
    };
    const userState = { user: { ...reducer(undefined, action) } };
    const finalState = { ...initialState, ...userState };
    expect(selectors.isExpired(finalState)).toBe(true);
  });

  it('should have a selector to detect if the data is expired (2)', () => {
    const action = { type: actions.ActionTypes.USER_SUCCESS }; // with no payload
    const userState = { user: { ...reducer(undefined, action) } };
    const finalState = { ...initialState, ...userState };
    expect(selectors.isExpired(finalState)).toBe(false);
  });

  it('should have a selector to detect if the data is loading', () => {
    const action = actions.userRequest();
    const state = rootReducer(undefined, action);
    expect(selectors.isLoading(state)).toBe(true);
  });

  it('should have a selector to detect if the data did invalidate', () => {
    const preloadState = rootReducer(undefined, actions.userSuccess([]));
    const finalState = rootReducer(preloadState, actions.userInvalidate());
    expect(selectors.didInvalidate(finalState)).toBe(true);
  });
});
