import { RouteConfig } from 'react-router-config';
import { getPath, getRouteKeys, Key } from '.';

const testConfig: RouteConfig[] = [
  {
    key: 'home',
  },
  {
    key: 'info',
    path: ['/about/', '/project/'],
  },
  {
    key: 'users',
    path: '/users/',
    routes: [
      {
        key: 'profile',
        path: '/users/:id/',
      },
    ],
  },
];

// ================================================================ //

describe('Routes', () => {
  describe('#getRouteKeys', () => {
    it('should return the all the keys', () => {
      expect(getRouteKeys(testConfig)).toEqual([
        'home',
        'info',
        'users',
        'profile',
      ]);
    });

    it('should return the keys with no argument', () => {
      expect(getRouteKeys().length).toBeGreaterThanOrEqual(0);
    });
  });

  // ---------------------------------------------------- //

  describe('#getPath', () => {
    it('should return the correct path', () => {
      expect(getPath('users' as Key, null, testConfig)).toEqual('/users/');
    });

    it('should return the correct paths', () => {
      expect(getPath('info' as Key, null, testConfig)).toEqual([
        '/about/',
        '/project/',
      ]);
    });

    it('should return a path with only one argument', () => {
      const key = getRouteKeys()[0] as Key;
      expect(getPath(key, null)).toBeDefined();
    });

    it('should return null because of the key was not used', () => {
      expect(getPath('wrong' as Key, null, testConfig)).toBeNull();
    });

    it('should return the path without the params', () => {
      expect(getPath('profile' as Key, null, testConfig)).toEqual(
        '/users/:id/'
      );
    });

    it('should return the path with the params', () => {
      expect(getPath('profile' as Key, { id: 12 }, testConfig)).toEqual(
        '/users/12/'
      );
    });

    it('should return the null because the route has no path specified', () => {
      expect(getPath('home' as Key, null, testConfig)).toBeNull();
    });
  });
});
