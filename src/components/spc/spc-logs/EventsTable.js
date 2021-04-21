import { Table, Tooltip, Whisper } from "rsuite"
import React, { useState } from "react"
import BasicCardContainer from "../../shared/BasicCardContainer"

const { Column, HeaderCell, Cell } = Table
const EventsTable = ({ data, title, setSelectedPattern }) => {
  const [sortColumn, setSortColumn] = useState(null)
  const [sortType, setSortType] = useState(null)
  const getData = () => {
    if (sortColumn && sortType) {
      return data.sort((a, b) => {
        let x = a[sortColumn]
        let y = b[sortColumn]
        if (sortType === "asc") {
          return x.localeCompare(y)
        } else {
          return y.localeCompare(x)
        }
      })
    }
    return data
  }
  const onSort = (column, type) => {
    setTimeout(() => {
      setSortColumn(column)
      setSortType(type)
    }, 200)
  }

  const onSelectPattern = row => {
    const pattern = row.pattern
    const times = data
      .filter(item => item.pattern === pattern)
      .map(item => {
        return {
          startTime: item.startTime,
          endTime: item.endTime
        }
      })
      .sort((x, y) => x.startTime.localeCompare(y.startTime))
    setSelectedPattern({
      pattern,
      times
    })
  }
  return (
    <>
      {data && (
        <BasicCardContainer bg="dark">
          <h2>{title}</h2>
          <Table
            virtualized
            height={350}
            data={getData()}
            bordered
            sortType={sortType}
            sortColumn={sortColumn}
            cellBordered
            affixHeader
            onSortColumn={(column, type) => onSort(column, type)}
          >
            <Column width={130} fixed flexGrow={1} sortable>
              <HeaderCell>Pattern</HeaderCell>
              <Cell dataKey="pattern">
                {row => {
                  return (
                    <Whisper
                      placement="top"
                      trigger="hover"
                      speaker={
                        <Tooltip>
                          Click a pattern to see the highlight chart.
                        </Tooltip>
                      }
                    >
                      <div
                        className="hover highlight"
                        onClick={() => onSelectPattern(row)}
                      >
                        {row["pattern"]}
                      </div>
                    </Whisper>
                  )
                }}
              </Cell>
            </Column>
            <Column width={150} fixed resizable sortable>
              <HeaderCell>Start Time</HeaderCell>
              <Cell dataKey="startTime" />
            </Column>
            <Column width={150} fixed resizable sortable>
              <HeaderCell>End Time</HeaderCell>
              <Cell dataKey="endTime" />
            </Column>
          </Table>
        </BasicCardContainer>
      )}
    </>
  )
}

export default EventsTable
