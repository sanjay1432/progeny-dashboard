import React from "react"
import { Container, Row, Col } from "reactstrap"

const Blank = () => {
  return (
    <>
      <main>
        <section>
          <Container fluid>
            <Row className="justify-content-center">
              <Col lg="12">
                <div className="d-flex justify-content-center empty">
                  <h2 className="text-heading text-base-font text-bold text-center">
                    To be determined in next release
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

export default Blank
