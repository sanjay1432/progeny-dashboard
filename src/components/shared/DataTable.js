import React, { useState, useEffect, useRef } from "react"
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
const DataTable = ({ currentSubNavState, currentItem, ...props }) => {
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
  function getData(displaylength) {
    return fakeData.filter((v, i) => {
      const start = displaylength * (activePage - 1)
      const end = start + displaylength
      return i >= start && i < end
    })
  }

  function getPages() {
    const { displaylength } = pagination
    return Math.ceil(fakeData.length / displaylength)
  }

  function onCheckboxClick(e) {
    // fakeData.forEach(element => {
    //   element.check = e
    // });
    setCheckState(e)
  }

  function modalAction() {
    if (isModal == true) {
      setModal(false)
    } else if (isModal == false) {
      setModal(true)
    }
  }

  const noOfPages = getPages()
  return (
    <>
      <div>
        <Grid fluid>
          <Row className="show-grid" id="tableOption">
            <Col sm={6} md={6} lg={6}>
              <b className="totalRecord">Total records ({fakeData.length})</b>
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

              <Col sm={5} md={5} lg={3}>
                <FlexboxGrid.Item>
                  <Button
                    appearance="primary"
                    className="btnAdd"
                    onClick={modalAction}
                  >
                    Add {active}
                  </Button>
                </FlexboxGrid.Item>
              </Col>

              <AddEstateModal show={isModal} />

              <Col sm={4} md={4} lg={3}>
                <FlexboxGrid.Item>
                  <Button className="btnDelete" disabled>
                    Delete
                  </Button>
                </FlexboxGrid.Item>
              </Col>
            </FlexboxGrid>
          </Row>
        </Grid>

        <Table
          //height={300}
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
                  //alert(`id:${rowData.id}`)
                  if (rowData.check == false) {
                    rowData.check(true)
                  } else {
                    rowData.check(false)
                  }
                }
                return (
                  <span>
                    <Checkbox checked={rowData.check} onChange={handleCheck} />
                  </span>
                )
              }}
            </Cell>
          </Column>
          <Column width={300} align="left">
            <HeaderCell className="tableHeader">Estate</HeaderCell>
            <Cell dataKey="Estate" />
          </Column>

          <Column width={300} align="left">
            <HeaderCell className="tableHeader">Estate Full Name</HeaderCell>
            <Cell dataKey="Estate Full Name" />
          </Column>

          <Column width={200} align="left">
            <HeaderCell className="tableHeader">No of Estate Block</HeaderCell>
            <Cell dataKey="No of Estate Block" />
          </Column>

          <Column width={200} align="left">
            <HeaderCell className="tableHeader">
              No Trial on this Estate
            </HeaderCell>
            <Cell dataKey="No Trial on this Estate" />
          </Column>

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
