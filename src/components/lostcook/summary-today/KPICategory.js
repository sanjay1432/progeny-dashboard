import React, { useEffect } from "react"
import NumberCardLostcook from "../../shared/NumberCardLostcook"
import { Notification } from "rsuite"

const KPICategory = ({ categoryName, cards = [] }) => {
  useEffect(() => {
    if (cards) {
      cards.forEach((card, index) => {
        if (card.warning) {
          Notification.warning({
            key: index,
            title: "Lostcook Summary",
            duration: 5000,
            description: (
              <p>
                There are some warings in the Lostcook Summary, please help to
                check
              </p>
            )
          })
        }
      })
    }
  }, [cards])

  return (
    <>
      <div className="process-line-container">
        <h2>{categoryName}</h2>
        <div className="lostcook__numbers">
          {cards &&
            cards.map((item, index) => {
              return (
                <NumberCardLostcook
                  key={index}
                  title={item.title}
                  subTitle={item.subTitle}
                  estimateTarget={item.estimateTarget}
                  value={item.value}
                  desc={item.desc}
                  color={item.color}
                  hasAdt={item.hasAdt}
                  warning={item.warning}
                />
              )
            })}
          {cards && cards.length === 0 && (
            <p className="text-bold color-heading">No data found</p>
          )}
        </div>
      </div>
    </>
  )
}

export default KPICategory
