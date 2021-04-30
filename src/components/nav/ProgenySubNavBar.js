import React from "react"
import { Icon, Breadcrumb, Header, Navbar, Nav } from "rsuite"
import { useSelector } from "react-redux"
const ProgenySubNavBar = ({ active, currentItem, onSelect, ...props }) => {
  // console.log({ currentItem })
  const listItems = currentItem ? currentItem.sublist : []
  const breadcrumb = useSelector(state => state.appReducer.breadcrumb)

  return (
    <>
      <Header>
        <Navbar {...props} className="navbar">
          <Navbar.Body>
            <Nav
              {...props}
              appearance="subtle"
              activeKey={active}
              onSelect={onSelect}
            >
              {currentItem.name} |
              {listItems.map((item, i) => (
                <Nav.Item eventKey={item.eventKey} key={i}>
                  {" "}
                  {item.name}
                </Nav.Item>
              ))}
            </Nav>
          </Navbar.Body>
        </Navbar>
      </Header>
    </>
  )
}
export default ProgenySubNavBar
