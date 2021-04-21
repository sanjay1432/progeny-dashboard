import { Table, Drawer, Tooltip, Whisper, FlexboxGrid, Alert } from "rsuite"
import React, { useEffect, useState } from "react"
import EchartOpex from "../../shared/EchartOpex"
import SPCService from "../../../services/spc.service"
import { CANCEL_REQUEST } from "../../../constants"
import axios from "axios"
import _ from "lodash"
const { Column, HeaderCell, Cell } = Table

const PIE_CHART_OPTION = {
  tooltip: {
    trigger: "item",
    formatter: "<b>{a}</b> <br/><b>{b}</b> <br/> Value: {c}"
  },
  legend: {
    type: "scroll",
    orient: "vertical",
    right: 0,
    top: 20,
    bottom: 20
  },
  series: [
    {
      name: "",
      type: "pie",
      radius: ["0", "80%"],
      avoidLabelOverlap: false,
      data: [],
      legendHoverLink: false,
      label: {
        show: false
      },
      left: "-40%",
      selectedMode: "single"
    }
  ]
}
const KpiEventsDetailDialog = ({ show, onHide, kpi, queryParam }) => {
  const onPatternClick = rowData => {
    alert("i")
  }

  const [parameterData, setParameterData] = useState([])
  const [patternPieChart, setPatternPieChart] = useState([])

  const buildPieChart = data => {
    const option = _.cloneDeep(PIE_CHART_OPTION)

    const sumArr = _.sumBy(data.value, function (item) {
      return Number.parseFloat(item)
    })
    const legendData = data.map(item => {
      const percentage = Number.parseFloat(
        (Number.parseFloat(item.value) * 100) / sumArr
      ).toFixed(2)
      return {
        name: `${item.name} ${percentage}%`,
        value: item.value,
        realLabel: item.name,
        itemStyle: {
          color: "red"
        }
      }
    })
  }

  useEffect(() => {
    if (kpi) {
      buildPieChart(kpi.graph)
      const CancelToken = axios.CancelToken
      const source = CancelToken.source()
      SPCService.getKpiEventsDetail(
        {
          piTag: kpi.piTag,
          kpiId: kpi.kpiId,
          ...queryParam
        },
        source
      ).then(
        data => {
          setParameterData(data.kpis)
        },
        error => {
          if (error && error.message !== CANCEL_REQUEST) {
            Alert.error("We got an unknown error.", 5000)
          }
          console.log(error)
          return Promise.reject()
        }
      )
    }
  }, [kpi, queryParam])

  if (!kpi) {
    return null
  }

  return (
    <Drawer full placement="bottom" show={show} onHide={() => onHide(false)}>
      <Drawer.Header>
        <Drawer.Title>KPI Events</Drawer.Title>
        <FlexboxGrid>
          <FlexboxGrid.Item colspan={6} className="pattern_col">
            <div>
              <div className="pattern_title">KPI Name</div>
              <div className="pattern_value">{kpi.kpiName}</div>
            </div>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={6} className="pattern_col">
            <div>
              <div className="pattern_title">Fiber Line</div>
              <div className="pattern_value">{kpi.fiberLine}</div>
            </div>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={6} className="pattern_col">
            <div>
              <div className="pattern_title">PI Tag</div>
              <div className="pattern_value">{kpi.piTag}</div>
            </div>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Drawer.Header>
      <Drawer.Body>
        <Table
          height={200}
          data={kpi.patterns}
          bordered
          cellBordered
          affixHeader
        >
          <Column width={200} resizable flexGrow={1}>
            <HeaderCell>Pattern</HeaderCell>
            <Cell>
              {rowData => (
                <Whisper
                  placement="top"
                  trigger="hover"
                  delayShow={1000}
                  speaker={<Tooltip>Click to see the graph</Tooltip>}
                >
                  <span
                    onClick={() => onPatternClick(rowData)}
                    className="clickable"
                  >
                    {rowData["pattern"]}
                  </span>
                </Whisper>
              )}
            </Cell>
          </Column>
          <Column width={100} resizable>
            <HeaderCell>Region</HeaderCell>
            <Cell dataKey="region" />
          </Column>
          <Column width={180} resizable>
            <HeaderCell>Start Time</HeaderCell>
            <Cell dataKey="startTime" />
          </Column>
          <Column width={180} resizable>
            <HeaderCell>End Time</HeaderCell>
            <Cell dataKey="endTime" />
          </Column>
        </Table>
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <EchartOpex chartTitle="s" option={{}} />
            </div>
            <div className="col">
              <EchartOpex chartTitle="s" option={{}} />
            </div>
          </div>
        </div>
      </Drawer.Body>
    </Drawer>
  )
}

export default KpiEventsDetailDialog
