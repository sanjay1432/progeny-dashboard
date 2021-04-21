import { Alert, Icon, IconButton, Modal, Table, Tooltip, Whisper } from "rsuite"
import { Button, Card, CardBody, Col, Container, Row } from "reactstrap"
import EventsTable from "./EventsTable"
import { useEffect, useState } from "react"
import EChartsReact from "echarts-for-react"
import BasicCardContainer from "components/shared/BasicCardContainer"
import { moment } from "moment"
import EchartOpex from "components/shared/EchartOpex"
import _ from "lodash"
import SPCService from "../../../services/spc.service"
import axios from "axios"
import { CANCEL_REQUEST } from "../../../constants"

const { Column, HeaderCell, Cell } = Table

const HEATMAP_OPTION = {
  tooltip: {
    position: "top"
  },
  grid: {
    height: "50%",
    top: "10%"
  },
  xAxis: {
    type: "category",
    data: [],
    splitArea: {
      show: true
    }
  },
  yAxis: {
    type: "category",
    data: [],
    splitArea: {
      show: true
    }
  },
  visualMap: {
    min: 0,
    max: 10,
    calculable: true,
    orient: "vertical",
    right: "0",
    top: "20%"
  },
  series: [
    {
      name: "VALUE",
      type: "heatmap",
      data: [],
      label: {
        show: true
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: "rgba(0, 0, 0, 0.5)"
        }
      }
    }
  ]
}

const SCATTER_OPTION = {
  grid: {
    right: "100px",
    bottom: "20px",
    top: "30px"
  },
  dataset: [
    {
      source: []
    },
    {
      transform: {
        type: "ecStat:regression",
        config: {
          method: "exponential"
        }
      }
    }
  ],
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross"
    }
  },
  xAxis: {
    name: "Temperature",
    splitLine: {
      lineStyle: {
        type: "dashed"
      }
    }
  },
  yAxis: {
    name: "Pre O2 Kappa",
    splitLine: {
      lineStyle: {
        type: "dashed"
      }
    }
  },
  series: [
    {
      name: "VALUE",
      type: "scatter",
      datasetIndex: 0
    }
  ]
}

