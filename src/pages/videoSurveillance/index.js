import React, { PureComponent } from 'react';
import { Card, DatePicker, Button, Row, Select,Table,Tabs,Col } from "antd"
import Preview from "./Preview"
import Playback from "./Playback"
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import moment from 'moment';
import { connect } from 'dva';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select

const pageUrl = {
  updateState: 'videoSurveillance/updateState',
  getData: 'videoSurveillance/getDefectModel',
};
@connect(({ loading, videoSurveillance,}) => ({
  realLoading: loading.effects['videoSurveillance/GetAlarmVerifyRate'],
  historyLoading:loading.effects['videoSurveillance/GetAlarmVerifyRateDetail'],
  realTimePollData: videoSurveillance.realTimePollData,
  historyPollData: videoSurveillance.realTimePollData,
}))
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      playMode: 'realtime',
      date: [],
    };
    this.columns = [
      {
        title: '污染物名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '浓度',
        dataIndex: 'value',
        key: 'value',
      },
    ];
  }
  componentDidMount() {
    this.initData();
  }
  initData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: pageUrl.getData,
      // payload: { ...queryPar },
    });
  };



  onBack = () => {
    const { date } = this.state;
    console.log("this.playback=", this.playback)
    console.log(moment(date[0]).format('YYYY-MM-DD HH:mm:ss'))
    // this.playback.onBackPlay("18507478f7cf4c2883a75c030d59b847", date[0], date[1])
  }
  videoCallback=(key)=>{
   
  }
  render() {
    const { playMode } = this.state;
    const { realLoading, historyLoading, realTimePollData,historyPollData } = this.props;
    return (
      <BreadcrumbWrapper>
      <Card>
        <Tabs onChange={this.videoCallback} type="card">
            <TabPane tab="实时视频" key="realTimeVideo">
                   <Row style={{paddingTop:10}}>
                    <Col span={18}>
                    <Preview  cameraIndexCode={'18507478f7cf4c2883a75c030d59b847'} style={{marginTop: 300}} />
                    </Col> 
                    <Col span={6}>
                    <Table size="small" dataSource={realTimePollData} columns={this.columns} />
                    </Col>
                    </Row>
                    
               </TabPane>
                
                  <TabPane tab="视频回放" key="backVideo">
                  <Row style={{paddingTop:10}}>
                    <Col span={18}>
                    <div>
                  <RangePicker
                   showTime
                   onChange={(date) => {
                  this.setState({
                    date: date
                  })
                }}
              />
              <Button type="primary" style={{marginLeft:10}} onClick={() => {
                this.onBack()
              }}>回放</Button>
              </div>
                   <Playback ref={playback => this.playback = playback} style={{marginTop: 300}} />
                   </Col> 
                    <Col span={6}>
                    <Table size="small" dataSource={realTimePollData} columns={this.columns} />
                    </Col>
                    </Row>
               </TabPane>
              
             </Tabs>
      </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default index;