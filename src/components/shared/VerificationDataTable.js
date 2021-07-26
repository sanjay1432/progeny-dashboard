import React, { useState } from 'react'
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
  Message,
  Input,
  IconButton,
  Icon,
  Tooltip,
  Whisper,
  Panel
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

const VerificationDataTable = ({currentItem ,currentSubNavState}) => {

  const [selectedFilters, setFilters] = useState(initialFilter)
  const [dataTable, setDataTable] = useState([]);
  const [pagination, setPagination] = useState([]);
  const { active } = currentSubNavState
  const { activePage, displaylength } = pagination

  const filterData = useSelector(state => state.filterReducer)

  const columns_YearlyVerification = [{}]

  const columns_VerifyForms = [
    {
      name: "Trial ID",
      dataKey: "trialCode",
      length: 120
    },
    {
      name: "Trial",
      dataKey: "trial",
      length: 120
    },
    {
      name: "Form",
      dataKey: "form",
      length: 120
    },
    {
      name: "UploadedDate",
      dataKey: "uploadedDate",
      length: 120
    },
    {
      name: "Uploaded By",
      dataKey: "uploadedBy",
      length: 120
    },
    {
      name: "Record Date",
      dataKey: "recordDate",
      length: 120
    },
    {
      name: "Recorded By",
      dataKey: "recordedBy",
      length: 120
    },
    {
      name: "Action",
      dataKey: "trialId",
      length: 120
    },
  ]


  function getData(itemlength) {
    //return dataTable
    if (Object.keys(filterData).length > 0 && filterData.filter !== "") {
      dataTable = filterTable(filterData.filter, dataTable)
    }
    return dataTable.filter((v, i) => {
      const start = itemlength * (activePage - 1)
      const end = start + itemlength
      return i >= start && i < end
    })
  }

  function filterTable(filters, data) {
    var filterKeys = Object.keys(filters)
    return dataTable.filter(function (eachObj) {
      return filterKeys.every(function (eachKey) {
        return eachObj[eachKey] === filters[eachKey]
      })
    })
  }

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
    const { selectedLength } = pagination
    return Math.ceil(dataTable.length / selectedLength)
  }

  const YearlyOverviewVerification = () => {
      return (
        <div className="OverviewVerification">
          <hr className="lineBetweenFilter" />

          <b className="title">Yearly Overview Verfication</b>
          <Grid fluid>
            <Row>
              <Col md={6} lg={6}>
                <Panel header="97.5%" shaded className="yearlyVerPanel">
                  Verified Data Record
                </Panel>
              </Col>

              <Col md={6} lg={6}>
                <Panel header="1200" shaded className="yearlyVerPanel">
                  Uploaded Data
                </Panel>
              </Col>

              <Col md={6} lg={6}>
                <Panel header="1211" shaded className="yearlyVerPanel">
                  Verfied Data
                </Panel>
              </Col>

              <Col md={6} lg={6}>
                <Panel header="1.2" shaded className="yearlyVerPanel">
                  Days
                </Panel>
              </Col>
            </Row>
          </Grid>
        </div>
      )
  }

  return(
    <>
    {active === "yearlyverification" ? <YearlyOverviewVerification /> : null}

      <Grid fluid>
        <Row className="show-grid" id="dashboardTableSetting">
          <Col sm={6} md={6} lg={6} className="totalRecordLayout">
            <b>Total records ({dataTable.length ? dataTable.length : "null"})</b>
          </Col>

          <FlexboxGrid justify="end">
            <Col sm={5} md={5} lg={4} className="pageOptionLayout">
              <FlexboxGrid.Item className="selectPage">
                <InputPicker
                  className="option"
                  data={perPage}
                  defaultValue={"10"}
                  onChange={handleChangeLength}
                />{" "}
                <b className="page">per page</b>
              </FlexboxGrid.Item>
            </Col>
          </FlexboxGrid>
        </Row>
      </Grid>

        <Table
          id="dashboardTable"
          data={getData(displaylength)}
          wordWrap
          autoHeight
        >
          
          {/* {columns_VerifyForms.map(col => {
            return(
              <>
                <Column>
                  <HeaderCell></HeaderCell>
                  {col.customCell ? (
                    <col.customCell dataKey={col.dataKey} />
                  ) : (
                    <Cell dataKey={col.dataKey} />
                  )}
                </Column>
              </>
            )
          })} */}

        </Table>
      <div>
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

export default VerificationDataTable