import React, { PureComponent } from 'react';
import { Card, DatePicker, Row, Button, message } from 'antd'
import ZHUANJIA from './components/ZHUANJIA'
import YUAN from './components/YUAN'
import { connect } from 'dva'
import moment from 'moment';
import { RollbackOutlined } from '@ant-design/icons';

@connect()
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ZHUANJIADataSource: [],
      StartPlanTime: undefined,
    };
    this._SELF_ = {
      AlarmInfoCode: this.props.history.location.query.code,
    }
  }

  componentDidMount() {
    this.getPlanTime();
  }


  // 获取启动预案时间
  getPlanTime = () => {
    this.props.dispatch({
      type: "emergency/getDutyOne",
      payload: {},
      callback: (res) => {
        this.setState({
          StartPlanTime: res.StartPlanTime
        })
      }
    })
  }

  // 启动预案
  startPlan = () => {
    let StartPlanTime = this.state.StartPlanTime
    if (!StartPlanTime) {
      message.error("请选择启动预案时间！");
      return;;
    }
    this.props.dispatch({
      type: "emergency/startPlan",
      payload: {
        AlarmInfoCode: this._SELF_.AlarmInfoCode,
        StartPlanTime: moment(this.state.StartPlanTime).format('YYYY-MM-DD HH:mm:ss')
      }
    })
  }

  render() {
    const { ZHUANJIAColumns, AlarmInfoCode } = this._SELF_;
    const { ZHUANJIADataSource, StartPlanTime } = this.state;
    return (
      <Card title="预案信息" extra={<Button icon={<RollbackOutlined />} onClick={() => history.go(-1)}>返回</Button>}>
        <Card bodyStyle={{ padding: 10 }}>
          <span className="label">启动预案时间：</span>
          <DatePicker showTime value={StartPlanTime ? moment(StartPlanTime) : undefined} onChange={date => {
            this.setState({ StartPlanTime: date })
          }} />
          <Button type="primary" style={{ float: 'right' }} onClick={this.startPlan}>启动预案</Button>
        </Card>
        <YUAN AlarmInfoCode={AlarmInfoCode} />
        <ZHUANJIA AlarmInfoCode={AlarmInfoCode} />
      </Card>
    );
  }
}

export default index;