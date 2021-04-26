//import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import React, { useState, useEffect } from "react"
import OpenInNewRoundedIcon from "@material-ui/icons/OpenInNewRounded"
import DataTable from "../components/table/Table"
import { Table } from "rsuite"
const { Cell } = Table

const Estate = () => {
  const [data, setData] = useState([])

  const loadData = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts")
    setData(await res.json())
  }

  useEffect(() => {
    loadData()
    return () => {}
  }, [])

  const COLUMNS = [
    {
      name: "",
      dataKey: "id",
      customCell: CheckCell
    },
    {
      name: "Estate",
      dataKey: "id",
      width: 170
    },
    {
      name: "Estate Full Name",
      dataKey: "title",
      width: 170
    },
    {
      name: "Estate Address",
      dataKey: "content",
      width: 170
    },
    {
      name: "No of Estate Block",
      dataKey: "",
      width: 170
    },
    {
      name: "Action",
      dataKey: "id",
      customCell: ActionCell,
      width: 170
    }
  ]

  const CheckCell = ({ rowData, dataKey, ...props }) => (
    <Cell {...props}>
      <input type="checkbox" id="id" value={rowData[dataKey]} />
    </Cell>
  )

  const ActionCell = ({ rowData, dataKey, ...props }) => (
    <Cell {...props}>
      <OpenInNewRoundedIcon onClick={handleClick} />
    </Cell>
  )

  function handleClick({ rowData, dataKey }) {
    alert(rowData[dataKey])
  }

  return (
    <div style={{ width: 1024 }}>
      <DataTable columns={COLUMNS} data={data} />
    </div>
  )
}

export default Estate
