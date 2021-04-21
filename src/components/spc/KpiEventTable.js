import React, { useState } from "react"
import {
  Icon,
  IconButton,
  Table,
  Whisper,
  List,
  FlexboxGrid,
  Tooltip
} from "rsuite"
import GeneralHelper from "../../helper/general.helper"
import { Scrollbars } from "react-custom-scrollbars"
const { Column, HeaderCell, Cell } = Table

const rowKey = "kpiId"
const KpiEventTable = ({ data, height, onKpiClick, onPatternClick }) => {
  const [expandedRowKeysObj, setExpandedRowKeysObj] = useState([])

  const KpiPatternsDetail = rowData => {
    if (rowData && rowData.patterns) {
      return (
        <Scrollbars style={{ height: 200 }} className="pattern_container">
          <FlexboxGrid>
            <FlexboxGrid.Item colspan={6} className="pattern_col">
              <div>
                <div className="pattern_title">Pattern</div>
              </div>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={6} className="pattern_col">
              <div>
                <div className="pattern_title">Region</div>
              </div>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={6} className="pattern_col">
              <div>
                <div className="pattern_title">Start Time</div>
              </div>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={6} className="pattern_col">
              <div>
                <div className="pattern_title">End Time</div>
              </div>
            </FlexboxGrid.Item>
          </FlexboxGrid>
          <List hover className="pattern_list" size="sm">
            {rowData.patterns.map((pattern, index) => (
              <List.Item
                key={pattern["eventId"]}
                index={index}
                className="pattern_list-item"
              >
                <FlexboxGrid>
                  <FlexboxGrid.Item colspan={6} className="pattern_col">
                    <div>
                      <Whisper
                        placement="top"
                        trigger="hover"
                        delayShow={1000}
                        speaker={
                          <Tooltip>Click to see the detail of pattern</Tooltip>
                        }
                      >
                        <div
                          className="pattern_value clickable"
                          onClick={() => onPatternClick(pattern)}
                        >
                          {pattern["pattern"]}
                        </div>
                      </Whisper>
                    </div>
                  </FlexboxGrid.Item>
                  <FlexboxGrid.Item colspan={6} className="pattern_col">
                    <div>
                      <div className="pattern_value">{pattern["region"]}</div>
                    </div>
                  </FlexboxGrid.Item>
                  <FlexboxGrid.Item colspan={6} className="pattern_col">
                    <div>
                      <div className="pattern_value">
                        {pattern["startTime"]}
                      </div>
                    </div>
                  </FlexboxGrid.Item>
                  <FlexboxGrid.Item colspan={6} className="pattern_col">
                    <div>
                      <div className="pattern_value">{pattern["endTime"]}</div>
                    </div>
                  </FlexboxGrid.Item>
                </FlexboxGrid>
              </List.Item>
            ))}
          </List>
        </Scrollbars>
      )
    }
  }

  const ExpandCell = ({
    rowData,
    dataKey,
    expandedRowKeys,
    onChange,
    ...props
  }) => (
    <Cell {...props}>
      <Whisper
        placement="top"
        trigger="hover"
        speaker={<Tooltip>Click to show all patterns</Tooltip>}
        delayShow={1000}
        delayHide={0}
      >
        <IconButton
          size="sm"
          appearance="subtle"
          className="mt--1"
          onClick={() => {
            onChange(rowData)
          }}
          icon={
            <Icon
              icon={
                expandedRowKeys.some(key => key === rowData[rowKey])
                  ? "minus-square-o"
                  : "plus-square-o"
              }
            />
          }
        />
      </Whisper>
    </Cell>
  )

  return (
    <Table
      height={height}
      data={data}
      bordered
      cellBordered
      affixHeader
      rowKey={rowKey}
      expandedRowKeys={expandedRowKeysObj}
      renderRowExpanded={rowData => KpiPatternsDetail(rowData)}
      rowExpandedHeight={200}
    >
      <Column width={70} align="center">
        <HeaderCell>#</HeaderCell>
        <ExpandCell
          dataKey="kpiId"
          expandedRowKeys={expandedRowKeysObj}
          onChange={(rowData, dataKey) =>
            GeneralHelper.handleExpanded(
              rowData,
              dataKey,
              rowKey,
              expandedRowKeysObj,
              setExpandedRowKeysObj
            )
          }
        />
      </Column>
      <Column width={150} resizable>
        <HeaderCell>KPI Name</HeaderCell>
        <Cell dataKey="kpiName">
          {rowData => {
            return (
              <div className="d-flex justify-content-space-center align-items-center">
                <Whisper
                  placement="top"
                  trigger="hover"
                  delayShow={1000}
                  speaker={
                    <Tooltip>
                      Click to see the detail events of this KPI
                    </Tooltip>
                  }
                >
                  <span
                    onClick={() => onKpiClick(rowData)}
                    className="clickable"
                  >
                    {rowData["kpiName"]}
                  </span>
                </Whisper>
              </div>
            )
          }}
        </Cell>
      </Column>
      <Column width={150} resizable>
        <HeaderCell>Fiber Line</HeaderCell>
        <Cell dataKey="fiberLine" />
      </Column>
      <Column width={150} resizable flexGrow={1}>
        <HeaderCell>PI Tag</HeaderCell>
        <Cell dataKey="piTag" />
      </Column>
    </Table>
  )
}

export default KpiEventTable
