import React, { PureComponent } from "react"
import QRCode from "qrcode.react"

export class PrintLayout extends PureComponent {
  render() {
    const selectedItem = this.props.selectedItem
    const plot = this.props.plot
    return (
      <div id="PrintLayout">
        {selectedItem.map(data => {
          return (
            <div className="block">
              <div className="QRCodeLayout"> 
                <QRCode
                  value={`${plot.trialId}-${plot.plotId}-${plot.estateblockId}-${data.palmId}`}
                  size={283.5}
                />
                <div className="descLayout">
                  <p className="trialId">
                    Trial : <b className="data"> {plot.trial}</b>
                  </p>
                  <p className="plotId">
                    Plot ID : <b className="data">{plot.plot}</b>
                  </p>
                  <p className="palmNumber">
                    Palm ID : <b className="data"> {data.palmno}</b>
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
