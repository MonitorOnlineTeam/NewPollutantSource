import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { Card, Tabs } from "antd";
import FlowChart from './component/FlowChart'
import Params from "./component/Params"
import { connect } from 'dva';
import NavigationTree from '@/components/NavigationTree'
import PageLoading from '@/components/PageLoading'
import FlowChart_Carbon from './component/FlowChart_Carbon';

const { TabPane } = Tabs;
@connect(({ loading, common }) => ({
  // getVisualizationChartList
  pollutantListByDgimn: common.pollutantListByDgimn,
  loading: loading.effects["common/getPollutantListByDgimn"],
}))
class working extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DGIMN: "",
      isCarbon: false
    };
  }

  componentDidMount() {

  }


  changeDgimn = (value, selectItem) => {
    this.setState({
      DGIMN: value[0].key,
      entName: `${value[0].entName} - ${value[0].pointName}`
    }, () => {
      this.getPollutantListByDgimn();
    })
  }

  // 获取污染物code
  getPollutantListByDgimn = () => {
    this.props.dispatch({
      type: "common/getPollutantListByDgimn",
      payload: {
        DGIMNs: this.state.DGIMN
      }
    }).then(() => {
      if (this.props.pollutantListByDgimn.find(item => item.PollutantName === '二氧化碳')) {
        this.setState({
          isCarbon: true
        })
      } else {
        this.setState({
          isCarbon: false
        })
      }
    })
  }

  render() {
    const { DGIMN, entName, isCarbon } = this.state;
    return (
      <>
        <NavigationTree domId="working" onItemClick={(value, selectItem) => { this.changeDgimn(value, selectItem) }} />
        <div id="working">
          <BreadcrumbWrapper>
            <Card loading={this.props.loading}>
              <Tabs type="card">
                {
                  isCarbon && <TabPane tab="数据可视化" key="1">
                    {DGIMN ? <FlowChart_Carbon DGIMN={DGIMN} /> : <PageLoading />}
                  </TabPane>
                }
                {
                  !isCarbon && <TabPane tab="数据可视化" key="1">
                    {DGIMN ? <FlowChart DGIMN={DGIMN} /> : <PageLoading />}
                  </TabPane>
                }
                {/* <TabPane tab="数据可视化" key="1">
                  {DGIMN ? <FlowChart DGIMN={DGIMN} /> : <PageLoading />}
                </TabPane> */}
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
