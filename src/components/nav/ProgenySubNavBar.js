import React from "react"
import { Icon, Breadcrumb, Header, Navbar, Nav } from "rsuite"
//import '../../assets/scss/ProgenySubNavBar.scss'
import { useSelector } from "react-redux"
import BreadcrumbProgeny from "./BreadcrumbProgeny"
const ProgenySubNavBar = ({ active, currentItem, onSelect, ...props }) => {
  // console.log({ currentItem })
  const listItems = currentItem ? currentItem.sublist : []
  const { breadcrumb } = useSelector(state => state.appReducer.breadcrumb)

  console.log("IS BREADCRUMB SETTED::::", breadcrumb)
  return (
    <>
      <Header>
        <Navbar {...props} id="navbar">
          <Navbar.Body style={{ textAlign: "left" }}>
            <Nav
              className="breadcrumb"
              {...props}
              appearance="subtle"
              activeKey={active}
              onSelect={onSelect}
            >
              <b className="masterData">{currentItem.name}</b>
              <b className="symbol">|</b>
              {breadcrumb ? (
                <BreadcrumbProgeny />
              ) : (
                listItems.map((item, i) => (
                  <Nav.Item eventKey={item.eventKey} key={i}>
                    {" "}
                    {item.name}
                  </Nav.Item>
                ))
              )}
            </Nav>
          </Navbar.Body>
        </Navbar>
      </Header>
    </>
  )
}
export default ProgenySubNavBar
