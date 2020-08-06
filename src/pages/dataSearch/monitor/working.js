import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { Card } from "antd"

class working extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <BreadcrumbWrapper>
        <Card>
          12312312312
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default working;