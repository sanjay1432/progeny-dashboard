import React, { useEffect, useState } from "react"
import FilterCollapsible from "../../shared/FilterCollapsible"
import { CardBody, Card } from "reactstrap"
import { Input, InputNumber, Loader } from "rsuite"
import _ from "lodash"
import { useDispatch, useSelector } from "react-redux"
import {
  setModifiedConfig,
  setSaveModifiedSummaryCookList
} from "redux/actions/lostcookSummaryToday.action"
const FiberlineSummaryEditor = ({ fiberlineData }) => {
  const [fiberlineName, setFiberlineName] = useState("")
  const [fiberlineId, setFiberlineId] = useState("")
  const [products, setProducts] = useState(null)
  const [headers, setHeaders] = useState(null)
  const dispatch = useDispatch()
  const saveModifiedSummaryCookList = useSelector(
    state => state.lostcookSummaryTodayReducer.saveModifiedSummaryCookList
  )
  useEffect(() => {
    if (fiberlineData) {
      setFiberlineName(fiberlineData.fiberlineName)
      setFiberlineId(fiberlineData.fiberlineId)
      setProducts(fiberlineData.products)
      setHeaders(fiberlineData.headers)
    }
  }, [fiberlineData])

  const onEditProduct = (index, name, selected) => {
    let productsCloned = _.cloneDeep(products)
    productsCloned[index][name] = selected === "" ? 0 : selected
    productsCloned[index]["fiberlineId"] = fiberlineId
    setProducts(productsCloned)
    let modifiedProductsCloned = _.cloneDeep(saveModifiedSummaryCookList)
    const indexInModifyList = _.findIndex(
      modifiedProductsCloned,
      function (item) {
        return item.id === productsCloned[index]["id"]
      }
    )
    if (indexInModifyList >= 0) {
      modifiedProductsCloned[indexInModifyList] = productsCloned[index]
    } else {
      modifiedProductsCloned.push(productsCloned[index])
    }
    dispatch(setModifiedConfig(true))
    dispatch(setSaveModifiedSummaryCookList(modifiedProductsCloned))
  }

  return (
    <>
      {products && fiberlineName ? (
        <FilterCollapsible header={fiberlineName || ""} defaultOpen={false}>
          <Card>
            <CardBody>
              {products && headers ? (
                <div>
                  <div className="__new-row _header">
                    {headers.map((item, index) => {
                      return (
                        <h2 key={index} className="__new-col">
                          {item.name}
                        </h2>
                      )
                    })}
                  </div>
                  {products.map((product, productIndex) => {
                    return (
                      <div className=" __new-row" key={productIndex}>
                        {headers.map((item, index) => {
                          if (item.index === "productName") {
                            return (
                              <div key={index} className="__new-col">
                                <h2>{product[item.index]}</h2>
                              </div>
                            )
                          } else {
                            return (
                              <div key={index} className="__new-col">
                                <InputNumber
                                  type="number"
                                  disabled={
                                    item.index !== "morningShift" &&
                                    item.index !== "afternoonShift" &&
                                    item.index !== "nightShift"
                                  }
                                  value={product[item.index]}
                                  onChange={selected =>
                                    onEditProduct(
                                      productIndex,
                                      item.index,
                                      selected
                                    )
                                  }
                                />
                              </div>
                            )
                          }
                        })}
                      </div>
                    )
                  })}
                </div>
              ) : (
                ""
              )}
            </CardBody>
          </Card>
        </FilterCollapsible>
      ) : (
        <Loader center content="Loading" />
      )}
    </>
  )
}

export default FiberlineSummaryEditor
