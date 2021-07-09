import React, { useState, useEffect, useRef } from "react"
import QRCode from "qrcode.react"
import PlotService from "../../services/plot.service"
import { useReactToPrint } from "react-to-print"
import { PrintLayout } from "../SharedComponent/PrintLayout"
import { Panel, Grid, Row, Col, Button, Checkbox, Modal } from "rsuite"

const GenerationQRCode = ({ option }) => {
  const [qrData, setQrData] = useState([])
  const [zoomInQR, setZoomInQR] = useState(false)
  const [zoomInData, setZoomInData] = useState("")
  const [checkStatus, setCheckStatus] = useState([])

  useEffect(() => {
    async function fetchData() {
      const data = await PlotService.getQrCodeDataList(option.plotId)
      setQrData(data)
    }
    fetchData()
  }, [])

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
    const keys = checkedAllItem ? qrData.map(item => item) : []
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

  const handlePrint = useReactToPrint({
    content: () => printRef.current
  })

  const pageStyle = `
  @page {
    size: 80mm 50mm;
    margin: 0px;
  }

  @media all {
    .pagebreak {
      display: none;
    }
  }

  @media print {
    margin: 0px;
    .pagebreak {
      page-break-before: always;
    }
  }
`

  return (
    <div id="GenerationQRCode">
      <Modal
        id="QrCodeModal"
        size="xs"
        show={zoomInQR}
        onHide={() => setZoomInQR(false)}
      >
        <Modal.Body>
          <QRCode
            className="QRCode"
            size={290}
            value="HIHI"
            value={`${zoomInData.trialId}\ ${zoomInData.plot}\ ${zoomInData.estateBlock}\ ${zoomInData.palmNo}`}
          />
          <p className="palm">
            Plam : <b className="palmData">{zoomInData.palmNo}</b>
          </p>
        </Modal.Body>
      </Modal>

      <div style={{ overflow: "hidden", height: "0" }}>
        <PrintLayout
          pageStyle={pageStyle}
          ref={printRef}
          selectedItem={checkStatus}
          data={qrData}
        />
      </div>

      <Grid className="qrFunctionSetting" fluid>
        <Row>
          <Col md={3} lg={3}>
            <p className="trial">
              Trial ID : <b className="trialData">{option.trialCode}</b>
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
          function ZoomInQRCode(trialId, plot, estateBlock, palmNo) {
            var Info = {
              trialId: trialId,
              plot: plot,
              estateBlock: estateBlock,
              palmNo: palmNo
            }

            console.log(Info)
            setZoomInQR(true)
            setZoomInData(Info)
          }
          return (
            <div>
              <Col className="QRCodeLayout" md={4} lg={4}>
                <Panel shaded className="QrCodePanel">
                  <QRCode
                    size={113}
                    value={`${data.trialId}\ ${data.plot}\ ${data.estateblock}\ ${data.palmno}`}
                    onClick={() =>
                      ZoomInQRCode(
                        data.trialId,
                        data.plot,
                        data.estateblock,
                        data.palmno
                      )
                    }
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
                    Palm :<b className="palmData">{data.palmno}</b>
                  </p>
                </div>
              </Col>
            </div>
          )
        })}
      </Row>
    </div>
  )
}

export default GenerationQRCode