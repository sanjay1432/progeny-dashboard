import React from "react"
import { Scrollbars } from "react-custom-scrollbars"
import { AutoSizer } from "react-virtualized"
import { Grid, Row, Col, ButtonToolbar, IconButton, Icon, Drawer } from "rsuite"
import KPICategories from "./KPICategories"
import GeneralHelper from "../../helper/general.helper"

const MillOverviewDrawer = ({
  selectedProduction,
  selectedMill,
  onCloseDrawer,
  showDrawer,
  onGotoDashboard,
  frequency,
  displayAsDate
}) => {
  const gotoDashboard = mill => {
    onGotoDashboard(mill)
  }
  return (
    <>
      {selectedMill && selectedProduction ? (
        <Drawer
          size="lg"
          placement="left"
          show={showDrawer}
          onHide={() => onCloseDrawer()}
        >
          <Drawer.Body>
            <div className="opex-panel-content-overview _drawer">
              <div className="__header">
                <Grid fluid>
                  <Row>
                    <Col md={24}>
                      <div className="_grid-content top">
                        <div className="header-logo">
                          <div>{selectedMill.logo}</div>
                          <ButtonToolbar>
                            <IconButton
                              onClick={() => gotoDashboard(selectedMill)}
                              icon={<Icon icon="th-large" />}
                              circle
                              size="sm"
                            />
                            <IconButton
                              onClick={() => onCloseDrawer()}
                              icon={<Icon icon="compress" />}
                              circle
                              size="sm"
                            />
                          </ButtonToolbar>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Grid>
              </div>
              <div className="__content">
                <div
                  style={{
                    display: "flex",
                    height: "calc(100vh - 95px)"
                  }}
                >
                  <AutoSizer>
                    {({ width, height }) => {
                      return (
                        <Scrollbars style={{ width, height }}>
                          <div className="__charts">
                            <Grid fluid>
                              <Row>
                                <Col md={24}>
                                  <div className="_grid-content bottom">
                                    <div className="gauge_chart">
                                      {selectedProduction.map(
                                        (gaugeChart, index) => {
                                          return GeneralHelper.buildGaugeChart(
                                            gaugeChart,
                                            index
                                          )
                                        }
                                      )}
                                    </div>

                                    <KPICategories
                                      buId={selectedMill.buId}
                                      millId={selectedMill.millId}
                                      frequency={frequency}
                                      displayAsDate={displayAsDate}
                                    />
                                  </div>
                                </Col>
                              </Row>
                            </Grid>
                          </div>
                        </Scrollbars>
                      )
                    }}
                  </AutoSizer>
                </div>
              </div>
            </div>
          </Drawer.Body>
        </Drawer>
      ) : (
        ""
      )}
    </>
  )
}

export default MillOverviewDrawer
