import React, { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import AddEstateModal from "../../components/modal/AddEstateModal"
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
  Modal
} from "rsuite"
import OpenNew from "../../assets/img/icons/open_in_new_24px.svg"
import LinkIcon from "../../assets/img/icons/link_24px.svg"
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
const DataTable = ({ currentSubNavState, currentItem, ...props }) => {
  useEffect(() => {
    tableData = []
    currentTableDataFields = []
  })
  //console.log(currentSubNavState)
  const searchFiltersRef = useRef()
  const [isModal, setModal] = useState(false)
  const [pagination, setPagination] = useState(initialState)
  const [checkStatus, setCheckStatus] = useState([])
  const { activePage, displaylength } = pagination
  const { active } = currentSubNavState

  const tableDataFields = [
    {
      label: "Estate",
      value: "estate",
      width: 300
    },
    {
      label: "Estate Full Name",
      value: "estatefullname",
      width: 300
    },
    {
      label: "No of Estate Block",
      value: "noofestateblock",
      width: 300
    },
    {
      label: "No. Trials on this Estate",
      value: "nooftrails",
      width: 300
    },
    {
      label: "No. Trials on this Estate",
      value: "nooftrails",
      width: 200
    },
    {
      label: "Trial ID",
      value: "trialid",
      width: 200
    },
    {
      label: "Trial",
      value: "trial",
      width: 200
    },
    {
      label: "Trial Remarks",
      value: "trialremark",
      width: 300
    },
    {
      label: "Area (ha)",
      value: "area",
      width: 100
    },
    {
      label: "Planted Date",
      value: "planteddate",
      width: 100
    },
    {
      label: "n Progeny",
      value: "nofprogeny",
      width: 100
    },
    {
      label: "n Of Replicate",
      value: "nofreplicate",
      width: 200
    },
    {
      label: "Soil Type",
      value: "soiltype",
      width: 200
    },
    {
      label: "n Of Plot",
      value: "nofplot",
      width: 100
    },
    {
      label: "n Of Subblock/Rep",
      value: "nofsubblock",
      width: 200
    },
    {
      label: "n Of Plot/subblock",
      value: "nofplot_subblock",
      width: 200
    },
    {
      label: "Status",
      value: "status",
      width: 100
    },
    {
      label: "Replicate",
      value: "replicate",
      width: 100
    },
    {
      label: "Estate Block",
      value: "estateblock",
      width: 100
    },
    {
      label: "Design",
      value: "design",
      width: 100
    },
    {
      label: "Density",
      value: "density",
      width: 100
    },
    {
      label: "Plot",
      value: "plot",
      width: 100
    },
    {
      label: "Subblock",
      value: "subblock",
      width: 100
    },
    {
      label: "Progeny ID",
      value: "progenyId",
      width: 100
    },
    {
      label: "Progeny",
      value: "progeny",
      width: 100
    },
    {
      label: "Ortet",
      value: "ortet",
      width: 100
    },
    {
      label: "FP",
      value: "fp",
      width: 100
    },
    {
      label: "MP",
      value: "mp",
      width: 100
    },
    {
      label: "nPalm",
      value: "noofPalm",
      width: 100
    },
    {
      label: "Palm No",
      value: "palmno",
      width: 100
    },
    {
      label: "Palm Name",
      value: "palmname",
      width: 100
    },
    {
      label: "Progeny ID",
      value: "progenyId",
      width: 100
    },
    {
      label: "Pop Var",
      value: "popvar",
      width: 100
    },
    {
      label: "Origin",
      value: "origin",
      width: 100
    },
    {
      label: "Progeny Remark",
      value: "progenyremark",
      width: 100
    },
    {
      label: "Progeny Remark",
      value: "progenyremark",
      width: 100
    },
    {
      label: "Generation",
      value: "generation",
      width: 100
    },
    {
      label: "FP Fam",
      value: "fpFam",
      width: 100
    },
    {
      label: "FP Var",
      value: "fpVar",
      width: 100
    },
    {
      label: "MP Fam",
      value: "mpFam",
      width: 100
    },
    {
      label: "MP Var",
      value: "mpVar",
      width: 100
    },
    {
      label: "Cross",
      value: "cross",
      width: 100
    },
    {
      label: "Cross Type",
      value: "crossType",
      width: 100
    }
  ]

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
  const filterData = useSelector(state => state.filterReducer)
  console.log("FILTER AT TABLE::", filterData)
  if (dashboardData.result[active]) {
    //console.log("TABLE DATA", dashboardData.result[active])
    tableData = dashboardData.result[active]
    const availableKeys = Object.keys(tableData[0])

    availableKeys.forEach(key => {
      const field = tableDataFields.find(field => field.value === key)
      if (field) {
        currentTableDataFields.push(field)
      }
    })
  }

  //console.log({ currentTableDataFields })

  function getData(displaylength) {
    console.log("GET DATA::", tableData)
    if (Object.keys(filterData).length > 0 && filterData.filter != "") {
      tableData = filterTable(filterData.filter, tableData)
    }
    console.log("GET FILTERED DATA::", tableData)
    return tableData.filter((v, i) => {
      v["check"] = false
      const start = displaylength * (activePage - 1)
      const end = start + displaylength
      return i >= start && i < end
    })
  }

  function OpenModal() {
    setModal(!isModal)
  }

  function CloseModal() {
    setModal(!isModal)
  }

  ;<AddEstateModal show={isModal} hide={CloseModal} />

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

  const handleCheckAll = (value, checked) => {
    const keys = checked ? tableData.map(item => item.estate) : []
    setCheckStatus(keys)
    console.log("keys", keys)
    console.log(tableData)
    console.log(tableData.map(item => item.estate))
  }

  const handleCheck = (value, checked) => {
    const keys = checked
      ? [...checkStatus, value]
      : checkStatus.filter(item => item !== value)
    setCheckStatus(keys)
  }

  function filterTable(filters, data) {
    var filterKeys = Object.keys(filters)
    return data.filter(function (eachObj) {
      return filterKeys.every(function (eachKey) {
        return eachObj[eachKey] === filters[eachKey]
      })
    })
  }
  function AddButton() {
    switch (active) {
      case "estate":
        return (
          <Col sm={5} md={5} lg={3}>
            <FlexboxGrid.Item>
              <Button
                appearance="primary"
                className="btnAddEstate"
                onClick={OpenModal}
              >
                Add Estate
              </Button>
            </FlexboxGrid.Item>
          </Col>
        )
      case "trial":
        return (
          <Col sm={5} md={5} lg={3}>
            <FlexboxGrid.Item>
              <Button appearance="primary" className="btnAddTrial">
                Add New Trial
              </Button>
            </FlexboxGrid.Item>
          </Col>
        )
      case "plot":
        return (
          <Col sm={5} md={6} lg={4}>
            <FlexboxGrid.Item>
              <Button appearance="primary" className="btnAddPlot">
                Attach Progenies
              </Button>
            </FlexboxGrid.Item>
          </Col>
        )
      case "palm":
        return null
      case "progeny":
        return (
          <Col sm={5} md={5} lg={4}>
            <FlexboxGrid.Item>
              <Button appearance="primary" className="btnAddProgeny">
                Add New Progeny
              </Button>
            </FlexboxGrid.Item>
          </Col>
        )
      case "userlist":
        return (
          <Col sm={5} md={5} lg={3}>
            <FlexboxGrid.Item>
              <Button appearance="primary" className="btnAddUser">
                Add New User
              </Button>
            </FlexboxGrid.Item>
          </Col>
        )
      case "estateAssignment":
        return null
      case "userAssignment":
        return null
      default:
        return null
    }
  }

  function DeleteButton() {
    if (
      active === "palm" ||
      active === "estateAssignment" ||
      active === "userAssignment"
    ) {
      return null
    } else {
      return (
        <Col sm={4} md={4} lg={3}>
          <FlexboxGrid.Item>
            <Button className="btnDelete" disabled={disabled}>
              Delete
            </Button>
          </FlexboxGrid.Item>
        </Col>
      )
    }
  }

  function StatusButton({ status }) {
    switch (status) {
      case "active":
        return (
          <Button color="green" appearance="ghost">
            Active
          </Button>
        )
      case "canceled":
        return (
          <Button color="red" appearance="ghost">
            canceled
          </Button>
        )
      case "finished":
        return (
          <Button color="yellow" appearance="ghost">
            finished
          </Button>
        )
      default:
        return null
    }
  }

  function ActionButtons() {
    switch (active) {
      case "estate":
        return (
          <span>
            <img src={OpenNew} />
          </span>
        )
      case "trial":
        return (
          <FlexboxGrid justify="space-between">
            <FlexboxGrid.Item>
              <img src={OpenNew} />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              <Icon icon="pencil" size="md" />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              <img src={LinkIcon} />
            </FlexboxGrid.Item>
          </FlexboxGrid>
        )

      case "plot":
        return (
          <FlexboxGrid justify="space-between">
            <FlexboxGrid.Item>
              <Icon icon="qrcode" size="md" />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              <Icon icon="pencil" size="md" />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              <img src={LinkIcon} />
            </FlexboxGrid.Item>
          </FlexboxGrid>
        )
      case "palm":
        return (
          <FlexboxGrid justify="space-between">
            <FlexboxGrid.Item>
              <Icon icon="pencil" size="md" />
            </FlexboxGrid.Item>
          </FlexboxGrid>
        )
      case "progeny":
        return (
          <FlexboxGrid justify="space-between">
            <FlexboxGrid.Item>
              <Icon icon="pencil" size="md" />
            </FlexboxGrid.Item>
          </FlexboxGrid>
        )

      case "userlist":
        return (
          <FlexboxGrid justify="space-between">
            <FlexboxGrid.Item>
              <Icon icon="pencil" size="md" />
            </FlexboxGrid.Item>
          </FlexboxGrid>
        )
      case "estateAssignment":
        return (
          <FlexboxGrid justify="space-between">
            <FlexboxGrid.Item>
              <img src={OpenNew} />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              <Icon icon="user-circle" size="md" />
            </FlexboxGrid.Item>
          </FlexboxGrid>
        )
      case "userAssignment":
        return (
          <FlexboxGrid justify="space-between">
            <FlexboxGrid.Item>
              <Icon icon="user-circle" size="md" />
            </FlexboxGrid.Item>
          </FlexboxGrid>
        )
      default:
        return null
    }
  }

  return (
    <>
      <div>
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

              <AddButton />

              <AddEstateModal show={isModal} />
              <DeleteButton />
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
              dataKey="estate"
              checkedKeys={checkStatus}
              onChange={handleCheck}
            />
          </Column>

          {currentTableDataFields.map((field, i) =>
            field.value === "status" ? (
              <Column width={field.width} align="center" key={i} fixed="right">
                <HeaderCell className="tableHeader">{field.label}</HeaderCell>
                <Cell align="center">
                  {rowData => {
                    return <StatusButton status={rowData.status} />
                  }}
                </Cell>
              </Column>
            ) : (
              <Column width={field.width} align="left" key={i}>
                <HeaderCell className="tableHeader">{field.label}</HeaderCell>
                <Cell dataKey={field.value} />
              </Column>
            )
          )}

          <Column width={100} align="center" fixed="right">
            <HeaderCell className="tableHeader">Action</HeaderCell>
            <Cell align="center">
              <ActionButtons />
            </Cell>
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

export default DataTable
