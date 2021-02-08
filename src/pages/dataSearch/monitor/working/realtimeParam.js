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
}))
class realtimeParam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DGIMN: ""
    };
  }

  componentDidMount() {

  }

  render() {
    const { DGIMN, entName } = this.state;
    return (
      <>
        <NavigationTree domId="working" onItemClick={(value, item) => {
          this.setState({
            DGIMN: value[0].key,
            entName:  `${value[0].entName} - ${value[0].pointName}`
          })
        }} />
        <BreadcrumbWrapper extraName={entName} id="working">
          <Card>
                {
                  DGIMN ? <Params DGIMN={DGIMN} /> : <PageLoading />
                }
        
          </Card>
        </BreadcrumbWrapper>
      </>
    );
  }
}

export default realtimeParam;
