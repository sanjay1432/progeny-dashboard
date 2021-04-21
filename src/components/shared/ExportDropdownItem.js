import React, { useState } from "react"
import { Dropdown, Icon } from "rsuite"
import * as FileSaver from "file-saver"
import * as XLSX from "xlsx"
import { FILE_TYPE } from "../../constants"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export const ExportDropdownItem = ({
  data,
  fileName,
  fileType,
  label = "Export",
  icon,
  columnLength = 1,
  subColumnNum = 1
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const exportToCSV = () => {
    setIsLoading(true)
    switch (fileType) {
      case FILE_TYPE.xls:
        const ws = XLSX.utils.json_to_sheet(data)
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] }
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
        FileSaver.saveAs(
          new Blob([excelBuffer], { type: fileType }),
          fileName + ".xlsx"
        )
        setIsLoading(false)
        break
      case FILE_TYPE.csv:
        FileSaver.saveAs(
          new Blob([data], { type: fileType }),
          fileName + ".csv"
        )
        setIsLoading(false)
        break
      case FILE_TYPE.pdf:
        const fileExtension = ".pdf"
        const htmlData = data
        let iframe = document.createElement("div")
        document.body.appendChild(iframe)
        setTimeout(function () {
          let iframedoc = iframe
          iframedoc.innerHTML = htmlData
          const width = 240 + columnLength * subColumnNum * 80 + 20 * 3.78
          const height = (width * 70.7) / 100
          html2canvas(iframedoc, {
            allowTaint: true,
            useCORS: true,
            logging: false,
            width: width,
            windowWidth: width
          }).then(canvas => {
            let pdf = new jsPDF({
              orientation: "landscape",
              unit: "mm",
              format: [width / 3.78, height / 3.78]
            })
            let imgData = canvas.toDataURL("image/png", 1.0)
            pdf.addImage(imgData, "PNG", 10, 10)
            pdf.save(fileName + fileExtension)
            document.body.removeChild(iframe)
            setIsLoading(false)
          })
        }, 10)
        break
      default:
        break
    }
  }

  return (
    <Dropdown.Item icon={<Icon icon={icon} />} onClick={() => exportToCSV()}>
      {label} {isLoading && <Icon icon="spinner" spin />}
    </Dropdown.Item>
  )
}
