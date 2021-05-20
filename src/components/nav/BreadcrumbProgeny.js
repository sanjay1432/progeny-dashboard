import React from "react"
import { Icon, Breadcrumb } from "rsuite"
import { useSelector, useDispatch } from "react-redux"
import { setBreadcrumb, clearBreadcrumb } from "../../redux/actions/app.action"
const BreadcrumbProgeny = () => {
  const dispatch = useDispatch()
  const { breadcrumb } = useSelector(state => state.appReducer.breadcrumb)
  function handleClick(e) {
    console.log(breadcrumb)
    dispatch(clearBreadcrumb())
  }
  return (
    <>
      <Breadcrumb separator={<Icon icon="angle-right" />}>
        {breadcrumb &&
          breadcrumb.map((item, index) => {
            return (
              <Breadcrumb.Item
                active
                key={"Breadcrumb" + index}
                onClick={handleClick}
              >
                {item}
              </Breadcrumb.Item>
            )
          })}
      </Breadcrumb>
    </>
  )
}
export default BreadcrumbProgeny
