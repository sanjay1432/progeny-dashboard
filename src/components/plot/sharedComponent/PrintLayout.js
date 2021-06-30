import React, { PureComponent } from "react"
import QRCode from "qrcode.react"

export class PrintLayout extends PureComponent {
  render() {
    const selectedItem = this.props.selectedItem

    const data = this.props.data.filter(data => data.plot === selectedItem.plot)

    if (selectedItem.length < 2) {
      return (
        <div id="PrintLayout">
          <div className="singleLayout">
            {data.map(selectedItem => {
              return (
                <div className="qrLayout">
                  <QRCode value="hihi" size={370} renderAs="svg" />
                </div>
              )
            })}
          </div>
        </div>
      )
    } else {
      return (
        <div id="PrintLayout">
          <div className="multiLayout">
            {data.map(selectedItem => {
              return (
                <div className="qrLayout">
                  <QRCode value="hihi" size={370} renderAs="svg" />
                </div>
              )
            })}
          </div>
        </div>
      )
    }
  }
}
