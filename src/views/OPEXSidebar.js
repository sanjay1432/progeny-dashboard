import React, { useState } from "react"
import router from "router"
import { Link, useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setBreadcrumb } from "../redux/actions/app.action"
import logo from "assets/img/RGE-logo/dmp-logo.svg"
import { Navbar, Nav, Dropdown, Icon, Sidebar, Sidenav } from "rsuite"
import _ from "lodash"
import { useAbility } from "@casl/react"
import { AbilityContext } from "../config/Can"
import { ACTION } from "../constants"
import { ModuleAbility } from "../models/ModuleAbility"

const OPEXSidebar = () => {
  const [expand, setExpand] = useState(false)
  const history = useHistory()
  const dispatch = useDispatch()
  const mill = useSelector(state => state.appReducer.mill)
  const ability = useAbility(AbilityContext)

  const handleToggle = () => {
    setExpand(!expand)
  }

  const goto = path => {
    dispatch(setBreadcrumb(_.flattenDeep(path.breadcrumb)))
    history.push(
      {
        pathname: path.pathname
      },
      {
        tab: path.tab,
        breadcrumb: _.flattenDeep(path.breadcrumb)
      }
    )
  }

  const gotoOverview = () => {
    history.push({
      pathname: "/overview"
    })
  }

  const getRoutesForMenu = routes => {
    return routes.map((item, index) => {
      if (
        mill &&
        item.menu &&
        item.menu === "main" &&
        item.bu &&
        item.bu.indexOf(mill.buId) >= 0
      ) {
        return NavListItem(item, 0, null, index, "")
      } else {
        return ""
      }
    })
  }

  const NavListItem = (item, level, parentPath, index, parentName) => {
    if (item.component) {
      if (item.bu && item.bu.indexOf(mill.buId) < 0) {
        return ""
      }
    }
    let pathname = ""
    if (item.component) {
      pathname = item.path
    } else {
      pathname = parentPath ? parentPath : item.path
    }
    let pathTo = {
      pathname: pathname,
      tab: item.path,
      breadcrumb: [...parentName]
    }
    if (item.children && item.children.length > 0) {
      if (level > 0) {
        return (
          <Dropdown.Menu
            trigger="hover"
            eventKey={`${index}-${level}`}
            title={item.name}
            key={"UCD_" + item.name}
          >
            {item.children.map(listItem =>
              NavListItem(listItem, level + 1, item.path, index, [
                parentName,
                item.name
              ])
            )}
          </Dropdown.Menu>
        )
      } else {
        if (
          ability.can(
            ACTION.read,
            new ModuleAbility(item.moduleName, mill.millId, mill.buId)
          )
        ) {
          return (
            <Dropdown
              trigger="hover"
              placement="rightStart"
              eventKey={`${index}-${level}`}
              key={"UCD_" + item.name}
              title={`${item.name}`}
              icon={<Icon icon={item.icon} alt={item.name} />}
            >
              {item.children.map(listItem =>
                NavListItem(listItem, level + 1, item.path, index, [item.name])
              )}
            </Dropdown>
          )
        }
      }
    } else {
      pathTo.breadcrumb.push(item.name)
      if (level === 0) {
        if (
          ability.can(
            ACTION.read,
            new ModuleAbility(item.moduleName, mill.millId, mill.buId)
          )
        ) {
          return (
            <Nav.Item
              key={"opex-menu_" + item.name + level}
              eventKey={`${index}-${level}`}
              icon={<Icon icon={item.icon} alt={item.name} />}
              onClick={() => goto(pathTo)}
            >
              {item.name}
            </Nav.Item>
          )
        }
      } else {
        return (
          <Dropdown.Item
            eventKey={`${index}-${level}`}
            tag={Link}
            key={"opex-menu_" + item.name + level}
            onClick={() => goto(pathTo)}
          >
            {item.name}
          </Dropdown.Item>
        )
      }
    }
  }

  return (
    <>
      {mill && (
        <Sidebar
          style={{ display: "flex", flexDirection: "column" }}
          width={expand ? 260 : 56}
          collapsible
        >
          <Sidenav.Header onClick={() => gotoOverview()}>
            <div className="top-menu-logo">
              <img alt="RGE" height={56} src={logo} />
            </div>
          </Sidenav.Header>
          <Sidenav
            expanded={expand}
            defaultOpenKeys={["3"]}
            appearance="subtle"
          >
            <Sidenav.Body className="sidebar-body">
              <Nav>{getRoutesForMenu(router)}</Nav>
            </Sidenav.Body>
          </Sidenav>
          <Navbar appearance="subtle" className="nav-toggle">
            <Navbar.Body>
              <Nav pullRight>
                <Nav.Item
                  onClick={() => handleToggle()}
                  style={{ width: 56, textAlign: "center" }}
                >
                  <Icon
                    icon={expand ? "angle-left" : "angle-right"}
                    alt="Expand"
                  />
                </Nav.Item>
              </Nav>
            </Navbar.Body>
          </Navbar>
        </Sidebar>
      )}
    </>
  )
}
export default OPEXSidebar
