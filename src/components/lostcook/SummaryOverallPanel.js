import React, { useEffect, useState } from "react"
import { Row, Col, Container } from "reactstrap"
import { DatePicker, DateRangePicker } from "rsuite"
import moment from "moment"
import LostcookCumulative from "./summary-overall/LostcookCumulative"
import Top5 from "./summary-overall/Top5"
import OpenMaintenanceOrder from "./summary-overall/OpenMaintenanceOrder"
import { Scrollbars } from "react-custom-scrollbars"
const { after } = DateRangePicker

const SummaryOverallPanel = ({ product, latestDate }) => {
  const [selectedDate, setSelectedDate] = useState(null)
  const [frequency, setFrequency] = useState("ytd")
  useEffect(() => {
    setSelectedDate(latestDate)
  }, [latestDate])
  if (!latestDate || !selectedDate) {
    return ""
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
              <div className="d-flex">
                <span className="mr-3">Frequency:</span>
                <div
                  className="custom-control opex-radio custom-radio"
                  onClick={() => setFrequency("ytd")}
                >
                  <input
                    className="custom-control-input"
                    value="ytd"
                    name="chartType"
                    type="radio"
                    checked={frequency === "ytd"}
                    onChange={() => setFrequency("ytd")}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="customRadio2"
                  >
                    <span>YTD</span>
                  </label>
                </div>
                <div
                  className="custom-control opex-radio custom-radio"
                  onClick={() => setFrequency("mtd")}
                >
                  <input
                    className="custom-control-input"
                    value="mtd"
                    name="chartType"
                    type="radio"
                    checked={frequency === "mtd"}
                    onChange={() => setFrequency("mtd")}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="customRadio1"
                  >
                    <span>MTD</span>
                  </label>
                </div>
              </div>
            </div>
            <p className="info_box mb-0">
              <i className="fa fa-exclamation-circle"></i> Latest date
              available:{" "}
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
              <Row className="">
                <Col>
                  <LostcookCumulative
                    selectedDate={selectedDate}
                    frequency={frequency}
                  />
                </Col>
              </Row>

              <Row className="">
                <Col>
                  <Top5 selectedDate={selectedDate} frequency={frequency} />
                </Col>
              </Row>

              <Row className="">
                <Col>
                  <OpenMaintenanceOrder
                    selectedDate={selectedDate}
                    frequency={frequency}
                  />
                </Col>
              </Row>
            </Container>
          </Scrollbars>
        </div>
      </div>
    </>
  )
}
SummaryOverallPanel.defaultProps = {
  product: "summary-overall"
}

export default SummaryOverallPanel
