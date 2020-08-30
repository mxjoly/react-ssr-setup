import { createSelector } from 'reselect';
import { RootState } from '../rootReducer';

// Cache TTL in Milliseconds
const CACHE_TTL = 60 * 1000;

export const getUser = (state: RootState) => state.user;

export const getUserItems = createSelector(
  [getUser],
  (user): Array<any> => {
    return user.items;
  }
);

export const isExpired = (state: RootState): boolean => {
  const { updatedAt, didInvalidate } = getUser(state);
  return (
    didInvalidate === true || !updatedAt || Date.now() - updatedAt > CACHE_TTL
  );
};

export const isLoading = createSelector([getUser], (user) => {
  return user.isLoading;
});

export const didInvalidate = createSelector([getUser], (user) => {
  return user.didInvalidate;
});
