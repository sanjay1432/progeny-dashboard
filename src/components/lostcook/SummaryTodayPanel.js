import React, { useEffect, useState } from "react"
import { Container } from "reactstrap"
import { Scrollbars } from "react-custom-scrollbars"
import { useSelector } from "react-redux"

import { DatePicker, Loader } from "rsuite"
import moment from "moment"
import ProcessLineContainer from "./summary-today/ProcessLineContainer"
import LostcookEventDetails from "./summary-today/LostcookEventDetails"

const SummaryTodayPanel = ({ latestDate }) => {
  const [selectedDate, setSelectedDate] = useState(null)
  const fiberlines = useSelector(state => state.lostcookReducer.fiberlines)
  const [updatePanel, setUpdatePanel] = useState(Date.now())

  useEffect(() => {
    setSelectedDate(latestDate)
  }, [latestDate])

  const updatePanelAction = () => {
    setUpdatePanel(Date.now())
  }

  return (
    <>
      <div className="opex-panel-content">
        <div className="__header">
          <div className="main-tabs-item align-items-center flex-wrap">
            <div className="right-control">
              <span>Date:</span>
              <div className="date-picker">
                <DatePicker
                  // disabledDate={after(new Date(selectedDate))}
                  oneTap
                  style={{ width: 150 }}
                  format="DD MMM YYYY"
                  cleanable={false}
                  value={new Date(selectedDate)}
                  onChange={selected => setSelectedDate(selected)}
                />
              </div>
            </div>
            <p className="info_box mb-0">
              <i className="fa fa-exclamation-circle" /> Latest date available:{" "}
              <strong>{moment(latestDate).format("DD MMM YYYY")}.</strong>
            </p>
          </div>
        </div>
        <div className="__content">
          <Scrollbars
            className="__content-tab"
            style={{ height: `calc(100vh - 226px)` }}
          >
            <Container fluid>
              {updatePanel && selectedDate ? (
                <div>
                  {fiberlines
                    ? fiberlines.map((item, index) => {
                        return (
                          <ProcessLineContainer
                            key={index + Date.now()}
                            fiberlineId={item.value}
                            selectedDate={selectedDate}
                          />
                        )
                      })
                    : ""}
                  <LostcookEventDetails
                    selectedDate={selectedDate}
                    onUpdatePanel={updatePanelAction}
                  />
                </div>
              ) : (
                <Loader center content="Loading" />
              )}
            </Container>
          </Scrollbars>
        </div>
      </div>
    </>
  )
}
export default SummaryTodayPanel
