import React, { useRef, useEffect, useState } from "react";
import BarChart from "../../components/BarChart";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function ChartView() {
  const data1: Data[] = [
    { label: "Apples", value: 100 },
    { label: "Aples", value: 100 },
    { label: "Appes", value: 100 },
    { label: "Apple", value: 100 },
    { label: "Bananas", value: 200 },
    { label: "Oranges", value: 50 },
    { label: "Kiwis", value: 150 },
    { label: "Kiwi", value: 150 },
  ];
  const data2: Data[] = [
    { label: "Apples", value: 100 },
    { label: "Bananas", value: 200 },
    { label: "Oranges", value: 50 },
    { label: "Kiwis", value: 150 },
    { label: "Kiwi", value: 150 },
  ];
  const data3: Data[] = [
    { label: "Apples", value: 100 },
    { label: "Oranges", value: 50 },
    { label: "Kiwi", value: 150 },
  ];
  return (
    <Container>
      <Row>
        <Col sm>
          <BarChart data={data1} />
        </Col>
        <Col sm>
          <BarChart data={data2} />
        </Col>
        <Col sm>
          <BarChart data={data3} />
        </Col>
      </Row>
    </Container>
  );
}

export default ChartView;
