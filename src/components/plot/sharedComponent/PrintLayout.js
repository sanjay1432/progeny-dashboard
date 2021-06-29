import React, { PureComponent } from "react"
import QRCode from "qrcode.react"

export class PrintLayout extends PureComponent {
  render() {
    const data = this.props.data

    console.log(data)
    if (this.props.data.length < 2) {
      return (
        <div id="PrintLayout">
          <div className="singleLayout">
            <div className="qrLayout">
              <QRCode value="hihi" size={900} renderAs="svg" />
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div id="PrintLayout">
          <div className="multiLayout">
            {this.props.data.map(data => {
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
