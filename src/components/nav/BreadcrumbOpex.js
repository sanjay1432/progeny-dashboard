import React from "react"
import { Icon, Breadcrumb } from "rsuite"
import { useSelector } from "react-redux"

const BreadcrumbOpex = () => {
  const breadcrumb = useSelector(state => state.appReducer.breadcrumb)

  return (
    <>
      <Breadcrumb separator={<Icon icon="angle-right" />}>
        {breadcrumb &&
          breadcrumb.map((item, index) => {
            return (
              <Breadcrumb.Item active key={"Breadcrumb" + index}>
                {item}
              </Breadcrumb.Item>
            )
          })}
      </Breadcrumb>
    </>
  )
}
export default BreadcrumbOpex
