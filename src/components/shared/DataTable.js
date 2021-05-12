import React, { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import AddEstateModal from "../shared/AddEstateModal"
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
  Pagination,
  Modal
} from "rsuite"
import { Switch } from "react-router"

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
  console.log(currentSubNavState)
  const searchFiltersRef = useRef()
  const [isModal, setModal] = useState(false)
  const [pagination, setPagination] = useState(initialState)
  const [checkState, setCheckState] = useState(false)
  const { activePage, displaylength } = pagination
  const { active } = currentSubNavState
  const fakeData = [
    {
      check: false,
      Estate: "Buurhakaba",
      "Estate Full Name": "Licheng",
      "No of Estate Block": 7,
      "No Trial on this Estate": 9
    },
    {
      check: false,
      Estate: "Rinconada",
      "Estate Full Name": "Ngawi",
      "No of Estate Block": 10,
      "No Trial on this Estate": 97
    },
    {
      check: false,
      Estate: "Bāsawul",
      "Estate Full Name": "Jianling",
      "No of Estate Block": 3,
      "No Trial on this Estate": 63
    },
    {
      check: false,
      Estate: "Hongxing",
      "Estate Full Name": "Czerwionka-Leszczyny",
      "No of Estate Block": 6,
      "No Trial on this Estate": 17
    },
    {
      check: false,
      Estate: "Prestea",
      "Estate Full Name": "Komyshany",
      "No of Estate Block": 8,
      "No Trial on this Estate": 29
    },
    {
      check: false,
      Estate: "Ginir",
      "Estate Full Name": "Corral",
      "No of Estate Block": 3,
      "No Trial on this Estate": 23
    },
    {
      check: false,
      Estate: "El Chol",
      "Estate Full Name": "Caluire-et-Cuire",
      "No of Estate Block": 7,
      "No Trial on this Estate": 34
    },
    {
      check: false,
      Estate: "Stockholm",
      "Estate Full Name": "Emiliano Zapata",
      "No of Estate Block": 3,
      "No Trial on this Estate": 23
    },
    {
      check: false,
      Estate: "Ulee Gle",
      "Estate Full Name": "Sanquan",
      "No of Estate Block": 9,
      "No Trial on this Estate": 70
    },
    {
      check: false,
      Estate: "Manga",
      "Estate Full Name": "Maqia",
      "No of Estate Block": 4,
      "No Trial on this Estate": 80
    },
    {
      check: false,
      Estate: "Kushima",
      "Estate Full Name": "Rakiv Lis",
      "No of Estate Block": 10,
      "No Trial on this Estate": 75
    },
    {
      check: false,
      Estate: "Krajan Langenharjo",
      "Estate Full Name": "Jelsa",
      "No of Estate Block": 8,
      "No Trial on this Estate": 35
    },
    {
      check: false,
      Estate: "Krasnoye",
      "Estate Full Name": "Parobé",
      "No of Estate Block": 5,
      "No Trial on this Estate": 3
    },
    {
      check: false,
      Estate: "Malaba",
      "Estate Full Name": "Dagsar",
      "No of Estate Block": 5,
      "No Trial on this Estate": 49
    },
    {
      check: false,
      Estate: "Grenoble",
      "Estate Full Name": "Ipojuca",
      "No of Estate Block": 5,
      "No Trial on this Estate": 80
    },
    {
      check: false,
      Estate: "Dapo",
      "Estate Full Name": "Simpangpasir",
      "No of Estate Block": 4,
      "No Trial on this Estate": 4
    },
    {
      check: false,
      Estate: "Potok Złoty",
      "Estate Full Name": "Badai",
      "No of Estate Block": 4,
      "No Trial on this Estate": 78
    },
    {
      check: false,
      Estate: "Sukasari",
      "Estate Full Name": "Novonikol’sk",
      "No of Estate Block": 2,
      "No Trial on this Estate": 88
    },
    {
      check: false,
      Estate: "Lidoríki",
      "Estate Full Name": "Longbo",
      "No of Estate Block": 4,
      "No Trial on this Estate": 30
    },
    {
      check: true,
      Estate: "Ad Dawādimī",
      "Estate Full Name": "Ngamba",
      "No of Estate Block": 1,
      "No Trial on this Estate": 54
    }
  ]

  const tableDataFields = [
    {
      label: "Estate",
      value: "estate",
      width: 100
    },
    {
      label: "Estate Full Name",
      value: "estatefullname",
      width: 300
    },
    {
      label: "No of Estate Block",
      value: "noofestateblock",
      width: 200
    },
    {
      label: "No. Trials on this Estate",
      value: "nooftrails",
      width: 200
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

  function getPages() {
    const { displaylength } = pagination
    return Math.ceil(tableData.length / displaylength)
  }

  function onCheckboxClick(e) {
    // fakeData.forEach(element => {
    //   element.check = e
    // });
    setCheckState(e)
  }

  function modalAction() {
    setModal(!isModal)
  }

  const noOfPages = getPages()

  const dashboardData = useSelector(state => state.dashboardDataReducer)

  if (dashboardData.result[active]) {
    console.log("TABLE DATA", dashboardData.result[active])
    tableData = dashboardData.result[active]
    const availableKeys = Object.keys(tableData[0])

    availableKeys.forEach(key => {
      const field = tableDataFields.find(field => field.value === key)
      if (field) {
        currentTableDataFields.push(field)
      }
    })
  }
  console.log({ currentTableDataFields })

  function getData(displaylength) {
    console.log("GET DATA::", tableData)
    return tableData.filter((v, i) => {
      v["check"] = false
      const start = displaylength * (activePage - 1)
      const end = start + displaylength
      return i >= start && i < end
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
                className="btnAdd"
                onClick={modalAction}
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
              <Button
                appearance="primary"
                className="btnAdd"
                onClick={modalAction}
              >
                Add New Trial
              </Button>
            </FlexboxGrid.Item>
          </Col>
        )
      case "plot":
        return (
          <Col sm={5} md={5} lg={3}>
            <FlexboxGrid.Item>
              <Button
                appearance="primary"
                className="btnAdd"
                onClick={modalAction}
              >
                Attach Progenies
              </Button>
            </FlexboxGrid.Item>
          </Col>
        )
      case "palm":
        return null
      case "progeny":
        return (
          <Col sm={5} md={5} lg={3}>
            <FlexboxGrid.Item>
              <Button
                appearance="primary"
                className="btnAdd"
                onClick={modalAction}
              >
                Add New Progeny
              </Button>
            </FlexboxGrid.Item>
          </Col>
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
              <Col sm={5} md={5} lg={4}>
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

              {active != "palm" ? (
                <Col sm={4} md={4} lg={3}>
                  <FlexboxGrid.Item>
                    <Button className="btnDelete" disabled>
                      Delete
                    </Button>
                  </FlexboxGrid.Item>
                </Col>
              ) : null}
            </FlexboxGrid>
          </Row>
        </Grid>

        <Table
          wordWrap
          data={getData(displaylength)}
          onRowClick={data1 => {
            console.log(data1)
          }}
          autoHeight
          autoWidth
        >
          <Column width={70} align="center" fixed>
            <HeaderCell className="tableHeader">
              <Checkbox
                //style={{marginBottom: "10px"}}
                onChange={(value, checked, event) => onCheckboxClick(checked)}
              />
            </HeaderCell>
            <Cell>
              {rowData => {
                function handleCheck() {
                  alert(rowData.Estate)
                }
                return (
                  <span>
                    <Checkbox
                      datakey="Estate"
                      value={rowData.check}
                      onChange={handleCheck}
                    />
                  </span>
                )
              }}
            </Cell>
          </Column>

          {currentTableDataFields.map((field, i) => (
            <Column width={field.width} align="left" key={i}>
              <HeaderCell className="tableHeader">{field.label}</HeaderCell>
              <Cell dataKey={field.value} />
            </Column>
          ))}

          <Column width={200} align="center" fixed="right">
            <HeaderCell className="tableHeader">Action</HeaderCell>
            <Cell align="center">
              {rowData => {
                function handleAction() {
                  alert(`id:${rowData.id}`)
                }
                return (
                  <span>
                    <IconButton
                      size="xs"
                      icon={<Icon icon="star" />}
                      onClick={handleAction}
                    />
                  </span>
                )
              }}
            </Cell>
          </Column>
        </Table>
        <div style={{ float: "right", padding: "1rem" }}>
          <Pagination
            {...pagination}
            pages={noOfPages}
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
