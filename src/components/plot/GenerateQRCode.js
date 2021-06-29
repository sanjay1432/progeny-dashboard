import React, { useState, useEffect, useRef } from "react"
import QRCode from "qrcode.react"
import PlotService from "../../services/plot.service"
import { useReactToPrint } from "react-to-print"
import { PrintLayout } from "./sharedComponent/PrintLayout"
import { Panel, Grid, Row, Col, Button, Checkbox, Modal } from "rsuite"

const GenerationQRCode = ({ option }) => {
  const [qrData, setQrData] = useState([])
  const [zoomInQR, setZoomInQR] = useState(false)
  const [zoomInData, setZoomInData] = useState("")
  const [checkStatus, setCheckStatus] = useState([])

  useEffect(() => {
    async function fetchData() {
      const data = await PlotService.getQrCodeDataList(option.trialid)
      setQrData(data)
    }
    fetchData()
  }, [])

  console.log(qrData)

  const CheckCell = ({ onChange, checkedKeys, data }) => {
    return (
      <Checkbox
        value={data}
        inline
        onChange={onChange} //onChange = handleCheck
        checked={checkedKeys.some(item => item === data)} //checkedKeys === checkStatus
      />
    )
  }

  let indeterminate = false
  let checked = false
  let disabled = true

  if (checkStatus.length > 0 && checkStatus.length < qrData.length) {
    indeterminate = true
    disabled = false
  } else if (checkStatus.length === qrData.length) {
    checked = true
    disabled = false
  }

  function handleCheckAll(value, checkedAllItem) {
    const keys = checkedAllItem ? qrData.map(item => item.palmno) : []
    setCheckStatus(keys)
  }

  function handleCheck(value, checkedItem) {
    const keys = checkedItem
      ? [...checkStatus, value]
      : checkStatus.filter(item => item !== value)
    setCheckStatus(keys)
    console.log(checkStatus)
  }

  const printRef = useRef()

  const handleValue = useRef()

  const handlePrint = useReactToPrint({
    content: () => printRef.current
  })

  return (
    <div id="GenerationQRCode">
      <Modal
        id="QrCodeModal"
        size="xs"
        show={zoomInQR}
        onHide={() => setZoomInQR(false)}
      >
        <Modal.Body>
          <QRCode className="QRCode" size={290} value="hihi" />
          <p className="palm">
            Plam : <b className="palmData">{zoomInData}</b>
          </p>
        </Modal.Body>
      </Modal>

      <div style={{ display: "none" }}>
        <PrintLayout ref={printRef} data={checkStatus} />
      </div>

      <Grid className="qrFunctionSetting" fluid>
        <Row>
          <Col md={3} lg={3}>
            <p className="trial">
              Trial ID : <b className="trialData">{option.trialid}</b>
            </p>
          </Col>

          <Col md={3} lg={3}>
            <p className="plot">
              Plot : <b className="plotData">{option.plot}</b>
            </p>
          </Col>

          <Col className="selectAll" md={3} lg={3}>
            <Checkbox
              className="selecteBox"
              indeterminate={indeterminate}
              checked={checked}
              onChange={handleCheckAll}
            />
            <p className="selectDesc">Select All</p>
          </Col>

          <Col xsOffset={11} md={4} lg={4}>
            <Button
              className="qrPrintButton"
              appearance="primary"
              disabled={disabled}
              onClick={handlePrint}
            >
              Print QR Code
            </Button>
          </Col>
        </Row>
      </Grid>

      <Row>
        {qrData.map(data => {
          function ZoomInQRCode(value) {
            console.log(value)
            setZoomInQR(true)
          }
          return (
            <Col className="QRCodeLayout" md={4} lg={4}>
              <Panel shaded className="QrCodePanel">
                <QRCode
                  size={113}
                  value={`{trialid: "${data.trialid}", plot: "${data.plot}", estateblock: "${data.estateblock}", palmno: "${data.palmno}"}`}
                  onClick={(e, value) => ZoomInQRCode(value)}
                  renderAs="svg"
                />
              </Panel>

              <div className="selectPalmLayout">
                <CheckCell
                  className="selectPalm"
                  data={data} //Primary key of table
                  checkedKeys={checkStatus}
                  onChange={handleCheck}
                />
                <p className="palm">
                  Palm :{" "}
                  <b className="palmData" ref={handleValue} value={data.palmno}>
                    {data.palmno}
                  </b>
                </p>
              </div>
            </Col>
          )
        })}
      </Row>
    </div>
  )
}

export default GenerationQRCode
