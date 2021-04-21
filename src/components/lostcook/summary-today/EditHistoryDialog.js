import React, { useState } from "react"
import { Modal, Loader, Table } from "rsuite"
import GeneralHelper from "../../../helper/general.helper"

const { Column, HeaderCell, Cell, Pagination } = Table

const EditHistoryDialog = ({ isEditHis, dataSet, onClose }) => {
  const [page, setPage] = useState(1)
  const [displayLength, setDisplayLength] = useState(10)

  const handleChangePage = dataKey => {
    setPage(dataKey)
  }
  const handleChangeLength = dataKey => {
    setPage(1)
    setDisplayLength(dataKey)
  }
  const getData = () => {
    return dataSet.filter((v, i) => {
      const start = displayLength * (page - 1)
      const end = start + displayLength
      return i >= start && i < end
    })
  }
  const DateCell = ({ rowData, dataKey, ...props }) =>
    GeneralHelper.DateCell(
      { rowData, dataKey, ...props },
      "DD MMM YYYY, HH:mm Z"
    )
  return (
    <>
      <Modal
        full
        overflow={true}
        show={isEditHis}
        onHide={() => {
          onClose()
        }}
      >
        <Modal.Header>
          <Modal.Title>Edit History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isEditHis && dataSet ? (
            <div>
              <Table
                wordWrap
                data={getData()}
                bordered
                cellBordered
                height={420}
                affixHeader
                affixHorizontalScrollbar
              >
                <Column width={130} fixed resizable>
                  <HeaderCell>Index</HeaderCell>
                  <Cell dataKey="index" />
                </Column>
                <Column resizable width={300}>
                  <HeaderCell>Activities</HeaderCell>
                  <Cell dataKey="activities" />
                </Column>
                <Column width={160} resizable>
                  <HeaderCell>By</HeaderCell>
                  <Cell dataKey="by" />
                </Column>
                <Column width={200} resizable>
                  <HeaderCell>Date & Time</HeaderCell>
                  <DateCell dataKey="dateTime" />
                </Column>
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
                total={dataSet.length}
                onChangePage={handleChangePage}
                onChangeLength={handleChangeLength}
              />
            </div>
          ) : (
            <Loader content="Loading" center />
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}

export default EditHistoryDialog
