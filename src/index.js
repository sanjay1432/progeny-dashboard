import React from "react"
import ReactDOM from "react-dom"
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom"
import "rsuite/lib/styles/index.less"
import "assets/scss/progeny.scss?v1.1.0"
import { BASE_NAME, DASHBOARD_VERSION } from "./constants/index"
import { Provider } from "react-redux"
import configureAppStore from "./redux/store"
import StateLoader from "./redux/StateLoader"
import Login from "./views/Login"
import Overview from "./views/Overview"
import { AbilityContext } from "./config/Can"
import ability from "./config/ability"
import * as serviceWorkerRegistration from "./serviceWorkerRegistration"
import { Notification, ButtonToolbar, Button } from "rsuite"
const stateLoader = new StateLoader()
configureAppStore.subscribe(() => {
  stateLoader.saveState(configureAppStore.getState())
})

const appVersion = localStorage.getItem("DASHBOARD-VERSION")
if (appVersion && appVersion !== DASHBOARD_VERSION) {
  console.error("test", appVersion)
  localStorage.clear()
  localStorage.setItem("DASHBOARD-VERSION", DASHBOARD_VERSION)
} else {
  localStorage.setItem("DASHBOARD-VERSION", DASHBOARD_VERSION)
}

ReactDOM.render(
  <Provider store={configureAppStore}>
    <AbilityContext.Provider value={ability}>
      <BrowserRouter basename={`${BASE_NAME}`}>
        <Switch>
          <Route
            path="/overview"
            exact
            render={props => <Overview {...props} />}
          />
          <Route path="/login" exact render={props => <Login {...props} />} />
          <Redirect to="/overview" />
        </Switch>
      </BrowserRouter>
    </AbilityContext.Provider>
  </Provider>,
  document.getElementById("root")
)
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
              Notification.close()
              caches.keys().then(function (cacheNames) {
                return Promise.all(
                  cacheNames
                    .filter(cacheName => {
                      // Return true if you want to remove this cache,
                      // but remember that caches are shared across
                      // the whole origin
                      return cacheName.search("localhost") >= 0
                    })
                    .map(function (cacheName) {
                      return caches.delete(cacheName)
                    })
                )
              })
              window.location.reload()
            }}
          >
            Refresh Application
          </Button>
          <Button
            onClick={() => {
              Notification.close()
            }}
          >
            Cancel
          </Button>
        </ButtonToolbar>
      </div>
    )
  })
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({ notification: () => open() })
