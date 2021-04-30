import React from "react"
import { Container, Row, Col } from "reactstrap"

const SearchFilter = ({ currentSubNavState, ...props }) => {
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
                    Search Filter
                    {currentSubNavState.active}
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

export default SearchFilter
