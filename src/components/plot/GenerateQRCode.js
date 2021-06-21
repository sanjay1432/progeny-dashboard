import React, { useState, useEffect } from "react"
import QRCode from "qrcode.react"
import PlotService from "../../services/plot.service"
import { Panel, Grid, Row, Col, Button, Checkbox } from "rsuite"

const GenerationQRCode = ({ option }) => {
  const [qrData, setQrData] = useState("")

  useEffect(() => {
    PlotService.getQrCodeDataList(option.trialid).then(response => {
      console.log(response.data)
    })
  }, [])

  return (
    <>
      <Grid>
        <Row>
          <Col md={3} lg={3}>
            <p>Trial ID : {option.trialid}</p>
          </Col>

          <Col md={3} lg={3}>
            <p>Plot : {option.plot.slice(4)}</p>
          </Col>

          <Col md={3} lg={3}>
            <Checkbox />
            <p>Select All</p>
          </Col>

          <Col xsOffset={11} md={4} lg={4}>
            <Button appearance="primary">Print QR Code</Button>
          </Col>
        </Row>
      </Grid>

      <Panel bordered>
        <Row>
          <Col md={6} lg={6}>
            <QRCode value="http://facebook.github.io/react/" />
          </Col>
        </Row>
      </Panel>
    </>
  )
}

export default GenerationQRCode
