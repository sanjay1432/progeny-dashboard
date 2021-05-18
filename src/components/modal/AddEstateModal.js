import React, { useState, useEffect } from "react"
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded"
import axios from "axios"
import { Modal, Table, Button, Checkbox } from "rsuite"
import CommonTable from "./sharedComponent/Table"
import SearchFilter from "./sharedComponent/SearchFilter"
const { Column, HeaderCell, Cell } = Table

const AddEstateModal = ({ show, hide }) => {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("https://jsonplaceholder.typicode.com/posts")
      setData(result.data)
    }
    fetchData()
  }, [])

  const CheckCell = ({ rowData, onChange, checkedKeys, dataKey, ...props }) => (
    <Cell {...props} style={{ padding: 0 }}>
      <div>
        <Checkbox
          value={rowData[dataKey]}
          inline
          onChange={onChange}
          checked={checkedKeys.some(item => item === rowData[dataKey])}
        />
      </div>
    </Cell>
  )

  const ActionCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props}>
        <AddCircleRoundedIcon />
      </Cell>
    )
  }

  const columns = [
    {
      name: "Estate",
      dataKey: "id",
      customCell: CheckCell,
      width: 100
    },
    {
      name: "Estate",
      dataKey: "id",
      width: 300
    },
    {
      name: "Action",
      dataKey: "id",
      customCell: ActionCell,
      width: 100
    }
  ]

  return (
    <Modal id="addEstate" size="sm" show={show} onHide={hide}>
      <Modal.Header>
        <Modal.Title>
          <div>
            <b className="title">Add Estate</b>
            <p className="description">Pulling Data From External System</p>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SearchFilter />
        <p className="estateRecord">List of Estates ({data.length})</p>
        <CommonTable columns={columns} data={data} />
      </Modal.Body>
      <Modal.Footer>
        <Button className="btnCancel" appearance="ghost" onClick={hide}>
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
