import React from "react"
import { Modal, Button, Table, Checkbox } from "rsuite"
const { Column, HeaderCell, Cell } = Table

const AddEstateModal = ({ isModal, modalAction }) => {
  console.log(isModal)
  return (
    <Modal id="addEstate" size="sm" show={isModal} onHide={modalAction}>
      <Modal.Header>
        <Modal.Title>
          <div>
            <b className="title">Add Estate</b>
            <p className="description">Pulling Data From External System</p>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table
          //data={getData(displaylength)}
          autoHeight
        >
          <Column>
            <HeaderCell></HeaderCell>
            <Cell>
              {rowData => {
                function handleCheck() {
                  //alert(`id:${rowData.id}`)
                }
                return (
                  <span>
                    <Checkbox onChange={handleCheck} />
                  </span>
                )
              }}
            </Cell>
          </Column>

          <Column>
            <HeaderCell>Estate</HeaderCell>
            <Cell dataKey="Estate"></Cell>
          </Column>

          <Column>
            <HeaderCell>Action</HeaderCell>
            <Cell></Cell>
          </Column>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btnCancel" appearance="ghost">
          Cancel
        </Button>
        <Button className="btnAdd" appearance="primary">
          Add Estate
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AddEstateModal
