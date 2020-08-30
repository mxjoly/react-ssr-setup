import MockDate from 'mockdate';
import reducer, { initialState } from './reducer';
import { ActionTypes } from './actions';

describe('User reducer', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('should return the initial state', () => {
    const receivedState = reducer(undefined, { type: 'undefined' });
    expect(receivedState).toEqual(initialState);
  });

  it('should handle USER_REQUEST', () => {
    const receivedState = reducer(undefined, {
      type: ActionTypes.USER_REQUEST,
    });
    const expectedState = { ...initialState, isLoading: true };
    expect(receivedState).toEqual(expectedState);
  });

  it('should handle USER_SUCCESS', () => {
    const action = {
      type: ActionTypes.USER_SUCCESS,
      payload: {
        updatedAt: Date.now(),
        items: ['item1', 'item2', 'item3'],
      },
    };
    const receivedState = reducer(undefined, action);
    const expectedState = {
      ...initialState,
      updatedAt: Date.now(),
      items: action.payload.items,
    };
    expect(receivedState).toEqual(expectedState);
  });

  it('should handle USER_FAILURE', () => {
    const receivedState = reducer(undefined, {
      type: ActionTypes.USER_FAILURE,
    });
    const expectedState = { ...initialState, didInvalidate: true };
    expect(receivedState).toEqual(expectedState);
  });

  it('should handle USER_INVALIDATE', () => {
    const receivedState = reducer(undefined, {
      type: ActionTypes.USER_INVALIDATE,
    });
    const expectedState = { ...initialState, didInvalidate: true };
    expect(receivedState).toEqual(expectedState);
  });
});
