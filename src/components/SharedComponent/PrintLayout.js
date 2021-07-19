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
                  value={`${data.trialId}-${data.plotId}-${data.estateblockId}-${data.palmId}`}
                  size={283.5}
                />
                <div className="descLayout">
                  <p className="trialId">
                    Trial ID : <b className="data">Trial {data.trialId}</b>
                  </p>
                  <p className="plotId">
                    Plot ID : <b className="data">{data.plot}</b>
                  </p>
                  <p className="palmNumber">
                    Palm ID : <b className="data">Palm {data.palmno}</b>
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
