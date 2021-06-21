import React from "react"
import QRCode from "qrcode.react"

const GenerationQRCode = ({ option }) => {
  return (
    <>
      <QRCode value="http://facebook.github.io/react/" />
    </>
  )
}

export default GenerationQRCode
