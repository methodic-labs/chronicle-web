/*
 * @flow
 */

/* eslint-disable global-require */

import qs from 'qs';
import { fromJS } from 'immutable';

import { INVALID_PARAMS } from '../../common/constants/testing';
import { genRandomString } from '../../common/utils/testing';

// injected by Jest
declare var __AUTH0_CLIENT_ID__ :string;
declare var __AUTH0_DOMAIN__ :string;

const MOCK_AUTH_TOKEN :string = `${genRandomString()}.${genRandomString()}.${genRandomString()}`;
const MOCK_STATE :string = 'example-nonce-state';
const MOCK_URL :string = 'https://example.com';
const MOCK_AUTH0_URL :string = `${MOCK_URL}/#`
  + `access_token=${genRandomString()}`
  + `&id_token=${genRandomString()}`
  + `&state=${MOCK_STATE}`;

const MOCK_LOGIN_URL :string = `${MOCK_URL}/#/login`;

const MOCK_CONFIG :Map<string, *> = fromJS({
  auth0ClientId: __AUTH0_CLIENT_ID__,
  auth0Domain: __AUTH0_DOMAIN__,
  auth0Lock: {
    allowSignUp: true,
    logo: 'Logo',
    primaryColor: '#7860ff',
    title: 'Title'
  },
});

