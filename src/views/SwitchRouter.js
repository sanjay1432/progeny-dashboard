import React from "react"
import { Route, Switch } from "react-router-dom"
import router from "router"

const generateRouter = routes => {
  return routes.map((prop, key) => {
    if (prop.component) {
      return (
        <Route path={prop.path} exact component={prop.component} key={key} />
      )
    } else {
      if (prop.children) {
        return generateRouter(prop.children)
      } else {
        return ""
      }
    }
  })
}

const SwitchRouter = () => {
  return (
    <>
      <Switch>{generateRouter(router)}</Switch>
    </>
  )
}
export default SwitchRouter
