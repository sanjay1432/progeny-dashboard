import React from "react"
import { Icon, Breadcrumb, Header, Navbar, Nav } from "rsuite"
//import '../../assets/scss/ProgenySubNavBar.scss'
import { useSelector } from "react-redux"
const ProgenySubNavBar = ({ active, currentItem, onSelect, ...props }) => {
  console.log({ currentItem })
  const listItems = currentItem ? currentItem.sublist : []
  const breadcrumb = useSelector(state => state.appReducer.breadcrumb)

  return (
    <>
      <Header>
        <Navbar {...props} id="navbar">
          <Navbar.Body style={{ textAlign: "left" }}>
            <Nav
              className="hihi"
              {...props}
              appearance="subtle"
              activeKey={active}
              onSelect={onSelect}
            >
              <div
                className={
                  currentItem.customClass ? currentItem.customClass : ""
                }
              >
                <b>{currentItem.name} |</b>
              </div>
              <div>
                {listItems.map((item, i) => (
                  <Nav.Item eventKey={item.eventKey} key={i}>
                    {" "}
                    {item.name}
                  </Nav.Item>
                ))}
              </div>
            </Nav>
          </Navbar.Body>
        </Navbar>
      </Header>
    </>
  )
}
export default ProgenySubNavBar
