import React from "react"
import { Container, Row, Col } from "reactstrap"
import SearchFilter from "./SearchFilter"
import Table from "./Table"
const TabPanel = ({ currentSubNavState, ...props }) => {
  console.log(currentSubNavState)
  return (
    <>
      <main>
        <section>
          <Container fluid>
            <Row className="justify-content-center">
              <Col lg="12">
                <div className="d-flex justify-content-center empty">
                  <h2 className="text-heading text-base-font text-bold text-center">
                    <SearchFilter currentSubNavState={currentSubNavState} />
                    <Table currentSubNavState={currentSubNavState} />
                  </h2>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    </>
  )
}

export default TabPanel
