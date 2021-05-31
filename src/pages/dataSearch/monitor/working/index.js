import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { Card, Tabs } from "antd";
import FlowChart from './component/FlowChart'
import Params from "./component/Params"
import { connect } from 'dva';
import NavigationTree from '@/components/NavigationTree'
import PageLoading from '@/components/PageLoading'


const { TabPane } = Tabs;
@connect(({ loading, working }) => ({
  // getVisualizationChartList
}))
class working extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DGIMN: ""
    };
  }
  changeDgimn = (value, selectItem) => {
    this.setState({
      DGIMN: value[0].key,
      entName:  `${value[0].entName} - ${value[0].pointName}`
    })
  }
  componentDidMount() {

  }

  render() {
    const { DGIMN, entName } = this.state;
    return (
      <>
        <NavigationTree domId="working" onItemClick={(value, selectItem) => { this.changeDgimn(value, selectItem) }} />
        <div  id="working">
        <BreadcrumbWrapper  titles={`【${entName}】`}>
          <Card>
            <Tabs type="card">
              <TabPane tab="数据可视化" key="1">
                {DGIMN ? <FlowChart DGIMN={DGIMN} /> : <PageLoading />}
              </TabPane>
              <TabPane tab="系统参数" key="2">
                {
                  DGIMN ? <Params DGIMN={DGIMN} /> : <PageLoading />
                }
              </TabPane>
            </Tabs>
          </Card>
        </BreadcrumbWrapper>
        </div>
      </>
    );
  }
}

export default working;
