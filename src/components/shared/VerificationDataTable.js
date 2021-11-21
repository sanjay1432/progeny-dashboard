import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux"
import OpenNew from "../../assets/img/icons/open_in_new_24px.svg"
import Columns from '../SharedComponent/Table/Columns'
import {
  Table,
  FlexboxGrid,
  InputPicker,
  Grid,
  Row,
  Col,
  Pagination,
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

const VerificationtableData = ({currentItem ,currentSubNavState}) => {
  useEffect(() => {
    fillIntableData()
  })
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState(initialState);
  const { active } = currentSubNavState
  const { activePage, displaylength } = pagination

  const dashboardData = useSelector(state => state.dashboardDataReducer)
 
  function fillIntableData() {
    const data = dashboardData.result[active]
    setTableData(data)
  }

  const ActionCell = ({dataKey, props}) => (
    <Cell {...props} style={{ padding: 0 }}>
      <span>
        <img
          src={OpenNew}
          alt=""
        />
      </span>
  </Cell>
  )



  // const columns = [
  //   {
  //     name: "Trial ID",
  //     dataKey: "trialCode",
  //     flexGrow: 1,
  //   },
  //   {
  //     name: "Trial",
  //     dataKey: "trial",
  //     flexGrow: 1,
  //   },
  //   {
  //     name: "Form",
  //     dataKey: "form",
  //     flexGrow: 1,
  //   },
  //   {
  //     name: "UploadedDate",
  //     dataKey: "uploadedDate",
  //     flexGrow: 1,
  //   },
  //   {
  //     name: "Uploaded By",
  //     dataKey: "uploadedBy",
  //     flexGrow: 1,
  //   },
  //   {
  //     name: "Record Date",
  //     dataKey: "recordDate",
  //     flexGrow: 1,
  //   },
  //   {
  //     name: "Recorded By",
  //     dataKey: "recordedBy",
  //     flexGrow: 1,
  //   },
  //   {
  //     name: "Action",
  //     dataKey: "trialId",
  //     width: 120,
  //     customCell: ActionCell
  //   },
  // ]

  function getData(itemlength) {
    return tableData
    // return tableData.filter((v, i) => {
    //   const start = displaylength * (activePage - 1);
    //   const end = start + displaylength;
    //   return i >= start && i < end;
    // })
    //return tableData
    // if (Object.keys(filterData).length > 0 && filterData.filter !== "") {
    //   tableData = filterTable(filterData.filter, tableData)
    // }
    // return tableData.filter((v, i) => {
    //   const start = itemlength * (activePage - 1)
    //   const end = start + itemlength
    //   return i >= start && i < end
    // })
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

  const handleChangeLength = (data) => {
    setPagination(() => ({
      ...pagination,
      displaylength: data
    }))
  }

  const getNoPages = () => {
    // const { displaylength } = pagination
    //return Math.ceil(tableData.length / displaylength)
  }

  const handleChangePage = (data) => {
    setPagination(() => ({
      ...pagination,
      activePage: data
    }))
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
            <b>Total records ({tableData ? tableData.length : "null"})</b>
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
          {Columns(active).map(col => {
            const width = col.width ? col.width : false
            const flexGrow = col.flexGrow ? col.flexGrow : false
            const fixed = col.fixed ? col.fixed : false
            return(
              <Column width={width} flexGrow={flexGrow} fixed={fixed}>
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

export default VerificationtableData