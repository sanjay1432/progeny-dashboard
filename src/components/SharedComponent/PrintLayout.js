import React, { PureComponent } from "react"
import QRCode from "qrcode.react"

export class PrintLayout extends PureComponent {
  render() {
    const selectedItem = this.props.selectedItem
    console.log(selectedItem)
    return (
      <div id="PrintLayout">
        {selectedItem.map(data => {
          return (
            <div className="block">
              <div className="QRCodeLayout">
                <QRCode
                  value={`${data.trialId}-${data.plot}-${data.estateblock}-${data.palmno}`}
                  size={283.5}
                />
                <div className="descLayout">
                  <p className="trialId">
                    Trial ID : <b>Trial {data.trialId}</b>
                  </p>
                  <p className="plotId">
                    Plot No : <b>{data.plot}</b>
                  </p>
                  <p className="palmNumber">
                    Palm Number : <b>Palm {data.palmno}</b>
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}
