import { Button, Input, Modal } from "rsuite"
import React, { useEffect } from "react"
import { Card, CardBody } from "reactstrap"
const ReadMoreOnTable = ({
  cols,
  data,
  onHide,
  title = "Read More",
  show = false
}) => {
  if (data === null && cols === null) {
    return null
  }
  return (
    <Modal full overflow={true} show={show} onHide={() => onHide(false)}>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card>
          <CardBody>
            {cols.map((item, index) => {
              return (
                <div className=" __new-row" key={index}>
                  <div className="__new-col">{item.label}</div>
                  <div className="__new-col md">
                    <Input
                      componentClass="textarea"
                      maxLength={500}
                      rows={item["rows"] ? item["rows"] : 1}
                      value={data[item.dataKey]}
                      disabled={true}
                      className="view-detail"
                    />
                  </div>
                </div>
              )
            })}
          </CardBody>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => onHide(false)} appearance="subtle">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
export default ReadMoreOnTable