// TODO: improve perf - not every test needs to do require('./Auth0'), I think
// TODO: mock Auth0Lock, and test for given options, test getConfig().getIn(['auth0Lock', 'logo'], '')
describe('Auth0', () => {

  const windowSpy = jest.spyOn(global, 'window', 'get');
  let replaceSpy;

  beforeAll(() => {
    jest.doMock('auth0-lock', () => jest.fn());
    jest.doMock('./utils', () => ({
      clearAuthInfo: jest.fn(() => {}),
      getAuthToken: jest.fn(() => MOCK_AUTH_TOKEN),
      hasAuthTokenExpired: jest.fn(() => true)
    }));

    // https://www.grzegorowski.com/how-to-mock-global-window-with-jest
    const testWindow = { ...window };
    replaceSpy = jest.fn((...args) => testWindow.location.replace(...args));
    windowSpy.mockImplementation(() => ({
      ...testWindow,
      location: {
        ...testWindow.location,
        replace: replaceSpy,
      },
    }));
  });

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  describe('initialize()', () => {

    test('should be a function', () => {
      const Auth0 = require('./Auth0');
      expect(Auth0.initialize).toBeInstanceOf(Function);
    });

    test('should throw if configuration object is missing', () => {
      expect(() => {
        const Auth0 = require('./Auth0');
        Auth0.initialize();
      }).toThrow();
    });

    test('should throw if configuration object is invalid', () => {
      INVALID_PARAMS.forEach((invalid) => {
        expect(() => {
          const Auth0 = require('./Auth0');
          Auth0.initialize(invalid);
        }).toThrow();
      });
    });

    // TODO: test against the config object
    test('should create a new Auth0Lock instance', () => {
      const Auth0 = require('./Auth0');
      const Auth0Lock = require('auth0-lock');
      Auth0.initialize(MOCK_CONFIG);
      expect(Auth0Lock).toHaveBeenCalledTimes(1);
      expect(Auth0Lock).toHaveBeenCalledWith(
        __AUTH0_CLIENT_ID__,
        __AUTH0_DOMAIN__,
        {
          _enableIdPInitiatedLogin: true,
          allowSignUp: true,
          auth: {
            autoParseHash: false,
            params: {
              scope: 'openid email user_id user_metadata app_metadata nickname roles',
            },
            redirectUrl: '',
            responseType: 'token',
            sso: false,
            state: '',
          },
          clientBaseUrl: 'https://cdn.auth0.com',
          closable: false,
          configurationBaseUrl: 'https://cdn.auth0.com',
          hashCleanup: false,
          languageDictionary: {
            title: 'Title',
          },
          rememberLastLogin: false,
          theme: {
            logo: 'Logo',
            primaryColor: '#7860ff',
          },
        }
      );
    });

    // TODO: should call Auth0.parseHashPath()
    // test('should call Auth0.parseHashPath()', () => {});

    test('should call getAuthToken()', () => {
      const Auth0 = require('./Auth0');
      const { getAuthToken } = require('./utils');
      Auth0.initialize(MOCK_CONFIG);
      expect(getAuthToken).toHaveBeenCalledTimes(1);
    });

    test('should call hasAuthTokenExpired()', () => {
      const Auth0 = require('./Auth0');
      const { hasAuthTokenExpired } = require('./utils');
      Auth0.initialize(MOCK_CONFIG);
      expect(hasAuthTokenExpired).toHaveBeenCalledTimes(1);
      expect(hasAuthTokenExpired).toHaveBeenCalledWith(MOCK_AUTH_TOKEN);
    });

  });

  describe('getAuth0LockInstance', () => {

    test('should be a function', () => {
      const Auth0 = require('./Auth0');
      expect(Auth0.getAuth0LockInstance).toBeInstanceOf(Function);
    });

    test('should throw if Auth0Lock has not been initialized', () => {
      expect(() => {
        const Auth0 = require('./Auth0');
        Auth0.getAuth0LockInstance();
      }).toThrow();
    });

    test('should return the Auth0Lock instance', () => {

      const mockAuth0LockInstance = {
        test: genRandomString()
      };

      jest.doMock('auth0-lock', () => jest.fn(() => mockAuth0LockInstance));

      const Auth0 = require('./Auth0');
      Auth0.initialize(MOCK_CONFIG);
      const auth0LockInstance = Auth0.getAuth0LockInstance();
      expect(auth0LockInstance).toBeDefined();
      expect(auth0LockInstance).toBe(mockAuth0LockInstance);
    });

  });

  describe('parseUrl()', () => {

    test('should be a function', () => {
      const Auth0 = require('./Auth0');
      expect(Auth0.parseUrl).toBeInstanceOf(Function);
    });

    test('should return default object if the given location is missing properties', () => {
      const Auth0 = require('./Auth0');
      expect(Auth0.parseUrl({})).toEqual({
        fragment: '',
        redirectUrl: '',
        state: '',
      });
    });

    test('should parse query string params', () => {
      const Auth0 = require('./Auth0');
      const mockQueryString = qs.stringify(
        { redirectUrl: 'https://example.com/app' },
        { addQueryPrefix: true },
      );
      const url = `${MOCK_URL}${mockQueryString}`;
      global.jsdom.reconfigure({ url });
      expect(Auth0.parseUrl({ href: url, search: mockQueryString })).toEqual({
        fragment: '',
        redirectUrl: 'https://example.com/app',
        state: '',
      });
      expect(replaceSpy).not.toHaveBeenCalled();
    });

    test('should not replace url if "access_token" is missing', () => {
      const Auth0 = require('./Auth0');
      const fragment = `/id_token=${genRandomString()}`;
      const url = `${MOCK_URL}/#${fragment}`;
      global.jsdom.reconfigure({ url });
      expect(Auth0.parseUrl({ href: url })).toEqual({
        fragment,
        redirectUrl: '',
        state: '',
      });
      expect(replaceSpy).not.toHaveBeenCalled();
    });

    test('should not replace url if "id_token" is missing', () => {
      const Auth0 = require('./Auth0');
      const fragment = `/access_token=${genRandomString()}`;
      const url = `${MOCK_URL}/#${fragment}`;
      global.jsdom.reconfigure({ url });
      expect(Auth0.parseUrl({ href: url })).toEqual({
        fragment,
        redirectUrl: '',
        state: '',
      });
      expect(replaceSpy).not.toHaveBeenCalled();
    });

    test('should replace url when both "access_token" and "id_token" are present', () => {
      const Auth0 = require('./Auth0');
      const state = genRandomString();
      const fragment = `access_token=${genRandomString()}&id_token=${genRandomString()}&state=${state}`;
      let url = `${MOCK_URL}#${fragment}`;
      global.jsdom.reconfigure({ url });
      expect(Auth0.parseUrl({ href: url })).toEqual({
        fragment,
        state,
        redirectUrl: '',
      });
      expect(window.location.href).toEqual(MOCK_LOGIN_URL);

      url = `${MOCK_URL}/#${fragment}`;
      global.jsdom.reconfigure({ url });
      expect(Auth0.parseUrl({ href: url })).toEqual({
        fragment,
        state,
        redirectUrl: '',
      });
      expect(window.location.href).toEqual(MOCK_LOGIN_URL);

      url = `${MOCK_URL}/#/${fragment}`;
      global.jsdom.reconfigure({ url });
      expect(Auth0.parseUrl({ href: url })).toEqual({
        state,
        fragment: `/${fragment}`,
        redirectUrl: '',
      });
      expect(window.location.href).toEqual(MOCK_LOGIN_URL);

      expect(replaceSpy).toHaveBeenCalledTimes(3);
      expect(replaceSpy).toHaveBeenCalledWith(MOCK_LOGIN_URL);
    });

  });

  describe('authenticate()', () => {

    test('should be a function', () => {
      const Auth0 = require('./Auth0');
      expect(Auth0.authenticate).toBeInstanceOf(Function);
    });

    test('should return a Promise', () => {
      const Auth0 = require('./Auth0');
      const promise = Auth0.authenticate().catch(() => {});
      expect(promise).toEqual(expect.any(Promise));
    });

    test('should fail to authenticate if the url hash path has not been set', (done) => {

      const Auth0 = require('./Auth0');
      Auth0.authenticate()
        .then(() => done.fail(Error('fail')))
        .catch((e :Error) => {
          expect(e).toEqual(expect.any(Error));
          expect(e.message).toEqual('Auth0 fragment identifier has not been parsed');
          done();
        });
    });

    // TODO: how do we mock what "new Auth0Lock" returns?
    // test('should fail to authenticate if the Auth0Lock has not been instantiated', () => {});

    test('should fail to authenticate if Auth0Lock calls on("authorization_error")', (done) => {

      jest.doMock('auth0-lock', () => jest.fn(() => ({
        on: jest.fn((event :string, callback :Function) => {
          if (event === 'authorization_error') {
            callback();
          }
        }),
        resumeAuth: jest.fn()
      })));
      global.jsdom.reconfigure({ url: MOCK_AUTH0_URL });

      const Auth0 = require('./Auth0');
      Auth0.initialize(MOCK_CONFIG);
      Auth0.authenticate()
        .then(() => done.fail(Error('fail')))
        .catch((e :Error) => {
          expect(e).toEqual(expect.any(Error));
          expect(e.message).toEqual('Auth0Lock : on("authorization_error")');
          done();
        });
    });

    test('should fail to authenticate if Auth0Lock calls on("unrecoverable_error")', (done) => {

      jest.doMock('auth0-lock', () => jest.fn(() => ({
        on: jest.fn((event :string, callback :Function) => {
          if (event === 'unrecoverable_error') {
            callback();
          }
        }),
        resumeAuth: jest.fn()
      })));
      global.jsdom.reconfigure({ url: MOCK_AUTH0_URL });

      const Auth0 = require('./Auth0');
      Auth0.initialize(MOCK_CONFIG);
      Auth0.authenticate()
        .then(() => done.fail(Error('fail')))
        .catch((e :Error) => {
          expect(e).toEqual(expect.any(Error));
          expect(e.message).toEqual('Auth0Lock : on("unrecoverable_error")');
          done();
        });
    });

    test('should fail to authenticate if Auth0Lock calls on("authenticated") with auth info missing', (done) => {

      jest.doMock('auth0-lock', () => jest.fn(() => ({
        on: jest.fn((event :string, callback :Function) => {
          if (event === 'authenticated') {
            callback();
          }
        }),
        resumeAuth: jest.fn()
      })));
      global.jsdom.reconfigure({ url: MOCK_AUTH0_URL });

      const Auth0 = require('./Auth0');
      Auth0.initialize(MOCK_CONFIG);
      Auth0.authenticate()
        .then(() => done.fail(Error('fail')))
        .catch((e :Error) => {
          expect(e).toEqual(expect.any(Error));
          expect(e.message).toEqual('Auth0Lock : on("authenticated") - auth info missing');
          done();
        });
    });

    test('should fail to authenticate if Auth0Lock calls on("authenticated") with "accessToken" missing', (done) => {

      jest.doMock('auth0-lock', () => jest.fn(() => ({
        on: jest.fn((event :string, callback :Function) => {
          if (event === 'authenticated') {
            callback({ idToken: genRandomString() });
          }
        }),
        resumeAuth: jest.fn()
      })));
      global.jsdom.reconfigure({ url: MOCK_AUTH0_URL });

      const Auth0 = require('./Auth0');
      Auth0.initialize(MOCK_CONFIG);
      Auth0.authenticate()
        .then(() => done.fail(Error('fail')))
        .catch((e :Error) => {
          expect(e).toEqual(expect.any(Error));
          expect(e.message).toEqual('Auth0Lock : on("authenticated") - auth info missing');
          done();
        });
    });

    test('should fail to authenticate if Auth0Lock calls on("authenticated") with "idToken" missing', (done) => {

      jest.doMock('auth0-lock', () => jest.fn(() => ({
        on: jest.fn((event :string, callback :Function) => {
          if (event === 'authenticated') {
            callback({ accessToken: genRandomString() });
          }
        }),
        resumeAuth: jest.fn()
      })));
      global.jsdom.reconfigure({ url: MOCK_AUTH0_URL });

      const Auth0 = require('./Auth0');
      Auth0.initialize(MOCK_CONFIG);
      Auth0.authenticate()
        .then(() => done.fail(Error('fail')))
        .catch((e :Error) => {
          expect(e).toEqual(expect.any(Error));
          expect(e.message).toEqual('Auth0Lock : on("authenticated") - auth info missing');
          done();
        });
    });

    test('should fail to authenticate if Auth0Lock calls on("authenticated") with an expired token', (done) => {

      jest.doMock('auth0-lock', () => jest.fn(() => ({
        on: jest.fn((event :string, callback :Function) => {
          if (event === 'authenticated') {
            callback({ accessToken: genRandomString(), idToken: -1 });
          }
        }),
        resumeAuth: jest.fn()
      })));
      global.jsdom.reconfigure({ url: MOCK_AUTH0_URL });

      const Auth0 = require('./Auth0');
      Auth0.initialize(MOCK_CONFIG);
      Auth0.authenticate()
        .then(() => done.fail(Error('fail')))
        .catch((e :Error) => {
          expect(e).toEqual(expect.any(Error));
          expect(e.message).toEqual('Auth0Lock : on("authenticated") - auth token expired');
          done();
        });
    });

    test('should fail to authenticate if Auth0Lock calls on("hash_parsed") with auth info missing', (done) => {

      jest.doMock('auth0-lock', () => jest.fn(() => ({
        on: jest.fn((event :string, callback :Function) => {
          if (event === 'hash_parsed') {
            callback();
          }
        }),
        resumeAuth: jest.fn()
      })));
      global.jsdom.reconfigure({ url: MOCK_AUTH0_URL });

      const Auth0 = require('./Auth0');
      Auth0.initialize(MOCK_CONFIG);
      Auth0.authenticate()
        .then(() => done.fail(Error('fail')))
        .catch((e :Error) => {
          expect(e).toEqual(expect.any(Error));
          expect(e.message).toEqual('Auth0Lock : on("hash_parsed") - auth info missing');
          done();
        });
    });

    test('should fail to authenticate if Auth0Lock calls on("hash_parsed") with "accessToken" missing', (done) => {

      jest.doMock('auth0-lock', () => jest.fn(() => ({
        on: jest.fn((event :string, callback :Function) => {
          if (event === 'hash_parsed') {
            callback({ idToken: genRandomString() });
          }
        }),
        resumeAuth: jest.fn()
      })));
      global.jsdom.reconfigure({ url: MOCK_AUTH0_URL });

      const Auth0 = require('./Auth0');
      Auth0.initialize(MOCK_CONFIG);
      Auth0.authenticate()
        .then(() => done.fail(Error('fail')))
        .catch((e :Error) => {
          expect(e).toEqual(expect.any(Error));
          expect(e.message).toEqual('Auth0Lock : on("hash_parsed") - auth info missing');
          done();
        });
    });

    test('should fail to authenticate if Auth0Lock calls on("hash_parsed") with "idToken" missing', (done) => {

      jest.doMock('auth0-lock', () => jest.fn(() => ({
        on: jest.fn((event :string, callback :Function) => {
          if (event === 'hash_parsed') {
            callback({ accessToken: genRandomString() });
          }
        }),
        resumeAuth: jest.fn()
      })));
      global.jsdom.reconfigure({ url: MOCK_AUTH0_URL });

      const Auth0 = require('./Auth0');
      Auth0.initialize(MOCK_CONFIG);
      Auth0.authenticate()
        .then(() => done.fail(Error('fail')))
        .catch((e :Error) => {
          expect(e).toEqual(expect.any(Error));
          expect(e.message).toEqual('Auth0Lock : on("hash_parsed") - auth info missing');
          done();
        });
    });

    test('should fail to authenticate if Auth0Lock calls on("hash_parsed") with an expired token', (done) => {

      jest.doMock('auth0-lock', () => jest.fn(() => ({
        on: jest.fn((event :string, callback :Function) => {
          if (event === 'hash_parsed') {
            callback({ accessToken: genRandomString(), idToken: -1 });
          }
        }),
        resumeAuth: jest.fn()
      })));
      global.jsdom.reconfigure({ url: MOCK_AUTH0_URL });

      const Auth0 = require('./Auth0');
      Auth0.initialize(MOCK_CONFIG);
      Auth0.authenticate()
        .then(() => done.fail(Error('fail')))
        .catch((e :Error) => {
          expect(e).toEqual(expect.any(Error));
          expect(e.message).toEqual('Auth0Lock : on("hash_parsed") - auth token expired');
          done();
        });
    });

    test('should authenticate successfully', (done) => {

      const mockAuthInfo = {
        accessToken: genRandomString(),
        idToken: genRandomString()
      };

      jest.doMock('./utils', () => ({
        clearAuthInfo: jest.fn(),
        getAuthToken: jest.fn(),
        hasAuthTokenExpired: jest.fn(() => false)
      }));

      jest.doMock('auth0-lock', () => jest.fn(() => ({
        on: jest.fn((event :string, callback :Function) => {
          if (event === 'authenticated') {
            callback(mockAuthInfo);
          }
        }),
        resumeAuth: jest.fn()
      })));
      global.jsdom.reconfigure({ url: MOCK_AUTH0_URL });

      const Auth0 = require('./Auth0');
      Auth0.initialize(MOCK_CONFIG);
      Auth0.authenticate()
        .then((value :Object) => {
          expect(value).toBeDefined();
          expect(value).toEqual({
            authInfo: mockAuthInfo,
            state: MOCK_STATE,
          });
          done();
        })
        .catch(() => done.fail(Error('fail')));
    });

  });

});
