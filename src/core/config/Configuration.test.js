/* eslint-disable global-require */

import { List, fromJS } from 'immutable';

import * as Auth0 from '../auth/Auth0';
import { INVALID_PARAMS } from '../../common/constants/testing';

// injected by Jest
declare var __AUTH0_CLIENT_ID__;
declare var __AUTH0_DOMAIN__;

const MOCK_AUTH0_LOCK = fromJS({
  allowSignUp: true,
  logo: '/static/assets/images/logo.abc123.png',
  title: 'Title',
  primaryColor: '#6124e2'
});
const MOCK_AUTH_TOKEN = 'mock.auth.token';

let Config = null;

jest.mock('../auth/Auth0');

describe('Configuration', () => {

  beforeEach(() => {
    jest.resetModules();
    Auth0.initialize.mockClear();
    Config = require('./Configuration');
  });

  describe('configure()', () => {

    test('should throw if configuration object is missing', () => {
      expect(() => {
        Config.configure();
      }).toThrow();
    });

    test('should throw if configuration object is invalid', () => {
      INVALID_PARAMS.forEach((invalid) => {
        expect(() => {
          Config.configure(invalid);
        }).toThrow();
      });
    });

    test('should correctly set the configuration object', () => {

      Config.configure({
        auth0Lock: MOCK_AUTH0_LOCK.toJS(),
        authToken: MOCK_AUTH_TOKEN,
        baseUrl: 'localhost'
      });
      expect(Config.getConfig().toJS()).toEqual({
        auth0ClientId: null,
        auth0Domain: null,
        auth0Lock: MOCK_AUTH0_LOCK.toJS(),
        authToken: MOCK_AUTH_TOKEN,
        baseUrl: 'http://localhost:8080'
      });

      Config.configure({
        auth0Lock: MOCK_AUTH0_LOCK.toJS(),
        authToken: MOCK_AUTH_TOKEN,
        baseUrl: 'staging'
      });
      expect(Config.getConfig().toJS()).toEqual({
        auth0ClientId: null,
        auth0Domain: null,
        auth0Lock: MOCK_AUTH0_LOCK.toJS(),
        authToken: MOCK_AUTH_TOKEN,
        baseUrl: 'https://api.staging.getmethodic.com'
      });

      Config.configure({
        auth0ClientId: __AUTH0_CLIENT_ID__,
        auth0Domain: __AUTH0_DOMAIN__,
        auth0Lock: MOCK_AUTH0_LOCK.toJS(),
        authToken: MOCK_AUTH_TOKEN,
        baseUrl: 'production'
      });
      expect(Config.getConfig().toJS()).toEqual({
        auth0ClientId: __AUTH0_CLIENT_ID__,
        auth0Domain: __AUTH0_DOMAIN__,
        auth0Lock: MOCK_AUTH0_LOCK.toJS(),
        authToken: MOCK_AUTH_TOKEN,
        baseUrl: 'https://api.getmethodic.com'
      });
    });

    describe('auth0ClientId', () => {

      test('should not throw if auth0ClientId is missing', () => {
        expect(() => {
          Config.configure({
            auth0Lock: MOCK_AUTH0_LOCK.toJS(),
            authToken: MOCK_AUTH_TOKEN,
            baseUrl: 'localhost'
          });
        }).not.toThrow();
      });

      test('should throw if auth0ClientId is invalid', () => {
        List(INVALID_PARAMS)
          .delete(0) // remove undefined
          .delete(0) // remove null
          .delete(14) // remove "invalid_special_string_value"
          .forEach((invalid) => {
            expect(() => {
              Config.configure({
                auth0ClientId: invalid,
                auth0Lock: MOCK_AUTH0_LOCK.toJS(),
                authToken: MOCK_AUTH_TOKEN,
                baseUrl: 'localhost'
              });
            }).toThrow();
          });
      });

      test('should correctly set the default auth0ClientId if it is not specified', () => {
        Config.configure({
          auth0Lock: MOCK_AUTH0_LOCK.toJS(),
          authToken: MOCK_AUTH_TOKEN,
          baseUrl: 'localhost'
        });
        expect(Config.getConfig().get('auth0ClientId')).toEqual(null);
      });

      test('should correctly set auth0ClientId', () => {
        const mockValue = 'mock-auth0-client-id';
        Config.configure({
          auth0ClientId: mockValue,
          auth0Lock: MOCK_AUTH0_LOCK.toJS(),
          authToken: MOCK_AUTH_TOKEN,
          baseUrl: 'localhost'
        });
        expect(Config.getConfig().get('auth0ClientId')).toEqual(mockValue);
      });

    });

    describe('auth0Domain', () => {

      test('should not throw if auth0Domain is missing', () => {
        expect(() => {
          Config.configure({
            auth0Lock: MOCK_AUTH0_LOCK.toJS(),
            authToken: MOCK_AUTH_TOKEN,
            baseUrl: 'localhost'
          });
        }).not.toThrow();
      });

      test('should throw if auth0Domain is invalid', () => {
        List(INVALID_PARAMS)
          .delete(0) // remove undefined
          .delete(0) // remove null
          .delete(14) // remove "invalid_special_string_value"
          .forEach((invalid) => {
            expect(() => {
              Config.configure({
                auth0Domain: invalid,
                auth0Lock: MOCK_AUTH0_LOCK.toJS(),
                authToken: MOCK_AUTH_TOKEN,
                baseUrl: 'localhost'
              });
            }).toThrow();
          });
      });

      test('should correctly set the default auth0Domain if it is not specified', () => {
        Config.configure({
          auth0Lock: MOCK_AUTH0_LOCK.toJS(),
          authToken: MOCK_AUTH_TOKEN,
          baseUrl: 'localhost'
        });
        expect(Config.getConfig().get('auth0Domain')).toEqual(null);
      });

      test('should correctly set auth0Domain', () => {
        const mockValue = 'mock-auth0-domain';
        Config.configure({
          auth0Domain: mockValue,
          auth0Lock: MOCK_AUTH0_LOCK.toJS(),
          authToken: MOCK_AUTH_TOKEN,
          baseUrl: 'localhost'
        });
        expect(Config.getConfig().get('auth0Domain')).toEqual(mockValue);
      });

    });

    describe('auth0Lock', () => {

      test('should not throw if auth0Lock is missing', () => {
        expect(() => {
          Config.configure({
            authToken: MOCK_AUTH_TOKEN,
            baseUrl: 'localhost'
          });
        }).not.toThrow();
      });

      test('should throw if auth0Lock is invalid', () => {
        List(INVALID_PARAMS)
          .delete(0) // remove undefined
          .delete(0) // remove null
          .forEach((invalid) => {
            expect(() => {
              Config.configure({
                auth0Lock: invalid,
                authToken: MOCK_AUTH_TOKEN,
                baseUrl: 'localhost'
              });
            }).toThrow();
          });
      });

      describe('allowSignUp', () => {

        test('should not throw if auth0Lock.allowSignUp is missing', () => {
          expect(() => {
            Config.configure({
              auth0Lock: MOCK_AUTH0_LOCK.delete('allowSignUp').toJS(),
              authToken: MOCK_AUTH_TOKEN,
              baseUrl: 'localhost'
            });
          }).not.toThrow();
        });

        test('should throw if auth0Lock.allowSignUp is invalid', () => {
          const errors = [];
          List(INVALID_PARAMS)
            .delete(0) // remove undefined
            .delete(0) // remove null
            .delete(4) // remove true
            .delete(4) // remove false
            .delete(4) // remove new Boolean(true)
            .delete(4) // remove new Boolean(false)
            .forEach((invalid) => {
              try {
                Config.configure({
                  auth0Lock: MOCK_AUTH0_LOCK.set('allowSignUp', invalid).toJS(),
                  authToken: MOCK_AUTH_TOKEN,
                  baseUrl: 'localhost'
                });
                errors.push(`expected to throw - ${JSON.stringify(invalid)}`);
              }
              catch (e) { /* pass */ }
            });
          expect(errors).toEqual([]);
        });

        test('should correctly set auth0Lock.allowSignUp', () => {
          Config.configure({
            auth0Lock: MOCK_AUTH0_LOCK.set('allowSignUp', true).toJS(),
            authToken: MOCK_AUTH_TOKEN,
            baseUrl: 'localhost',
          });
          expect(Config.getConfig().getIn(['auth0Lock', 'allowSignUp'])).toEqual(true);
          Config.configure({
            auth0Lock: MOCK_AUTH0_LOCK.set('allowSignUp', false).toJS(),
            authToken: MOCK_AUTH_TOKEN,
            baseUrl: 'localhost',
          });
          expect(Config.getConfig().getIn(['auth0Lock', 'allowSignUp'])).toEqual(false);
        });

      });

      describe('logo', () => {

        test('should not throw if auth0Lock.logo is missing', () => {
          expect(() => {
            Config.configure({
              auth0Lock: MOCK_AUTH0_LOCK.delete('logo').toJS(),
              authToken: MOCK_AUTH_TOKEN,
              baseUrl: 'localhost'
            });
          }).not.toThrow();
        });

        test('should throw if auth0Lock.logo is invalid', () => {
          List(INVALID_PARAMS)
            .delete(0) // remove undefined
            .delete(0) // remove null
            .delete(14) // remove "invalid_special_string_value"
            .forEach((invalid) => {
              expect(() => {
                Config.configure({
                  auth0Lock: MOCK_AUTH0_LOCK.set('logo', invalid).toJS(),
                  authToken: MOCK_AUTH_TOKEN,
                  baseUrl: 'localhost'
                });
              }).toThrow();
            });
        });

        // test('should correctly set the default auth0Lock.logo if it is not specified', () => {
        //   Config.configure({
        //     authToken: MOCK_AUTH_TOKEN,
        //     baseUrl: 'localhost'
        //   });
        //   expect(Config.getConfig().getIn(['auth0Lock', 'logo'])).toEqual('__FIGURE_THIS_OUT__');
        // });

        test('should correctly set auth0Lock.logo', () => {
          const mockValue = 'mock-logo';
          Config.configure({
            auth0Lock: MOCK_AUTH0_LOCK.set('logo', mockValue).toJS(),
            authToken: MOCK_AUTH_TOKEN,
            baseUrl: 'localhost'
          });
          expect(Config.getConfig().getIn(['auth0Lock', 'logo'])).toEqual(mockValue);
        });

      });

      describe('primaryColor', () => {

        test('should not throw if auth0Lock.primaryColor is missing', () => {
          expect(() => {
            Config.configure({
              auth0Lock: MOCK_AUTH0_LOCK.delete('primaryColor').toJS(),
              authToken: MOCK_AUTH_TOKEN,
              baseUrl: 'localhost'
            });
          }).not.toThrow();
        });

        test('should throw if auth0Lock.primaryColor is invalid', () => {
          const errors = [];
          List(INVALID_PARAMS)
            .delete(0) // remove undefined
            .delete(0) // remove null
            .delete(14) // remove "invalid_special_string_value"
            .forEach((invalid) => {
              try {
                Config.configure({
                  auth0Lock: MOCK_AUTH0_LOCK.set('primaryColor', invalid).toJS(),
                  authToken: MOCK_AUTH_TOKEN,
                  baseUrl: 'localhost'
                });
                errors.push(`expected to throw - ${JSON.stringify(invalid)}`);
              }
              catch (e) { /* pass */ }
            });
          expect(errors).toEqual([]);
        });

        test('should correctly set auth0Lock.primaryColor', () => {
          Config.configure({
            auth0Lock: MOCK_AUTH0_LOCK.set('primaryColor', 'deeppink').toJS(),
            authToken: MOCK_AUTH_TOKEN,
            baseUrl: 'localhost',
          });
          expect(Config.getConfig().getIn(['auth0Lock', 'primaryColor'])).toEqual('deeppink');
        });

      });

      describe('title', () => {

        test('should not throw if auth0Lock.title is missing', () => {
          expect(() => {
            Config.configure({
              auth0Lock: MOCK_AUTH0_LOCK.delete('title').toJS(),
              authToken: MOCK_AUTH_TOKEN,
              baseUrl: 'localhost'
            });
          }).not.toThrow();
        });

        test('should throw if auth0Lock.title is invalid', () => {
          List(INVALID_PARAMS)
            .delete(0) // remove undefined
            .delete(0) // remove null
            .delete(14) // remove "invalid_special_string_value"
            .forEach((invalid) => {
              expect(() => {
                Config.configure({
                  auth0Lock: MOCK_AUTH0_LOCK.set('title', invalid).toJS(),
                  authToken: MOCK_AUTH_TOKEN,
                  baseUrl: 'localhost'
                });
              }).toThrow();
            });
        });

        // test('should correctly set the default auth0Lock.title if it is not specified', () => {
        //   Config.configure({
        //     authToken: MOCK_AUTH_TOKEN,
        //     baseUrl: 'localhost'
        //   });
        //   expect(Config.getConfig().getIn(['auth0Lock', 'title'])).toEqual('__FIGURE_THIS_OUT__');
        // });

        test('should correctly set auth0Lock.title', () => {
          const mockValue = 'mock-lock-title';
          Config.configure({
            auth0Lock: MOCK_AUTH0_LOCK.set('title', mockValue).toJS(),
            authToken: MOCK_AUTH_TOKEN,
            baseUrl: 'localhost'
          });
          expect(Config.getConfig().getIn(['auth0Lock', 'title'])).toEqual(mockValue);
        });

      });

    });

    describe('authToken', () => {

      test('should throw if authToken is invalid', () => {
        List(INVALID_PARAMS)
          .delete(0) // remove undefined
          .delete(0) // remove null
          .delete(14) // remove "invalid_special_string_value"
          .forEach((invalid) => {
            expect(() => {
              Config.configure({
                auth0Lock: MOCK_AUTH0_LOCK.toJS(),
                authToken: invalid,
                baseUrl: 'localhost'
              });
            }).toThrow();
          });
      });

      test('should not throw if authToken is undefined', () => {

        expect(() => {
          Config.configure({
            baseUrl: 'localhost'
          });
        }).not.toThrow();

        expect(() => {
          Config.configure({
            authToken: undefined,
            baseUrl: 'localhost'
          });
        }).not.toThrow();
      });

      test('should not set authToken if authToken is undefined', () => {

        Config.configure({
          baseUrl: 'localhost'
        });
        expect(Config.getConfig().has('authToken')).toEqual(false);
        expect(Config.getConfig().get('authToken')).toBeUndefined();

        Config.configure({
          authToken: undefined,
          baseUrl: 'localhost'
        });
        expect(Config.getConfig().has('authToken')).toEqual(false);
        expect(Config.getConfig().get('authToken')).toBeUndefined();
      });

      test('should not throw if authToken is null', () => {
        expect(() => {
          Config.configure({
            authToken: null,
            baseUrl: 'localhost'
          });
        }).not.toThrow();
      });

      test('should not set authToken if authToken is null', () => {
        Config.configure({
          authToken: null,
          baseUrl: 'localhost'
        });
        expect(Config.getConfig().has('authToken')).toEqual(false);
        expect(Config.getConfig().get('authToken')).toBeUndefined();
      });

      test('should correctly set authToken', () => {
        Config.configure({
          authToken: MOCK_AUTH_TOKEN,
          baseUrl: 'localhost'
        });
        expect(Config.getConfig().get('authToken')).toEqual(MOCK_AUTH_TOKEN);
      });

    });

    describe('baseUrl', () => {

      test('should not throw if baseUrl is missing', () => {
        expect(() => {
          Config.configure({
            authToken: MOCK_AUTH_TOKEN
          });
        }).not.toThrow();
      });

      test('should throw if baseUrl is invalid', () => {
        List(INVALID_PARAMS)
          .delete(0) // remove undefined
          .delete(0) // remove null
          .forEach((invalid) => {
            expect(() => {
              Config.configure({
                authToken: MOCK_AUTH_TOKEN,
                baseUrl: invalid
              });
            }).toThrow();
          });
      });

      test('should throw if baseUrl is not https', () => {
        expect(() => {
          Config.configure({
            authToken: MOCK_AUTH_TOKEN,
            baseUrl: 'http://api.getmethodic.com'
          });
        }).toThrow();
      });

      test('should correctly set baseUrl when a valid URL is passed in', () => {

        Config.configure({
          authToken: MOCK_AUTH_TOKEN,
          baseUrl: 'https://api.v2.getmethodic.com'
        });
        expect(Config.getConfig().get('baseUrl')).toEqual('https://api.v2.getmethodic.com');
      });

      test('should correctly set baseUrl to "http://localhost:8080"', () => {

        Config.configure({
          authToken: MOCK_AUTH_TOKEN,
          baseUrl: 'localhost'
        });
        expect(Config.getConfig().get('baseUrl')).toEqual('http://localhost:8080');

        Config.configure({
          authToken: MOCK_AUTH_TOKEN,
          baseUrl: 'http://localhost:8080'
        });
        expect(Config.getConfig().get('baseUrl')).toEqual('http://localhost:8080');
      });

      test('should correctly set baseUrl to "https://api.staging.getmethodic.com"', () => {

        Config.configure({
          authToken: MOCK_AUTH_TOKEN,
          baseUrl: 'staging'
        });
        expect(Config.getConfig().get('baseUrl')).toEqual('https://api.staging.getmethodic.com');

        Config.configure({
          authToken: MOCK_AUTH_TOKEN,
          baseUrl: 'https://api.staging.getmethodic.com'
        });
        expect(Config.getConfig().get('baseUrl')).toEqual('https://api.staging.getmethodic.com');
      });

      test('should correctly set baseUrl to "https://api.getmethodic.com"', () => {

        Config.configure({
          authToken: MOCK_AUTH_TOKEN,
          baseUrl: 'production'
        });
        expect(Config.getConfig().get('baseUrl')).toEqual('https://api.getmethodic.com');

        Config.configure({
          authToken: MOCK_AUTH_TOKEN,
          baseUrl: 'https://api.getmethodic.com'
        });
        expect(Config.getConfig().get('baseUrl')).toEqual('https://api.getmethodic.com');
      });

    });

  });

  describe('getConfig()', () => {

    test('should be an instance of Immutable.Map', () => {
      // expect(Config.getConfig()).toBeInstanceOf(Immutable.Map);
      expect(Config.getConfig()['@@__IMMUTABLE_MAP__@@']).toEqual(true);
    });

    test('should not be mutable', () => {
      Config.getConfig().set('foo', 'bar');
      expect(Config.getConfig().get('foo')).toBeUndefined();
    });

    test('should not be empty', () => {
      expect(Config.getConfig().isEmpty()).toEqual(false);
    });

    test('should set correct default value for authToken', () => {
      expect(Config.getConfig().get('authToken')).toEqual(null);
    });

    test('should set correct default value for baseUrl', () => {
      expect(Config.getConfig().get('baseUrl')).toEqual(null);
    });

  });

});
