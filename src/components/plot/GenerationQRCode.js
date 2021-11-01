import React, { useState, useEffect, useRef } from "react"
import QRCode from "qrcode.react"
import PlotService from "../../services/plot.service"
import { useReactToPrint } from "react-to-print"
import { PrintLayout } from "../SharedComponent/PrintLayout"
import { Panel, Grid, Row, Col, Button, Checkbox, Modal } from "rsuite"

const GenerationQRCode = ({ option }) => {
  const [qrData, setQrData] = useState([])
  const [plotInfo, setPlotInfo] = useState([])
  const [zoomInQR, setZoomInQR] = useState(false)
  const [zoomInData, setZoomInData] = useState("")
  const [checkStatus, setCheckStatus] = useState([])

  useEffect(() => {
    async function fetchData() {
      const data = await PlotService.getQrCodeDataList(option.plotId)
      setPlotInfo(data[0])
      setQrData(data[0].palms)
    }
    fetchData()
  }, [option.plotId])
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
            value={`${zoomInData.trialId}-${zoomInData.plotId}-${zoomInData.estateId}-${zoomInData.estateblockId}-${zoomInData.palmId}`}
          />
          <p className="palm">
            Palm : <b className="palmData">{zoomInData.palmNo}</b>
          </p>
        </Modal.Body>
      </Modal>

      <div style={{ overflow: "hidden", height: "0" }}>
        <PrintLayout
          ref={printRef}
          selectedItem={checkStatus}
          plot = {plotInfo}
          data={qrData}
        />
      </div>

      <Grid className="qrFunctionSetting" fluid>
        <Row>
          <Col md={3} lg={2}>
            <p className="trial">
              Trial ID : <b className="trialData">{option.trialCode}</b>
            </p>
          </Col>

          <Col md={4} lg={4}>
            <p className="trial">
              Trial : <b className="trialData">{option.trial}</b>
            </p>
          </Col>

          <Col md={3} lg={2}>
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

          <Col xsOffset={7} md={4} lg={6}>
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
      <div className="ContentLayout">
        {qrData.map((data, index) => {
          function ZoomInQRCode(trialId,plotId, estateId, estateblockId, palmId, palmNo) {
            var Info = {
              trialId: trialId,
              plotId: plotId,
              estateId: estateId,
              estateblockId: estateblockId,
              palmId:palmId,
              palmNo: palmNo
            }

            console.log(Info)
            setZoomInQR(true)
            setZoomInData(Info)
          }
          return (
            <div className="QrItemLayout" key={index}>
             
              <Panel shaded>
                <QRCode
                  size={113}
                  value={`${plotInfo.trialId}-${plotInfo.plotId}-${plotInfo.estateId}-${plotInfo.estateblockId}-${data.palmId}`}
                  onClick={() =>
                    ZoomInQRCode(
                      plotInfo.trialId,
                      plotInfo.plotId,
                      plotInfo.estateId,
                      plotInfo.estateblockId,
                      data.palmId,
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
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default GenerationQRCode
