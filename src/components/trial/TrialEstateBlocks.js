import React, { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
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
  Message,
  SelectPicker,
  IconButton,
  Icon
} from "rsuite"
import DashboardDataService from "../../services/dashboarddata.service"
import EstateService from "../../services/estate.service"
import TrialService from "../../services/trial.service"
import CreateIcon from "../../assets/img/icons/create_24px.svg"
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
// let tableData = []
const TrialEstateBlocks = ({
  currentSubNavState,
  currentItem,
  option,
  ...props
}) => {
  const dispatch = useDispatch()

  const [tableData, setTableData] = useState([])
  const [filteredTableData, setFilteredTableData] = useState([])
  const [ebAdded, setebAdded] = useState(null)
  const [ebDeleted, setebDeleted] = useState(null)
  const [pagination, setPagination] = useState(initialState)
  const [checkStatus, setCheckStatus] = useState([])
  const [checkStatusEstateBlock, setCheckStatusEstateBlock] = useState([])
  const [estateBlocks, setEstateBlocks] = useState([])

  useEffect(() => {
    async function fetchData() {
      // You can await here
      const data = await TrialService.getTrialReplicates(option.trial)
      setTableData(data)
      data.filter((v, i) => {
        const start = displaylength * (activePage - 1)
        const end = start + displaylength
        return i >= start && i < end
      })

      setFilteredTableData(data)
    }
    fetchData()
    getEstateBlocks()
  }, [])

  console.log(tableData)
  console.log(filteredTableData)

  async function getEstateBlocks() {
    const { data } = await EstateService.getUpdatedEstateBlocks()
    console.log(data)
    const items = data.find(eb => eb.estate === option.estate).estateblocks
    const blocks = []
    console.log({ items })
    for (let item in items) {
      blocks.push({
        label: items[item].estateblock,
        value: items[item].estateblock
      })
    }

    console.log({ blocks })
    setEstateBlocks(blocks)
  }
  const { activePage, displaylength } = pagination
  const { active } = currentSubNavState

  const perpage = [
    {
      label: "5",
      value: "5"
    },
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
    dataKey = parseInt(dataKey)
    setPagination(() => ({
      ...pagination,
      displaylength: dataKey
    }))
    const filterData = tableData.filter((v, i) => {
      const start = dataKey * (activePage - 1)
      const end = start + dataKey
      return i >= start && i < end
    })
    console.log(filterData, dataKey, activePage)
    setFilteredTableData(filterData)
  }

  function getNoPages() {
    const { displaylength } = pagination
    return Math.ceil(tableData.length / displaylength)
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
  } else if (
    checkStatus.length > 0 &&
    checkStatus.length < filteredTableData.length
  ) {
    checked = false
    indeterminate = true
    disabled = false
  } else if (checkStatus.length === filteredTableData.length) {
    checked = true
    indeterminate = false
    disabled = false
  }

  const handleCheckAll = (value, checked) => {
    const keys = checked ? filteredTableData.map(item => item.replicate) : []
    setCheckStatus(keys)
  }

  const handleCheck = (value, checked) => {
    const keys = checked
      ? [...checkStatus, value]
      : checkStatus.filter(item => item !== value)
    setCheckStatus(keys)
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
  const handleChange = (replicate, key, value) => {
    console.log(replicate, key, value)
    const nextData = Object.assign([], tableData)
    nextData.find(item => item.replicate === replicate)[key] = value
    setTableData(nextData)
  }

  const handleEditState = replicate => {
    const nextData = Object.assign([], tableData)
    const activeItem = nextData.find(item => item.replicate === replicate)
    activeItem.status = activeItem.status ? null : "EDIT"
    setTableData(nextData)
  }

  const EditCell = ({ rowData, dataKey, onChange, ...props }) => {
    const editing = rowData.status === "EDIT"
    return (
      <Cell {...props} className={editing ? "table-content-editing" : ""}>
        {editing && dataKey != "estateblock" ? (
          <input
            className="rs-input"
            defaultValue={rowData[dataKey]}
            disabled={["replicate", "design", "soiltype"].includes(dataKey)}
            onChange={event => {
              onChange &&
                onChange(rowData.replicate, dataKey, event.target.value)
            }}
          />
        ) : editing && dataKey === "estateblock" ? (
          <SelectPicker
            data={estateBlocks}
            style={{ width: 224 }}
            placeholder="-"
            value={rowData.estateblock}
            onChange={value => {
              onChange && onChange(rowData.replicate, dataKey, value)
            }}
          />
        ) : (
          <span className="table-content-edit-span">{rowData[dataKey]}</span>
        )}
      </Cell>
    )
  }

  const ActionCell = ({ rowData, dataKey, onClick, ...props }) => {
    return (
      <Cell {...props} style={{ padding: "6px 0" }}>
        {/* <Button
          appearance="link"
          onClick={() => {
            onClick && onClick(rowData.replicate)
          }}
        > */}
        {rowData.status === "EDIT" ? (
          <>
            <IconButton
              icon={<Icon icon="check" />}
              circle
              color="green"
              size="xs"
              onClick={() => {
                onClick && onClick(rowData.replicate)
              }}
            />
            &nbsp;
            <IconButton
              icon={<Icon icon="close" />}
              circle
              color="red"
              size="xs"
              onClick={() => {
                onClick && onClick(rowData.replicate)
              }}
            />
          </>
        ) : (
          <img
            src={CreateIcon}
            onClick={() => {
              onClick && onClick(rowData.replicate)
            }}
          />
        )}
        {/* </Button> */}
      </Cell>
    )
  }

  return (
    <>
      <div>
        <Grid fluid>
          <Row className="show-grid" id="tableOption">
            <Col sm={6} md={6} lg={6} className="totalRecordLayout">
              <b>Total records ({tableData.length})</b>
            </Col>

            <FlexboxGrid justify="end">
              <Col sm={5} md={5} lg={3}>
                <FlexboxGrid.Item className="paginationOption">
                  <InputPicker
                    className="option"
                    data={perpage}
                    defaultValue={"10"}
                    onChange={handleChangeLength}
                  />{" "}
                  <b className="page">per page</b>
                </FlexboxGrid.Item>
              </Col>
            </FlexboxGrid>
          </Row>
        </Grid>

        <Table wordWrap data={filteredTableData} autoHeight>
          <Column width={70} align="center" fixed>
            <HeaderCell className="tableHeader">
              <Checkbox
                checked={checked}
                indeterminate={indeterminate}
                onChange={handleCheckAll}
              />
            </HeaderCell>
            <CheckCell
              dataKey="replicate"
              checkedKeys={checkStatus}
              onChange={handleCheck}
            />
          </Column>

          <Column width={200}>
            <HeaderCell className="tableHeader">Replicate</HeaderCell>
            <EditCell dataKey="replicate" onChange={handleChange} />
          </Column>

          <Column width={200}>
            <HeaderCell className="tableHeader">Estate Block</HeaderCell>
            <EditCell dataKey="estateblock" onChange={handleChange} />
          </Column>

          <Column width={300}>
            <HeaderCell className="tableHeader">Density</HeaderCell>
            <EditCell dataKey="density" onChange={handleChange} />
          </Column>

          <Column width={300}>
            <HeaderCell className="tableHeader">Design</HeaderCell>
            <EditCell dataKey="design" onChange={handleChange} />
          </Column>

          <Column width={300}>
            <HeaderCell className="tableHeader">Soil Type</HeaderCell>
            <EditCell dataKey="soiltype" onChange={handleChange} />
          </Column>

          <Column flexGrow={1}>
            <HeaderCell className="tableHeader">Action</HeaderCell>
            <ActionCell dataKey="replicate" onClick={handleEditState} />
          </Column>
        </Table>
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

export default TrialEstateBlocks
