import React, { useEffect, useState } from "react"
import { Collapse } from "reactstrap"

const FilterCollapsible = ({
  children,
  header,
  defaultOpen = true,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(true)
  const toggle = () => setIsOpen(!isOpen)
  useEffect(() => {
    setIsOpen(defaultOpen)
  }, [defaultOpen])
  return (
    <>
      <div className="filter" {...props}>
        <div
          className="__header d-flex justify-content-between align-items-center flex-wrap noselect"
          onClick={toggle}
        >
          <h2>{header}</h2>
          <span>
            {isOpen ? (
              <span>
                <i className="fa fa-chevron-circle-up" aria-hidden="true" />{" "}
                Collapse
              </span>
            ) : (
              <span>
                <i className="fa fa-chevron-circle-down" aria-hidden="true" />{" "}
                Expand
              </span>
            )}
          </span>
        </div>
        <Collapse isOpen={isOpen}>{children}</Collapse>
      </div>
    </>
  )
}

FilterCollapsible.defaultProps = {
  header: "Filter by"
}

export default FilterCollapsible
