import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  Table,
  FlexboxGrid,
  Button,
  InputPicker,
  Grid,
  Row,
  Col,
  Checkbox,
  Pagination,
  Modal,
  Message
} from "rsuite"
import DashboardDataService from "../../services/dashboarddata.service"
import { getDashboardData } from "../../redux/actions/dashboarddata.action"
import EstateService from "../../services/estate.service"
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
// let currentTableDataFields = []
const EstateBlockTable = ({
  currentSubNavState,
  currentItem,
  option,
  ...props
}) => {
  const dispatch = useDispatch()

  // useEffect(() => {
  //   currentTableDataFields = []
  // })

  const [isModal, setModal] = useState(false)
  const [ebAdded, setebAdded] = useState(null)
  const [ebDeleted, setebDeleted] = useState(null)
  const [pagination, setPagination] = useState(initialState)
  const [checkStatusEstateBlock, setCheckStatusEstateBlock] = useState([])
  const [estateBlocks, setEstateBlocks] = useState([])
  const [updateDate, setUpdateDate] = useState(null)
  const { activePage, displaylength } = pagination
  const { active } = currentSubNavState
  const { user } = useSelector((state) => state.authReducer);

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
      const start = displaylength * (activePage - 1)
      const end = start + displaylength
      return i >= start && i < end
    })
  }

  async function getEstateData() {
    const { data, updatedDate } =
      await DashboardDataService.getUpdatedEstateBlocks()
    setUpdateDate(updatedDate)
    const { estate } = option
    const estatedata = data.find(estates => estates.estate === estate)
    const { estateblocks } = estatedata
    setEstateBlocks(estateblocks)
    const keys = estateblocks.map(eb => (eb.assigned ? eb.estateblock : null))

    setCheckStatusEstateBlock(keys.filter(key => key))
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



  const handleCheckAllEstateBlocks = (value, checked) => {
    const keys = checked ? estateBlocks.map(item => item.estateblock) : []
    setCheckStatusEstateBlock(keys)
  }
  // const handleCheck = (value, checked) => {
  //   const keys = checked
  //     ? [...checkStatus, value]
  //     : checkStatus.filter(item => item !== value)
  //   setCheckStatus(keys)
  // }
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
    estateBlocks.forEach(eb => {
      if (checkStatusEstateBlock.includes(eb.estateblock)) {
        eb.assigned = true
      } else {
        eb.assigned = false
      }
    })
    const payload = [{
      estate: option.estate,
      estateId: option.estateId,
      estateblocks: estateBlocks,
      updatedBy: user.username
    }]
    setModal(false)
    EstateService.assignEstateBlocksToEstate(payload).then(
      data => {
        console.log("Success", data)
        dispatch(getDashboardData('estate'))
        setebAdded(true)
      },
      err => {
        console.log("Error", err)
        setebAdded(false)
      }
    )
  }


  function SuccessMessage() {
    if (ebAdded === true) {
      return (
        <>
          <Message
            showIcon
            type="success"
            description="Estate Blocks have been added to the system."
            onClick={() => {
              setebAdded(null)
            }}
          />
        </>
      )
    } else if (ebAdded === false) {
      return (
        <>
          <h1>ERROR</h1>
        </>
      )
    } else {
      return <></>
    }
  }

  function EbDeletionMessage() {
    if (ebDeleted === true) {
      return (
        <>
          <Message
            showIcon
            type="success"
            description="Estate Blocks have been deleted from the system."
            onClick={() => {
              setebDeleted(null)
            }}
          />
        </>
      )
    } else if (ebDeleted === false) {
      return (
        <>
          <h1>ERROR</h1>
        </>
      )
    } else {
      return <></>
    }
  }

  return (
    <>
      <div id="EstateBlockTable">
        {/* Add Estate Block MODAL STARTED */}
        <Modal id="estateBlockModal" show={isModal} onHide={close}>
          <Modal.Header>
            <Modal.Title className="title">Add Estate Block</Modal.Title>
          </Modal.Header>
          <Modal.Body className="body">
            <div>
              <p className="lastUpdate">
                Last updated on :{" "}
                <b>
                  {new Date(updateDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  })}
                </b>
              </p>

              <p>
                Estate: <b>{option.estate}</b>
              </p>
              <p>List of Estate Blocks ({estateBlocks.length})</p>
            </div>
            <Table wordWrap data={estateBlocks} id="modalEstateTable" autoHeight>
              <Column width={80}>
                <HeaderCell>
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

              <Column flexGrow={1} align="left">
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

        {/* Add Estate Block MODAL ENDED */}

        <Grid fluid>
          <Row className="show-grid" id="dashboardTableSetting">
            <Col sm={6} md={6} lg={6} className="totalRecordLayout">
              <b>Total records ({tableData.length})</b>
            </Col>

            <FlexboxGrid justify="end">
              <Col sm={5} md={5} lg={4} className="pageOptionLayout">
                <FlexboxGrid.Item className="selectPage">
                  <InputPicker
                    className="option"
                    data={perpage}
                    defaultValue={"10"}
                    onChange={handleChangeLength}
                  />{" "}
                  <b className="page">per page</b>
                </FlexboxGrid.Item>
              </Col>

              <Col sm={5} md={6} lg={5} className="addButtonLayout">
                <FlexboxGrid.Item>
                  <Button
                    appearance="primary"
                    className="addEstateBlockButton"
                    onClick={open}
                  >
                    Add Estate Block
                  </Button>
                </FlexboxGrid.Item>
              </Col>
            </FlexboxGrid>
          </Row>
        </Grid>

        <Table
          id="dashboardTable"
          wordWrap
          data={getData(displaylength)}
          onRowClick={data1 => {}}
          autoHeight
        >

          <Column flexGrow={1} align="left">
            <HeaderCell className="tableHeader">Estate Block</HeaderCell>
            <Cell dataKey="estateblock" />
          </Column>

          <Column flexGrow={1} align="left">
            <HeaderCell className="tableHeader">Size (ha)</HeaderCell>
            <Cell dataKey="size" />
          </Column>

          <Column flexGrow={4} align="left">
            <HeaderCell className="tableHeader">Density (p/ha)</HeaderCell>
            <Cell dataKey="density" />
          </Column>
        </Table>
        <SuccessMessage />
        <EbDeletionMessage />

        <Pagination
          className="pagination"
          {...pagination}
          pages={getNoPages()}
          maxButtons={2}
          activePage={activePage}
          onSelect={handleChangePage}
        />
      </div>
    </>
  )
}

export default EstateBlockTable
