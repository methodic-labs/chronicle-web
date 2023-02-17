/*
 * @flow
 */

import qs from 'qs';

import redirectToLogin from './redirectToLogin';

const MOCK_URL = new URL('https://test.com/app/#/hello/world');

describe('redirectToLogin()', () => {

  const windowSpy = jest.spyOn(global, 'window', 'get');
  let replaceSpy;

  beforeAll(() => {
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

  test('should replace url with the login url containing the correct redirectUrl as a query string param', () => {

    const queryString = qs.stringify(
      { redirectUrl: MOCK_URL.toString() },
      { addQueryPrefix: true },
    );
    global.jsdom.reconfigure({ url: MOCK_URL.toString() });
    // $FlowIgnore
    redirectToLogin({ href: MOCK_URL.href, origin: MOCK_URL.origin });
    expect(replaceSpy).toHaveBeenCalledTimes(1);
    expect(replaceSpy).toHaveBeenCalledWith(`${MOCK_URL.origin}/login/${queryString}`);

    // TODO: why is this failing?
    // expect(window.location.href).toEqual(`${MOCK_URL.origin}/login/${queryString}`);
  });

});
