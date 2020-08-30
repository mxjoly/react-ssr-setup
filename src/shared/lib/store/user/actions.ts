export const ActionTypes = {
  USER_REQUEST: '/user/request',
  USER_SUCCESS: '/user/success',
  USER_FAILURE: '/user/failure',
  USER_INVALIDATE: '/user/invalidate',
};

export const userRequest = () => ({
  type: ActionTypes.USER_REQUEST,
});

export const userSuccess = (items: any[]) => ({
  type: ActionTypes.USER_SUCCESS,
  payload: {
    items,
    updatedAt: Number(Date.now()),
  },
});

export const userFailure = () => ({
  type: ActionTypes.USER_FAILURE,
});

export const userInvalidate = () => ({
  type: ActionTypes.USER_INVALIDATE,
});
