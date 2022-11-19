/*
 * @flow
 */

import './core/i18n';

import ReactDOM from 'react-dom';
import { Suspense } from 'react';

import { ConnectedRouter } from 'connected-react-router/immutable';
import {
  Colors,
  LatticeLuxonUtils,
  MuiPickersUtilsProvider,
  StylesProvider,
  ThemeProvider,
  lightTheme,
} from 'lattice-ui-kit';
import { normalize } from 'polished';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';

import AppContainer from './containers/app/AppContainer';
import AuthRoute from './core/router/AuthRoute';
import EnrollmentLink from './containers/enrollment/EnrollmentLink';
import QuestionnaireContainer from './containers/questionnaire/QuestionnaireContainer';
import SurveyContainer from './containers/survey/SurveyContainer';
import TimeUseDiaryContainer from './containers/tud/TimeUseDiaryContainer';
import initializeReduxStore from './core/redux/ReduxStore';
import initializeRouterHistory from './core/router/RouterHistory';
import * as Routes from './core/router/Routes';
import { DeviceUsageSurveyContainer } from './containers/deviceusagesurvey';
import { getAuthToken, getCSRFToken } from './core/auth/utils';
import { configure } from './core/config/Configuration';

// injected by Webpack.DefinePlugin
declare var __AUTH0_CLIENT_ID__ :string;
declare var __AUTH0_DOMAIN__ :string;

const { NEUTRALS, NEUTRAL } = Colors;

/* eslint-disable */
const NormalizeCSS = createGlobalStyle`
  ${normalize()}
`;

const GlobalStyle = createGlobalStyle`
  @supports (font-variation-settings: normal) {
    html {
      font-family: "Inter var", sans-serif;
    }
  }

  html,
  body {
    background-color: ${NEUTRALS[7]};
    color: ${NEUTRAL.N900};
    font-family: Inter, sans-serif;
    line-height: 1.5;
    height: 100%;
    width: 100%;
  }

  * {
    box-sizing: border-box;
  }

  *::before,
  *::after {
    box-sizing: border-box;
  }

  #app {
    display: block;
    height: 100%;
    width: 100%;
  }
`;
/* eslint-enable */

// NOTE - the goal is to render an error page for when someone visits the enrollment link in the browser. the
// original enrollment link points to a path where the app does not exist, i.e. openlattice.com/chronicle/login
// so we need to redirect to where the app does exist, i.e. openlattice.com/chronicle. cloudflare handles the
// redirect and adds an additional query param "enroll" so that we can identify this here.
let enroll = false;
try {
  const params = new URLSearchParams(window.location.search);
  if (params.get('enroll')) {
    enroll = true;
  }
}
catch (e) { /* */ }

if (enroll) {
  const APP_ROOT_NODE = document.getElementById('app');
  if (APP_ROOT_NODE) {
    ReactDOM.render(
      <>
        <EnrollmentLink />
        <NormalizeCSS />
        <GlobalStyle />
      </>,
      APP_ROOT_NODE
    );
  }
}
else {

  configure({
    auth0ClientId: __AUTH0_CLIENT_ID__,
    auth0Domain: __AUTH0_DOMAIN__,
    authToken: getAuthToken(),
    csrfToken: getCSRFToken(),
  });

  const routerHistory = initializeRouterHistory();
  const reduxStore = initializeReduxStore(routerHistory);

  const APP_ROOT_NODE = document.getElementById('app');
  if (APP_ROOT_NODE) {
    ReactDOM.render(
      <Suspense fallback="...">
        <Provider store={reduxStore}>
          <ThemeProvider theme={lightTheme}>
            <MuiPickersUtilsProvider utils={LatticeLuxonUtils}>
              <StylesProvider injectFirst>
                <>
                  <ConnectedRouter history={routerHistory}>
                    <Switch>
                      <Route path={Routes.TUD} component={TimeUseDiaryContainer} />
                      <Route path={Routes.SURVEY} component={SurveyContainer} />
                      <Route path={Routes.QUESTIONNAIRE} component={QuestionnaireContainer} />
                      <Route path={Routes.DEVICE_USAGE_SURVEY} component={DeviceUsageSurveyContainer} />
                      <AuthRoute path={Routes.ROOT} component={AppContainer} />
                    </Switch>
                  </ConnectedRouter>
                  <NormalizeCSS />
                  <GlobalStyle />
                </>
              </StylesProvider>
            </MuiPickersUtilsProvider>
          </ThemeProvider>
        </Provider>
      </Suspense>,
      APP_ROOT_NODE
    );
  }
}
