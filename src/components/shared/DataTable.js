import React, { useState, useEffect } from "react"
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
const DataTable = ({ currentSubNavState, ...props }) => {
  console.log(currentSubNavState)
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
      check: true,
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
      check: false,
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
    console.log("YP")
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

  const noOfPages = getPages()
  return (
    <>
      <div>
        <Grid fluid style={{ padding: "1rem" }}>
          <Row className="show-grid" style={{ color: "black" }}>
            <Col xs={9} xsPush={15}>
              <FlexboxGrid justify="space-around">
                <FlexboxGrid.Item>
                  <InputPicker
                    data={perpage}
                    defaultValue={"10"}
                    style={{ width: 80 }}
                    onChange={handleChangeLength}
                  />{" "}
                  per page
                </FlexboxGrid.Item>
                <FlexboxGrid.Item>
                  <Button appearance="primary" style={{ width: "100%" }}>
                    Add {active}
                  </Button>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item>
                  <Button
                    appearance="primary"
                    style={{ width: "100%" }}
                    disabled
                  >
                    Delete
                  </Button>
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </Col>
            <Col xs={3} xsPull={9}>
              <b>Total records ({fakeData.length})</b>
            </Col>
          </Row>
        </Grid>

        <Table
          height={300}
          data={getData(displaylength)}
          onRowClick={data1 => {
            console.log(data1)
          }}
        >
          <Column width={70} align="center" fixed>
            <HeaderCell>
              <Checkbox
                onChange={(value, checked, event) => onCheckboxClick(checked)}
              />
            </HeaderCell>
            <Cell>
              {rowData => {
                function handleAction() {
                  alert(`id:${rowData.id}`)
                }
                return (
                  <span>
                    <Checkbox checked={rowData.check} />
                  </span>
                )
              }}
            </Cell>
          </Column>
          <Column width={300} align="center">
            <HeaderCell>Estate</HeaderCell>
            <Cell dataKey="Estate" />
          </Column>

          <Column width={300}>
            <HeaderCell>Estate Full Name</HeaderCell>
            <Cell dataKey="Estate Full Name" />
          </Column>

          <Column width={300}>
            <HeaderCell>No of Estate Block</HeaderCell>
            <Cell dataKey="No of Estate Block" />
          </Column>

          <Column width={300}>
            <HeaderCell>No Trial on this Estate</HeaderCell>
            <Cell dataKey="No Trial on this Estate" />
          </Column>

          <Column width={100} fixed="right">
            <HeaderCell>Action</HeaderCell>

            <Cell>
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
