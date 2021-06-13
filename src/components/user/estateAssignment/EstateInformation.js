import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import UserService from "../../../services/user.service"
import { setFilter, clearFilter } from "../../../redux/actions/filter.action"
import {
  Table,
  FlexboxGrid,
  Button,
  InputPicker,
  SelectPicker,
  Grid,
  Row,
  Col,
  ControlLabel,
  Pagination
} from "rsuite"
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

let initialFilter = {}
let selectedFilterArray = []
const EstateInformation = ({ option }) => {
  let [trialList, setTrialList] = useState([])
  const [pagination, setPagination] = useState(initialState)
  const { activePage, displaylength } = pagination
  const [selectedFilters, setFilters] = useState(initialFilter)

  const dispatch = useDispatch()

  useEffect(() => {
    UserService.getTrialList().then(response => {
      const data = response.data.filter(
        filter => filter.estate === option.estate
      )
      setTrialList(data)
    })
  }, [])

  function getData(displaylength) {
    //return trialList
    if (Object.keys(filterData).length > 0 && filterData.filter !== "") {
      trialList = filterTable(filterData.filter, trialList)
    }
    return trialList.filter((v, i) => {
      v["check"] = false
      v["rowNumber"] = i
      const start = displaylength * (activePage - 1)
      const end = start + displaylength
      return i >= start && i < end
    })
  }

  function filterTable(filters, data) {
    var filterKeys = Object.keys(filters)
    return trialList.filter(function (eachObj) {
      return filterKeys.every(function (eachKey) {
        return eachObj[eachKey] === filters[eachKey]
      })
    })
  }

  const filterData = useSelector(state => state.filterReducer)

  const perPage = [
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
    return Math.ceil(trialList.length / displaylength)
  }

  const StatusCell = ({ rowData, dataKey, ...props }) => {
    if (rowData[dataKey] === "active") {
      return (
        <Cell {...props}>
          <Button dataKey={rowData[dataKey]} color="green" appearance="ghost">
            Active
          </Button>
        </Cell>
      )
    } else if (rowData[dataKey] === "canceled") {
      return (
        <Cell {...props}>
          <Button dataKey={rowData[dataKey]} color="red" appearance="ghost">
            CANCELED
          </Button>
        </Cell>
      )
    } else if (rowData[dataKey] === "finished") {
      return (
        <Cell {...props}>
          <Button dataKey={rowData[dataKey]} color="yellow" appearance="ghost">
            FINISHED
          </Button>
        </Cell>
      )
    }
  }

  const columns = [
    {
      name: "Trial ID",
      dataKey: "trialid",
      width: 120
    },
    {
      name: "Trial",
      dataKey: "trial",
      width: 200
    },
    {
      name: "Trial Remarks",
      dataKey: "trialremark",
      width: 500
    },
    {
      name: "Area (ha)",
      dataKey: "area",
      width: 120
    },
    {
      name: "Planted Data",
      dataKey: "planteddate",
      width: 120
    },
    {
      name: "n Progeny",
      dataKey: "nofProgeny",
      width: 120
    },
    {
      name: "n of Replicate",
      dataKey: "nofreplicate",
      width: 140
    },
    {
      name: "Soil Type",
      dataKey: "soiltype",
      width: 120
    },
    {
      name: "n of Plot",
      dataKey: "nofplot",
      width: 120
    },
    {
      name: "n of Subblock/Rep",
      dataKey: "nofplot_subblock",
      width: 170
    },
    {
      name: "n of Plot/subblock",
      dataKey: "nofsubblock",
      width: 170
    },
    {
      name: "Status",
      dataKey: "status",
      width: 120,
      align: "center",
      fixed: "right",
      customCell: StatusCell
    }
  ]

  //Filter01
  let selectionData01 = {}
  const selectionType01 = [{ name: "trialid" }]
  if (trialList) {
    selectionType01.forEach(filter => {
      const selectionLabel01 = "trialid"
      const selectiondata01 = [
        ...new Set(trialList.map(res => res[selectionLabel01]))
      ]
      selectionData01[selectionLabel01] = selectiondata01
    })
  }
  const dataInSelection01 = []
  const filterData01 = selectionData01["trialid"]

  if (filterData01) {
    filterData01.forEach(data => {
      dataInSelection01.push({
        label: data,
        value: data
      })
    })
  } else {
    dataInSelection01.push({
      label: "not data available",
      value: "not data available"
    })
  }

  //Filter02
  let selectionData02 = {}
  const selectionType02 = [{ name: "planteddate" }]
  if (trialList) {
    selectionType02.forEach(filter => {
      const selectionLabel02 = "planteddate"
      const selectiondata02 = [
        ...new Set(trialList.map(res => res[selectionLabel02]))
      ]
      selectionData02[selectionLabel02] = selectiondata02
    })
  }
  const dataInSelection02 = []
  const filterData02 = selectionData02["planteddate"]

  if (filterData02) {
    filterData02.forEach(data => {
      dataInSelection02.push({
        label: data,
        value: data
      })
    })
  } else {
    dataInSelection02.push({
      label: "not data available",
      value: "not data available"
    })
  }

  function onApply() {
    dispatch(setFilter(selectedFilters))
  }

  function resetFilter() {
    Array.from(document.querySelectorAll("input")).forEach(
      input => input.value === ""
    )
    setFilter(null)
    selectedFilterArray = []
    dispatch(clearFilter())
  }

  function onChangeSelection(e) {
    if (!e.target.value) {
      const index = selectedFilterArray.indexOf(e.target.name)

      if (index > -1) {
        selectedFilterArray.splice(index, 1)
      }
      delete selectedFilters[e.target.name]
      return setFilters(selectedFilters)
    }

    setFilters(() => ({
      ...selectedFilters,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <>
      <Grid fluid>
        <Row>
          <Col md={4} lg={3}>
            <ControlLabel>Trial ID</ControlLabel>
            <SelectPicker
              data={dataInSelection01}
              value={selectedFilters ? selectedFilters.value : null}
              onChange={(value, e) =>
                onChangeSelection({ target: { name: "trialid", value: value } })
              }
            />
          </Col>

          <Col md={4} lg={3}>
            <ControlLabel>Planted Date (Year)</ControlLabel>
            <SelectPicker
              data={dataInSelection02}
              value={selectedFilters ? selectedFilters.value : null}
              onChange={(value, e) =>
                onChangeSelection({
                  target: { name: "planteddate", value: value }
                })
              }
            />
          </Col>

          <Col md={4} lg={3} style={{ padding: "25px 0px 0px 0px" }}>
            <Button appearance="primary" className="btnApply" onClick={onApply}>
              Apply
            </Button>
          </Col>

          <Col md={4} lg={3}>
            <Button
              appearance="subtle"
              className="btnResetFilter"
              onClick={resetFilter}
            >
              Reset Filter
            </Button>
          </Col>
        </Row>
      </Grid>

      <Grid fluid>
        <Row className="show-grid" id="tableOption">
          <Col sm={6} md={6} lg={6}>
            <b className="totalRecord">
              Total records ({trialList ? trialList.length : "undefined"})
            </b>
          </Col>

          <FlexboxGrid justify="end">
            <Col sm={5} md={5} lg={3}>
              <FlexboxGrid.Item className="paginationOption">
                <InputPicker
                  className="Option"
                  data={perPage}
                  defaultValue={"10"}
                  onChange={handleChangeLength}
                />{" "}
                <b className="Page">per page</b>
              </FlexboxGrid.Item>
            </Col>
          </FlexboxGrid>
        </Row>
      </Grid>

      <Table data={getData(displaylength)} wordWrap autoHeight>
        {columns.map(col => {
          return (
            <Column
              width={col.width}
              fixed={col.fixed ? col.fixed : null}
              align={col.align ? col.align : null}
            >
              <HeaderCell>{col.name}</HeaderCell>
              {col.customCell ? (
                <col.customCell dataKey={col.dataKey} />
              ) : (
                <Cell dataKey={col.dataKey} />
              )}
            </Column>
          )
        })}
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
    </>
  )
}

export default EstateInformation