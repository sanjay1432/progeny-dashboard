import React, { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Table,
  FlexboxGrid,
  Container,
  Button,
  Icon,
  IconButton,
  InputPicker,
  Grid,
  Row,
  Col,
  Checkbox,
  CheckboxGroup,
  Pagination,
  Modal,
  Message
} from "rsuite"
import DashboardDataService from "../../services/dashboarddata.service"
const { Column, HeaderCell, Cell } = Table
const initialState = {
  displaylength: 10,
  prev: true,
  next: true,
  first: false,
  last: false,
  ellipsis: true,
  boundaryLinks: true,
  activePage: 1
}
let tableData = []
let currentTableDataFields = []
const EstateBlockTable = ({
  currentSubNavState,
  currentItem,
  option,
  ...props
}) => {
  const dispatch = useDispatch()

  useEffect(() => {
    currentTableDataFields = []
  })

  const [isModal, setModal] = useState(false)
  const [ebAdded, setebAdded] = useState(false)
  const [pagination, setPagination] = useState(initialState)
  const [checkStatus, setCheckStatus] = useState([])
  const [checkStatusEstateBlock, setCheckStatusEstateBlock] = useState([])
  const [estateBlocks, setEstateBlocks] = useState([])
  const [updateDate, setUpdateDate] = useState(null)
  const { activePage, displaylength } = pagination
  const { active } = currentSubNavState

  const perpage = [
    {
      label: "10",
      value: "10"
    },
    {
      label: "20",
      value: "20"
    },
    {
      label: "50",
      value: "50"
    },
    {
      label: "100",
      value: "100"
    }
  ]
  function handleChangePage(dataKey) {
    setPagination(() => ({ ...pagination, activePage: dataKey }))
  }
  function handleChangeLength(dataKey) {
    setPagination(() => ({
      ...pagination,
      displaylength: dataKey
    }))
  }

  function getNoPages() {
    const { displaylength } = pagination
    return Math.ceil(tableData.length / displaylength)
  }

  const dashboardData = useSelector(state => state.dashboardDataReducer)

  if (dashboardData.result[active]) {
    const { estateblocks } = dashboardData.result[active].find(
      estate => estate.estate === option.estate
    )
    tableData = estateblocks
  }

  function getData(displaylength) {
    return tableData.filter((v, i) => {
      v["rowNumber"] = i
      const start = displaylength * (activePage - 1)
      const end = start + displaylength
      return i >= start && i < end
    })
  }

  async function getEstateData() {
    const {
      data,
      updatedDate
    } = await DashboardDataService.getUpdatedEstateBlocks()
    setUpdateDate(updatedDate)
    const { estate } = option
    const estatedata = data.find(estates => estates.estate === estate)
    const { estateblocks } = estatedata
    setEstateBlocks(estateblocks)
  }

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

  let checked = false
  let indeterminate = false
  let disabled = true

  if (checkStatus.length === 0) {
    checked = false
    indeterminate = false
    disabled = true
  } else if (checkStatus.length > 0 && checkStatus.length < tableData.length) {
    checked = false
    indeterminate = true
    disabled = false
  } else if (checkStatus.length === tableData.length) {
    checked = true
    indeterminate = false
    disabled = false
  }

  let ebchecked = false
  let ebindeterminate = false

  if (checkStatusEstateBlock.length === estateBlocks.length) {
    ebchecked = true
  } else if (checkStatusEstateBlock.length === 0) {
    ebchecked = false
  } else if (
    checkStatusEstateBlock.length > 0 &&
    checkStatusEstateBlock.length < estateBlocks.length
  ) {
    ebindeterminate = true
  }

  const handleCheckAll = (value, checked) => {
    const keys = checked ? tableData.map(item => item.rowNumber) : []
    setCheckStatus(keys)
  }

  const handleCheckAllEstateBlocks = (value, checked) => {
    const keys = checked ? estateBlocks.map(item => item.estateblock) : []
    setCheckStatusEstateBlock(keys)
  }
  const handleCheck = (value, checked) => {
    const keys = checked
      ? [...checkStatus, value]
      : checkStatus.filter(item => item !== value)
    setCheckStatus(keys)
  }
  const handleCheckEstateBlocks = (value, checked) => {
    const keys = checked
      ? [...checkStatusEstateBlock, value]
      : checkStatusEstateBlock.filter(item => item !== value)
    setCheckStatusEstateBlock(keys)
  }
  function close() {
    setModal(false)
  }
  function open() {
    getEstateData()
    setModal(true)
  }

  function onAddEB() {
    console.log({ checkStatusEstateBlock })
    setModal(false)
    setebAdded(true)
  }

  function SuccessMessage() {
    if (ebAdded) {
      return (
        <>
          <Message
            showIcon
            type="success"
            description="Estate Blocks have been added to the system."
            onClick={() => {
              setebAdded(false)
            }}
          />
        </>
      )
    } else {
      return <></>
    }
  }

  return (
    <>
      <div id="estateBlockTable">
        <Modal show={isModal} onHide={close}>
          <Modal.Header>
            <Modal.Title>Add Estate Block</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ color: "black" }}>
              <div>
                Last updated on :{" "}
                <b>
                  {new Date(updateDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  })}
                </b>
              </div>
              <div>
                Estate: <b>{option.estate}</b>
              </div>
              <div>List of Estate Blocks({estateBlocks.length})</div>
            </div>
            <Table wordWrap data={estateBlocks}>
              <Column width={70} align="center" fixed>
                <HeaderCell className="tableHeader">
                  <Checkbox
                    checked={ebchecked}
                    indeterminate={ebindeterminate}
                    onChange={handleCheckAllEstateBlocks}
                  />
                </HeaderCell>
                <CheckCell
                  dataKey="estateblock"
                  checkedKeys={checkStatusEstateBlock}
                  onChange={handleCheckEstateBlocks}
                />
              </Column>

              <Column width={300} align="left">
                <HeaderCell className="tableHeader">Estate Block</HeaderCell>
                <Cell dataKey="estateblock" />
              </Column>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={close} appearance="subtle">
              Cancel
            </Button>
            <Button onClick={onAddEB} appearance="primary">
              Add Estate Block
            </Button>
          </Modal.Footer>
        </Modal>
        <Grid fluid>
          <Row className="show-grid" id="tableOption">
            <Col sm={6} md={6} lg={6}>
              <b className="totalRecord">Total records ({tableData.length})</b>
            </Col>

            <FlexboxGrid justify="end">
              <Col sm={5} md={5} lg={3}>
                <FlexboxGrid.Item className="paginationOption">
                  <InputPicker
                    className="Option"
                    data={perpage}
                    defaultValue={"10"}
                    onChange={handleChangeLength}
                  />{" "}
                  <b className="Page">per page</b>
                </FlexboxGrid.Item>
              </Col>

              <Col sm={5} md={5} lg={4}>
                <FlexboxGrid.Item>
                  <Button
                    appearance="primary"
                    className="btnAddEstateBlock"
                    onClick={open}
                  >
                    Add Estate Block
                  </Button>
                </FlexboxGrid.Item>
              </Col>

              <Col sm={4} md={4} lg={3}>
                <FlexboxGrid.Item>
                  <Button className="btnDelete" disabled={disabled}>
                    Delete
                  </Button>
                </FlexboxGrid.Item>
              </Col>
            </FlexboxGrid>
          </Row>
        </Grid>

        <Table
          wordWrap
          data={getData(displaylength)}
          onRowClick={data1 => {}}
          autoHeight
        >
          <Column width={70} align="center" fixed>
            <HeaderCell className="tableHeader">
              <Checkbox
                checked={checked}
                indeterminate={indeterminate}
                onChange={handleCheckAll}
              />
            </HeaderCell>
            <CheckCell
              dataKey="rowNumber"
              checkedKeys={checkStatus}
              onChange={handleCheck}
            />
          </Column>

          <Column width={300} align="left">
            <HeaderCell className="tableHeader">Estate Block</HeaderCell>
            <Cell dataKey="estateblock" />
          </Column>

          <Column width={300} align="left">
            <HeaderCell className="tableHeader">Size (ha)</HeaderCell>
            <Cell dataKey="size" />
          </Column>

          <Column width={300} align="left">
            <HeaderCell className="tableHeader">Density (p/ha)</HeaderCell>
            <Cell dataKey="density" />
          </Column>
        </Table>
        <SuccessMessage />
        <div style={{ float: "right", padding: "1rem" }}>
          <Pagination
            {...pagination}
            pages={getNoPages()}
            maxButtons={2}
            activePage={activePage}
            onSelect={handleChangePage}
          />
        </div>
      </div>
    </>
  )
}

export default EstateBlockTable
