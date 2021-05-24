import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded"
import CancelRoundedIcon from "@material-ui/icons/CancelRounded"
import axios from "axios"
import { Modal, Table, Button, Checkbox } from "rsuite"
import CommonTable from "../sharedComponent/Table"
import FilterPanel from "../sharedComponent/FilterPanel"
const { Column, HeaderCell, Cell } = Table

let originalData = []
const AddEstateModal = ({
  show,
  hide,
  currentSubNavState,
  currentItem,
  ...props
}) => {
  const [data, setData] = useState([])
  const [expandedCell, setExpandedCell] = useState([])
  const { active } = currentSubNavState

  const dashboardData = useSelector(state => state.dashboardDataReducer)
  const filteredData = useSelector(state => state.filterReducer)

  if (dashboardData.result[active]) {
    originalData = dashboardData.result[active]
  }

  const CheckAllCell = ({ ...props }) => (
    <HeaderCell>
      <Checkbox />
    </HeaderCell>
  )

  const CheckCell = ({ rowData, onChange, checkedKeys, dataKey, ...props }) => (
    <Cell {...props} style={{ padding: 0 }}>
      <div>
        <Checkbox value={rowData[dataKey]} inline onChange={onChange} />
      </div>
    </Cell>
  )

  const rowKey = "id"
  const ActionCell = ({ rowData, dataKey, onChange, expandCell, ...props }) => {
    return (
      <Cell {...props}>
        <AddCircleRoundedIcon
          expandCell={expandCell}
          onClick={handleExpandedCell}
        />
      </Cell>
    )
  }

  const handleExpandedCell = (rowData, dataKey) => {
    let open = false
    const nextExpandedCell = []

    expandedCell.forEach(key => {
      if (key === rowData[rowKey]) {
        open = true
      } else {
        nextExpandedCell.push(key)
      }
    })

    if (!open) {
      nextExpandedCell.push(rowData[rowKey])
    }

    setExpandedCell(nextExpandedCell)
  }

  const renderExpandedCell = rowData => {
    return <Cell>{rowData.id}</Cell>
  }

  const columns = [
    {
      name: "Estate",
      dataKey: "estate",
      customCell: CheckCell,
      width: 80
    },
    {
      name: "Estate",
      dataKey: "estate",
      width: 300
    },
    {
      name: "Action",
      dataKey: "estateblocks",
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
        <FilterPanel
          currentSubNavState={currentSubNavState}
          currentItem={currentItem}
          data={originalData}
        />
        <p className="estateRecord">List of Estates ({data.length})</p>
        <CommonTable
          columns={columns}
          data={originalData}
          expandedCell={expandedCell}
          renderExpandedCell={renderExpandedCell}
          currentSubNavState={currentSubNavState}
          currentItem={currentItem}
        />
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
