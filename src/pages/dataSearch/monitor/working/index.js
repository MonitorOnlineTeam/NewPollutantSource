import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { Card, Tabs } from "antd";
import FlowChart from './component/FlowChart'
import Params from "./component/Params"
import { connect } from 'dva';



const { TabPane } = Tabs;
@connect(({ loading, working }) => ({
  value: working.value,
}))
class working extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
   
  }
  
  render() {
    return (
      <BreadcrumbWrapper>
        <Card>
          <Tabs type="card">
            <TabPane tab="工艺流程图" key="1">
              <FlowChart />
            </TabPane>
            <TabPane tab="工况参数" key="2">
              <Params />
            </TabPane>
          </Tabs>
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default working;