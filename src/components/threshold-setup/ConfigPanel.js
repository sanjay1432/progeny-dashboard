import React, { useEffect, useState } from "react"
import { Scrollbars } from "react-custom-scrollbars"
import { Row, Col, Container } from "reactstrap"
import { Button } from "reactstrap"
import { InputGroup, Input, Icon, Table, Loader } from "rsuite"
import _ from "lodash"
import moment from "moment"
import { ModuleAbility } from "../../models/ModuleAbility"
import { ACTION, MODULE } from "../../constants"
import { useSelector } from "react-redux"
import { useAbility } from "@casl/react"
import { AbilityContext } from "../../config/Can"
const { Column, HeaderCell, Cell, Pagination } = Table

const ConfigPanel = ({ columns, data, addConfig, hasFilter = false }) => {
  const [searchText, setSearchText] = useState("")
  const [page, setPage] = useState(1)
  const [displayLength, setDisplayLength] = useState(10)
  const [sortColumn, setSortColumn] = useState(null)
  const [sortType, setSortType] = useState(null)
  const [loading, setLoading] = useState(false)
  const mill = useSelector(state => state.appReducer.mill)
  const ability = useAbility(AbilityContext)
  const [moduleAbility, setModuleAbility] = useState(null)

  useEffect(() => {
    setModuleAbility(
      new ModuleAbility(MODULE.threshold, mill.millId, mill.buId)
    )
  }, [mill])

  const getData = () => {
    if (searchText === "") {
      if (sortColumn && sortType) {
        return paging(sortData(data))
      } else {
        return paging(data)
      }
    } else {
      if (sortColumn && sortType) {
        return paging(sortData(searchData(searchText, data)))
      } else {
        return paging(searchData(searchText, data))
      }
    }
  }

  const sortData = dataArr => {
    return dataArr.sort((a, b) => {
      let x = a[sortColumn]
      let y = b[sortColumn]
      switch (sortColumn) {
        case "bu":
          x = a[sortColumn].buName
          y = b[sortColumn].buName
          break
        case "processLine":
          x = a[sortColumn].processLineName
          y = b[sortColumn].processLineName
          break
        case "startDate":
        case "endDate":
          if (sortType === "asc") {
            return moment(moment(b[sortColumn]).format("DD MMM YYYY")).diff(
              moment(a[sortColumn]).format("DD MMM YYYY")
            )
          } else {
            return moment(moment(a[sortColumn]).format("DD MMM YYYY")).diff(
              moment(b[sortColumn]).format("DD MMM YYYY")
            )
          }
        default:
          break
      }
      // console.log(x,y)
      if (typeof x === "string" && typeof y === "string") {
        if (sortType === "asc") {
          return x.localeCompare(y)
        } else {
          return y.localeCompare(x)
        }
      }
      if (sortType === "asc") {
        return x - y
      } else {
        return y - x
      }
    })
  }

  const paging = dataArr => {
    return dataArr.filter((v, i) => {
      const start = displayLength * (page - 1)
      const end = start + displayLength
      return i >= start && i < end
    })
  }
  const searchData = (searchTextString, dataArr) => {
    return dataArr.filter(row => {
      return Object.keys(row).some(item => {
        const allowSearch = _.findIndex(columns, col => {
          return col.dataKey === item && col.sortable === true
        })
        let found = false
        switch (item) {
          case "bu":
            found =
              row[item] &&
              row[item].buName
                .toString()
                .toLowerCase()
                .search(searchTextString.toLowerCase()) >= 0
            break
          case "processLine":
            found =
              row[item] &&
              row[item].processLineName
                .toString()
                .toLowerCase()
                .search(searchTextString.toLowerCase()) >= 0
            break
          case "startDate":
          case "endDate":
            found =
              row[item] &&
              moment(row[item])
                .format("DD MMM YYYY")
                .toString()
                .toLowerCase()
                .search(searchTextString.toLowerCase()) >= 0
            break
          default:
            found =
              row[item] &&
              row[item]
                .toString()
                .toLowerCase()
                .search(searchTextString.toLowerCase()) >= 0
            break
        }
        return found && allowSearch >= 0
      })
    })
  }

  const handleSortColumn = (sortColumnData, sortTypeLabel) => {
    setLoading(true)

    setTimeout(() => {
      setSortColumn(sortColumnData)
      setSortType(sortTypeLabel)
      setLoading(false)
    }, 500)
  }

  const handleChangePage = dataKey => {
    setPage(dataKey)
  }
  const handleChangeLength = dataKey => {
    setPage(1)
    setDisplayLength(dataKey)
  }

  return (
    <>
      <div className="opex-panel-content">
        <div className="__header">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div className="">
              <InputGroup
                inside
                size="md"
                className="mr-3"
                style={{ maxWidth: 400, width: 300 }}
              >
                <Input
                  maxLength={255}
                  placeholder="Search"
                  value={searchText}
                  onChange={text => {
                    setPage(1)
                    setSearchText(text)
                  }}
                />
                <InputGroup.Addon>
                  <Icon icon="search" />
                </InputGroup.Addon>
              </InputGroup>
            </div>
            <div>
              {moduleAbility !== null &&
                ability.can(ACTION.modify, moduleAbility) && (
                  <Button
                    color="primary"
                    size="sm"
                    type="button"
                    className="btn-rounded pd-big"
                    onClick={addConfig}
                  >
                    Add
                  </Button>
                )}
            </div>
          </div>
        </div>
        <div>
          <Scrollbars
            className="__content-tab"
            style={{
              height: hasFilter ? `calc(100vh - 400px)` : `calc(100vh - 226px)`
            }}
          >
            <Container fluid>
              <Row className="__row">
                <Col>
                  {columns && data ? (
                    <div>
                      <Table
                        data={getData()}
                        bordered
                        cellBordered
                        autoHeight
                        affixHeader
                        affixHorizontalScrollbar
                        sortColumn={sortColumn}
                        sortType={sortType}
                        onSortColumn={handleSortColumn}
                        loading={loading}
                      >
                        {columns.map((col, index) => {
                          const fixed = col.fixed ? col.fixed : false
                          const width = col.width ? col.width : 140
                          const resizable = !!col.resizable
                          return (
                            <Column
                              width={width}
                              fixed={fixed}
                              flexGrow={col.flexGrow}
                              resizable={resizable}
                              key={index}
                              sortable={col.sortable}
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
                      <Pagination
                        lengthMenu={[
                          {
                            value: 10,
                            label: 10
                          },
                          {
                            value: 20,
                            label: 20
                          }
                        ]}
                        activePage={page}
                        displayLength={displayLength}
                        total={data.length}
                        onChangePage={handleChangePage}
                        onChangeLength={handleChangeLength}
                      />
                    </div>
                  ) : (
                    <Loader center content="Loading" />
                  )}
                </Col>
              </Row>
            </Container>
          </Scrollbars>
        </div>
      </div>
    </>
  )
}

export default ConfigPanel
