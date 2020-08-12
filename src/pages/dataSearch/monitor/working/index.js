import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { Card, Tabs } from "antd";
import FlowChart from './component/FlowChart'
import Params from "./component/Params"
import { connect } from 'dva';
import NavigationTree from '@/components/NavigationTreeNew'



const { TabPane } = Tabs;
@connect(({ loading, working }) => ({
}))
class working extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DGIMN: ""
    };
  }

  componentDidMount() {

  }

  render() {
    const { DGIMN } = this.state;
    return (
      <>
        <NavigationTree domId="working" onTreeSelect={(value) => {
          this.setState({
            DGIMN: value
          })
        }} />
        <BreadcrumbWrapper id="working">
          <Card>
            <Tabs type="card">
              <TabPane tab="工艺流程图" key="1">
                <FlowChart />
              </TabPane>
              <TabPane tab="工况参数" key="2">
                {
                  DGIMN && <Params DGIMN={DGIMN} />
                }
              </TabPane>
            </Tabs>
          </Card>
        </BreadcrumbWrapper>
      </>
    );
  }
}

export default working;