import React, { useEffect, useState, useCallback } from "react"
import FilterCollapsible from "../../shared/FilterCollapsible"
import { CardBody, Card } from "reactstrap"
import KPICategory from "./KPICategory"
import axios from "axios"
import { CANCEL_REQUEST } from "../../../constants/index"
import LostcookService from "../../../services/lostcook.service"
import { Alert, Loader } from "rsuite"

const ProcessLineContainer = ({ fiberlineId, selectedDate }) => {
  const [categories, setCategories] = useState(null)
  const [fiberlineName, setfiberlineName] = useState("")

  const fetchData = useCallback(
    source => {
      LostcookService.getFiberlineData(
        { fiberlineId, displayAsDate: selectedDate },
        source
      ).then(
        data => {
          setfiberlineName(data.fiberlineName)
          setCategories(data.categories)
        },
        error => {
          if (error && error.message !== CANCEL_REQUEST) {
            Alert.error("We got an unknown error.", 5000)
          }
          console.log(error)
          return Promise.reject()
        }
      )
    },
    [selectedDate, fiberlineId]
  )

  useEffect(() => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    fetchData(source)
    return () => {
      source.cancel(CANCEL_REQUEST)
    }
  }, [fetchData])

  return (
    <>
      {fiberlineName && (
        <FilterCollapsible header={fiberlineName}>
          <Card>
            <CardBody>
              {categories && (
                <div className="lostcook-process-lines">
                  {categories ? (
                    categories.map((item, index) => {
                      return (
                        <KPICategory
                          key={index}
                          cards={item.cards}
                          categoryName={item.categoryName}
                        />
                      )
                    })
                  ) : (
                    <Loader center content="Loading" />
                  )}
                  {categories && categories.length === 0 && (
                    <p className="text-bold color-heading">No data found</p>
                  )}
                </div>
              )}
            </CardBody>
          </Card>
        </FilterCollapsible>
      )}
    </>
  )
}

export default ProcessLineContainer
