import React from "react";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";
import { BASE_NAME } from "../constants/index";
import { LOGIN_SUCCESS } from "../redux/actions/types";
import Login from "./Login";
import Overview from "./Overview";
import { Notification, ButtonToolbar, Button, Loader } from "rsuite";
import { useKeycloak } from "@react-keycloak/web";
import { useDispatch, useSelector } from "react-redux";
export const AppRouter = () => {
  // const { initialized, keycloak } = useKeycloak();
  // const dispatch = useDispatch();
  // if (!initialized) {
  //   return <Loader content="Connecting Keycloak server ...." center />;
  // }
  // if (initialized) {
  //   if (keycloak.authenticated) {
  //     keycloak.loadUserInfo().then((result) => {
  //       const data = {
  //         username: result.preferred_username,
  //         firstName: result.given_name,
  //         lastName: result.family_name,
  //       };
  //       dispatch({
  //         type: LOGIN_SUCCESS,
  //         payload: { user: data },
  //       });
  //     });
  //   }
  // }
  return (
    <BrowserRouter basename={`${BASE_NAME}`}>
      <Switch>
        <Route
          path="/overview"
          exact
          render={(props) => <Overview {...props} />}
        />
        <Route path="/login" exact render={(props) => <Login {...props} />} />
        <Redirect to="/login" />
      </Switch>
    </BrowserRouter>
  );
};
