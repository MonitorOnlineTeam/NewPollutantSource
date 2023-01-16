import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Space, Button, DatePicker, Select } from 'antd';
import FacilityCard from './FacilityCard'
import PointDataChart from './PointDataChart'
import moment from 'moment';

const { RangePicker } = DatePicker;

@connect(({ loading, EPAndProduction, }) => ({
  startTime: EPAndProduction.startTime,
  endTime: EPAndProduction.endTime,
  selectListData: EPAndProduction.selectListData,
}))
class PageContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      startTime: moment().startOf('day'),
      endTime: moment(),
    };
  }

  componentDidMount() {
    this.initPageData();
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'EPAndProduction/updateState',
      payload: {
        startTime: moment().startOf('day'),
        endTime: moment(),
      }
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.DGIMN !== prevProps.DGIMN) {
      this.initPageData();
    }
  }

  // 初始化页面数据
  initPageData = () => {
    this.getFacByPoint();
  }

  // 根基点位查询治理设施和生产设施
  getFacByPoint = () => {
    this.props.dispatch({
      type: 'EPAndProduction/GetFacByPoint',
      payload: {
        DGIMN: this.props.DGIMN
      }
    })
  }

  onChange = (value, dateString) => {
    this.setState({
      startTime: value[0],
      endTime: value[1]
    })
  };

  onSearch = () => {
    const { startTime, endTime } = this.state;
    this.props.dispatch({
      type: 'EPAndProduction/updateState',
      payload: {
        startTime, endTime
      }
    })
  }

  render() {
    const { selectListData, DGIMN } = this.props;
    const { startTime, endTime } = this.state;
    return <>
      <Row>
        <Space>
          <RangePicker
            value={[startTime, endTime]}
            showTime={{
              format: 'HH:mm',
            }}
            format="YYYY-MM-DD HH:mm"
            onChange={this.onChange}
          />
          <Button type="primary" onClick={this.onSearch}>查询</Button>
        </Space>
      </Row>

      <PointDataChart title="环保点位数据曲线" DGIMN={DGIMN} bodyStyle={{ height: 410 }} />
      <FacilityCard title="治理设施数据曲线" selectListData={selectListData.dus} type="dus" />
      <FacilityCard title="生产设施数据曲线" selectListData={selectListData.pro} type="pro" />
    </>
  }
}

export default PageContent;