const Correlation = ({ isSubKpiTable, correlationTable, correlationHeatmap, delayTime, param }) => {
  const [scatter, setScatter] = useState(null)
  const [isShowHeatmap, setIsShowHeatmap] = useState(false)
  const [heatmap, setHeatmap] = useState({})

  const [sortColumn, setSortColumn] = useState(null)
  const [sortType, setSortType] = useState(null)
  const getData = () => {
    if (sortColumn && sortType) {
      return correlationTable.kpis.sort((a, b) => {
        let x = a[sortColumn]
        let y = b[sortColumn]
        if (sortType === "asc") {
          return x.localeCompare(y)
        } else {
          return y.localeCompare(x)
        }
      })
    }
    return correlationTable.kpis
  }
  const onSort = (column, type) => {
    setTimeout(() => {
      setSortColumn(column)
      setSortType(type)
    }, 200)
  }

  const getMinMaxForHeatmap = heatmapData => {
    const min = _.minBy(heatmapData, function (arr) {
      return arr[2]
    })[2]
    const max = _.maxBy(heatmapData, function (arr) {
      return arr[2]
    })[2]
    return {
      min,
      max
    }
  }
  useEffect(() => {
    if (correlationTable) {
      console.log(correlationTable)
      const {pitag, kpiName} = correlationTable.kpis[0]
      getScatterChart(pitag, kpiName)
    }
  }, [correlationTable])

  useEffect(() => {
    if (correlationHeatmap && correlationHeatmap.heatmap) {
      const heatmapOpt = HEATMAP_OPTION
      const { xAxis, yAxis } = correlationHeatmap.heatmap
      heatmapOpt.xAxis.data = xAxis
      heatmapOpt.yAxis.data = yAxis
      heatmapOpt.series[0].data = correlationHeatmap.heatmap.data
      const minMax = getMinMaxForHeatmap(correlationHeatmap.heatmap.data)
      heatmapOpt.visualMap.min = minMax.min
      heatmapOpt.visualMap.max = minMax.max
      setHeatmap(heatmapOpt)
    }
  }, [correlationHeatmap])

  const getScatterChart = (pitag,kpiName) => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    SPCService.getScatter(
      {
        millId: param.millId,
        buId: param.buId,
        kpiPitag: param.pitag,
        startTime: param.startTime,
        endTime: param.endTime,
        subKpiPitag: pitag
      },
      source
    ).then(
      data => {
        if (data) {
          const option = _.cloneDeep(SCATTER_OPTION)
          option.dataset[0].source = data
          option.xAxis.name = kpiName
          option.yAxis.name = param.kpiName
          setScatter(option)
        }
      },
      error => {
        if (error && error.message !== CANCEL_REQUEST) {
          Alert.error(
            error.message || "API error, please contact Dev team to check.",
            5000
          )
        }
        console.log(error)
        return Promise.reject()
      }
    )
  }
  return (
    <div>
      <Row className="__row mt-3">
          {correlationTable.kpis && (
            <Col md={6} sm={12}>
              <BasicCardContainer bg="dark">
                <div className="d-flex align-items-center flex-wrap justify-content-between mb-2">
                  <h2>{delayTime} Delay</h2>

                  <Whisper
                    placement="top"
                    trigger="hover"
                    speaker={<Tooltip>Click to see the Heatmap.</Tooltip>}
                  >
                    <IconButton
                      icon={<Icon icon="retention" />}
                      size="sm"
                      onClick={() => setIsShowHeatmap(true)}
                    />
                  </Whisper>
                </div>

                <Table
                  virtualized
                  height={320}
                  data={getData()}
                  bordered
                  sortType={sortType}
                  sortColumn={sortColumn}
                  cellBordered
                  affixHeader
                  affixHorizontalScrollbar
                  onSortColumn={(column, type) => onSort(column, type)}
                >
                  <Column width={180} fixed flexGrow={1} sortable>
                    <HeaderCell>{isSubKpiTable ? "Sub KPI" : "KPI"}</HeaderCell>
                    <Cell dataKey="kpiName">
                      {row => {
                        return (
                          <Whisper
                            placement="top"
                            trigger="hover"
                            speaker={
                              <Tooltip>
                                Click to see the Correlation Plot.
                              </Tooltip>
                            }
                          >
                            <div
                              className="hover highlight"
                              onClick={() => getScatterChart(row.pitag,row.kpiName)}
                            >
                              {row["kpiName"]}
                            </div>
                          </Whisper>
                        )
                      }}
                    </Cell>
                  </Column>
                  <Column width={120} fixed resizable sortable>
                    <HeaderCell>Pearson</HeaderCell>
                    <Cell dataKey="pearson" />
                  </Column>
                  <Column width={120} fixed resizable sortable>
                    <HeaderCell>Spearman</HeaderCell>
                    <Cell dataKey="spearman" />
                  </Column>
                  <Column width={120} fixed resizable sortable>
                    <HeaderCell>Uniformity</HeaderCell>
                    <Cell dataKey="uniformity" />
                  </Column>
                </Table>
              </BasicCardContainer>
            </Col>
          )}
          {scatter && (
            <Col md={6} sm={12}>
              <BasicCardContainer bg="dark">
                <EchartOpex
                  option={scatter}
                  style={{ height: "350px" }}
                  chartTitle="Correlation plot"
                  chartHeader={<h2>Correlation plot</h2>}
                  notMerge={true}
                />
              </BasicCardContainer>
            </Col>
          )}
        </Row>

      <Modal
        full
        overflow={true}
        show={isShowHeatmap}
        onHide={() => setIsShowHeatmap(false)}
      >
        <Modal.Header>
          <Modal.Title>
            Heatmap showing for 8-2-2021 until 30-3-2021
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {heatmap && (
            <EchartOpex
              option={heatmap}
              style={{ height: "350px" }}
              chartTitle="Number of occurrence"
              showExpand={false}
              notMerge={true}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default Correlation
