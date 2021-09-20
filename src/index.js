import React from "react";
import ReactDOM from "react-dom";
import "rsuite/lib/styles/index.less";
import "./assets/scss/progeny.scss";
import {
  DASHBOARD_VERSION,
  TOKEN_NAME,
  REFRESH_TOKEN_NAME,
} from "./constants/index";
import { Provider } from "react-redux";
import configureAppStore from "./redux/store";
import StateLoader from "./redux/StateLoader";
import { Notification, ButtonToolbar, Button } from "rsuite";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak";
import { AppRouter } from "./views/AppRouter";
const stateLoader = new StateLoader();
configureAppStore.subscribe(() => {
  stateLoader.saveState(configureAppStore.getState());
});

const appVersion = localStorage.getItem("DASHBOARD-VERSION");
if (appVersion && appVersion !== DASHBOARD_VERSION) {
  // console.error("test", appVersion)
  localStorage.clear();
  localStorage.setItem("DASHBOARD-VERSION", DASHBOARD_VERSION);
} else {
  localStorage.setItem("DASHBOARD-VERSION", DASHBOARD_VERSION);
}

const eventLogger = (event, error) => {};

const tokenLogger = (tokens) => {
  if (tokens && tokens.token && tokens.refreshToken) {
    localStorage.setItem(TOKEN_NAME, tokens.token);
    localStorage.setItem(REFRESH_TOKEN_NAME, tokens.refreshToken);
  }
};

ReactDOM.render(
  // <ReactKeycloakProvider
  //   authClient={keycloak}
  //   onEvent={eventLogger}
  //   onTokens={tokenLogger}
  //   initOptions={{
  //     onLoad: "login-required",
  //   }}
  // >
    <Provider store={configureAppStore}>
      <AppRouter />
    </Provider>
  // </ReactKeycloakProvider>
  ,
  document.getElementById("root")
);
function open() {
  Notification.info({
    title: "New content is available!",
    placement: "topStart",
    duration: 10000,
    description: (
      <div>
        <p>
          New version is available and will be used when all tabs for this page
          are closed.
        </p>
        <ButtonToolbar>
          <Button
            onClick={() => {
              Notification.close();
              caches.keys().then(function (cacheNames) {
                return Promise.all(
                  cacheNames
                    .filter((cacheName) => {
                      // Return true if you want to remove this cache,
                      // but remember that caches are shared across
                      // the whole origin
                      return cacheName.search("localhost") >= 0;
                    })
                    .map(function (cacheName) {
                      return caches.delete(cacheName);
                    })
                );
              });
              window.location.reload();
            }}
          >
            Refresh Application
          </Button>
          <Button
            onClick={() => {
              Notification.close();
            }}
          >
            Cancel
          </Button>
        </ButtonToolbar>
      </div>
    ),
  });
}
