import React, { useEffect, useState } from "react"
import FilterCollapsible from "../../shared/FilterCollapsible"
import { CardBody, Card } from "reactstrap"
import {
  Input,
  DatePicker,
  Icon,
  Button,
  InputPicker,
  Loader,
  InputNumber
} from "rsuite"
import _ from "lodash"
import { useDispatch, useSelector } from "react-redux"
import {
  setSaveNewProductList,
  setModifiedConfig,
  setSaveModifiedProductList
} from "redux/actions/lostcookSummaryToday.action"
const FiberlineEditor = ({ fiberlineData, defaultOpen }) => {
  const [fiberlineName, setFiberlineName] = useState("")
  const [fiberlineId, setFiberlineId] = useState("")
  const [products, setProducts] = useState(null)
  const [hasAdt, setHasAdt] = useState(false)
  const [newProducts, setNewProducts] = useState([])
  const [productTypes, setProductTypes] = useState(null)
  const dispatch = useDispatch()
  const saveModifiedProductList = useSelector(
    state => state.lostcookSummaryTodayReducer.saveModifiedProductList
  )
  const saveNewProductList = useSelector(
    state => state.lostcookSummaryTodayReducer.saveNewProductList
  )
  useEffect(() => {
    if (fiberlineData) {
      setNewProducts([])
      setFiberlineName(fiberlineData.fiberlineName)
      setProductTypes(fiberlineData.productTypes)
      setFiberlineId(fiberlineData.fiberlineId)
      setProducts(fiberlineData.products)
      setHasAdt(
        _.find(
          fiberlineData.products || [],
          product => product.adt !== undefined
        ) !== undefined
      )
    }
  }, [fiberlineData])

  const onEditProduct = (index, name, selected) => {
    let productsCloned = _.cloneDeep(products)
    productsCloned[index][name] = selected === "" ? 0 : selected
    productsCloned[index]["fiberlineId"] = fiberlineId
    setProducts(productsCloned)
    let modifiedProductsCloned = _.cloneDeep(saveModifiedProductList)
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
    dispatch(setSaveModifiedProductList(modifiedProductsCloned))
  }
  const onEditInNewProduct = (index, name, selected) => {
    let productsCloned = _.cloneDeep(newProducts)
    productsCloned[index][name] = selected
    setNewProducts(productsCloned)

    let newProductsCloned = _.cloneDeep(saveNewProductList)
    const indexInModifyList = _.findIndex(newProductsCloned, function (item) {
      return item.idTemp === productsCloned[index]["idTemp"]
    })
    if (indexInModifyList >= 0) {
      newProductsCloned[indexInModifyList] = productsCloned[index]
    } else {
      newProductsCloned.push(productsCloned[index])
    }

    dispatch(setSaveNewProductList(productsCloned))
  }
  const addNewProduct = () => {
    let productsCloned = _.cloneDeep(newProducts)
    let saveNewProductListCloned = _.cloneDeep(saveNewProductList)
    const item = {
      idTemp: Date.now(),
      productId: productTypes[0].productId,
      fiberlineId: fiberlineId,
      targetCook: 0,
      startDate: new Date(),
      endDate: new Date(),
      adt: hasAdt ? 0 : undefined
    }
    productsCloned.push(item)
    saveNewProductListCloned.push(item)
    setNewProducts(productsCloned)
    dispatch(setModifiedConfig(true))
    dispatch(setSaveNewProductList(saveNewProductListCloned))
  }

  const removeProduct = id => {
    console.log(newProducts)
    const newList = newProducts.filter(item => item.idTemp !== id)
    setNewProducts(newList)
    dispatch(setSaveNewProductList(newList))
  }

  return (
    <>
      {products && fiberlineName ? (
        <FilterCollapsible
          header={fiberlineName || ""}
          defaultOpen={defaultOpen}
        >
          <Card>
            <CardBody>
              {products ? (
                <div>
                  <div className="__new-row">
                    <h2 className="__new-col">Product</h2>
                    <h2 className="__new-col">Target Cook</h2>
                    <h2 className="__new-col">Start</h2>
                    <h2 className="__new-col">End</h2>
                    {products[0] && products[0].adt !== undefined ? (
                      <h2 className="__new-col">Adt Conversion Rate</h2>
                    ) : (
                      ""
                    )}
                  </div>
                  {products.map((product, index) => {
                    return (
                      <div key={index}>
                        <div className=" __new-row">
                          {product.productId !== undefined && (
                            <div className="__new-col">
                              <InputPicker
                                onChange={selected =>
                                  onEditProduct(index, "productId", selected)
                                }
                                value={product.productId}
                                defaultValue={product.productId}
                                data={productTypes}
                                cleanable={false}
                                valueKey="productId"
                                style={{ maxWidth: 400, width: 140 }}
                              />
                            </div>
                          )}
                          {product.targetCook !== undefined && (
                            <div className="__new-col">
                              <InputNumber
                                step={1}
                                value={product.targetCook}
                                onChange={selected =>
                                  onEditProduct(index, "targetCook", selected)
                                }
                              />
                            </div>
                          )}
                          {product.startDate !== undefined && (
                            <div className="__new-col">
                              <DatePicker
                                oneTap
                                style={{ width: "100%" }}
                                format="DD MMM YYYY"
                                cleanable={false}
                                value={new Date(product.startDate)}
                                onChange={selected =>
                                  onEditProduct(index, "startDate", selected)
                                }
                              />
                            </div>
                          )}
                          {product.endDate !== undefined && (
                            <div className="__new-col">
                              <DatePicker
                                oneTap
                                style={{ width: "100%" }}
                                format="DD MMM YYYY"
                                cleanable={false}
                                value={new Date(product.endDate)}
                                onChange={selected =>
                                  onEditProduct(index, "endDate", selected)
                                }
                              />
                            </div>
                          )}
                          {product.adt !== undefined && (
                            <div className="__new-col">
                              <InputNumber
                                value={product.adt}
                                step={1}
                                onChange={selected =>
                                  onEditProduct(index, "adt", selected)
                                }
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                  {newProducts &&
                    newProducts.map((product, index) => {
                      return (
                        <div key={index}>
                          <div className=" __new-row">
                            {product.productId !== undefined && (
                              <div className="__new-col">
                                <InputPicker
                                  onChange={selected =>
                                    onEditInNewProduct(
                                      index,
                                      "productId",
                                      selected
                                    )
                                  }
                                  value={product.productId}
                                  defaultValue={product.productId}
                                  data={productTypes}
                                  cleanable={false}
                                  valueKey="productId"
                                  style={{ maxWidth: 400, width: 150 }}
                                />
                              </div>
                            )}
                            {product.targetCook !== undefined && (
                              <div className="__new-col">
                                <Input
                                  maxLength={255}
                                  type="number"
                                  value={product.targetCook}
                                  onChange={selected =>
                                    onEditInNewProduct(
                                      index,
                                      "targetCook",
                                      selected
                                    )
                                  }
                                />
                              </div>
                            )}
                            {product.startDate !== undefined && (
                              <div className="__new-col">
                                <DatePicker
                                  oneTap
                                  style={{ width: "100%" }}
                                  format="DD MMM YYYY"
                                  cleanable={false}
                                  value={new Date(product.startDate)}
                                  onChange={selected =>
                                    onEditInNewProduct(
                                      index,
                                      "startDate",
                                      selected
                                    )
                                  }
                                />
                              </div>
                            )}
                            {product.endDate !== undefined && (
                              <div className="__new-col">
                                <DatePicker
                                  oneTap
                                  style={{ width: "100%" }}
                                  format="DD MMM YYYY"
                                  cleanable={false}
                                  value={new Date(product.endDate)}
                                  onChange={selected =>
                                    onEditInNewProduct(
                                      index,
                                      "endDate",
                                      selected
                                    )
                                  }
                                />
                              </div>
                            )}
                            {product.adt !== undefined && (
                              <div className="__new-col">
                                <InputNumber
                                  maxLength={255}
                                  type="number"
                                  value={product.adt}
                                  step={1}
                                  onChange={selected =>
                                    onEditInNewProduct(index, "adt", selected)
                                  }
                                />
                              </div>
                            )}
                            <div className="__new-col">
                              <Button
                                className="btn-color-danger"
                                onClick={() => removeProduct(product.idTemp)}
                              >
                                <Icon icon="trash" /> Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              ) : (
                ""
              )}
              <Button
                className="btn-color-primary mt-2"
                onClick={() => addNewProduct()}
              >
                <Icon icon="plus-square" /> Add new target
              </Button>
            </CardBody>
          </Card>
        </FilterCollapsible>
      ) : (
        <Loader center content="Loading" />
      )}
    </>
  )
}

export default FiberlineEditor
