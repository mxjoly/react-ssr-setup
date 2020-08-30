import MockDate from 'mockdate';
import * as actions from './actions';
import { Action } from './types';

describe('User actions', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('should create an action to handle a request', () => {
    const expectedAction: Action = {
      type: actions.ActionTypes.USER_REQUEST,
    };
    expect(actions.userRequest()).toEqual(expectedAction);
  });

  it('should create an action to handle a success', () => {
    const items = ['item1', 'item2', 'item3'];
    const expectedAction: Action = {
      type: actions.ActionTypes.USER_SUCCESS,
      payload: {
        items,
        updatedAt: Date.now(),
      },
    };
    expect(actions.userSuccess(items)).toEqual(expectedAction);
  });

  it('should create an action to handle a failure', () => {
    const expectedAction: Action = {
      type: actions.ActionTypes.USER_FAILURE,
    };
    expect(actions.userFailure()).toEqual(expectedAction);
  });

  it('should create an action to invalidate the data', () => {
    const expectedAction: Action = {
      type: actions.ActionTypes.USER_INVALIDATE,
    };
    expect(actions.userInvalidate()).toEqual(expectedAction);
  });
});
