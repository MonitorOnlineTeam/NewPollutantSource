import React, { PureComponent } from 'react';
import { AlertTwoTone } from '@ant-design/icons';
import { Card, List, Tag, Button, Popconfirm } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './ExceptionAlarm.less';
import UrgentDispatch from './UrgentDispatch';
import PdButton from './PdButton';

@connect(({ loading, workbenchmodel }) => ({
  loadingExceptionAlarm: loading.effects['workbenchmodel/getExceptionAlarmData'],
  exceptionAlarm: workbenchmodel.exceptionAlarm,
}))
class ExceptionAlarm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pdvisible: false,
      selectpoint: null,
    };
  }

  componentDidMount() {
    const { DGIMN } = this.props;
    this.reload(DGIMN);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.DGIMN && this.props.DGIMN != nextProps.DGIMN) {
      this.reload(nextProps.DGIMN);
    }
  }

  reload = DGIMN => {
    const { dispatch, Types, firsttime, lasttime } = this.props;
    let { exceptionAlarm } = this.props;
    if (Types !== '1') {
      exceptionAlarm = {
        ...exceptionAlarm,
        beginTime: moment(new Date())
          .add(-1, 'month')
          .format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      };
      dispatch({
        type: 'workbenchmodel/updateState',
        payload: {
          exceptionAlarm,
        },
      });
    } else {
      exceptionAlarm = {
        ...exceptionAlarm,
        beginTime: firsttime,
        endTime: lasttime,
      };
      dispatch({
        type: 'workbenchmodel/updateState',
        payload: {
          exceptionAlarm,
        },
      });
    }
    dispatch({
      type: 'workbenchmodel/getExceptionAlarmData',
      payload: {
        DGIMN,
        Type: Types,
      },
    });
  };

  /**
   * 智能质控_渲染异常报警数据列表
   */
  renderExceptionAlarmList = () => {
    let listData = [];
    const { exceptionAlarm } = this.props;
    const colorArray = {
      数据超标: 'red',
      超标预警: 'blue',
      数据异常: 'gold',
      参数异常: 'yellow',
      逻辑异常: 'volcano',
      状态异常: 'orange',
    };
    if (exceptionAlarm.tableDatas && exceptionAlarm.tableDatas[0]) {
      listData = exceptionAlarm.tableDatas[0].AlarmMsg.map((item, key) => {
        // 判断报警是否超过4小时
        const seconds = moment().diff(moment(item.FirstTime), 'minutes');
        const hour = Math.floor(seconds / 60);
        const minutes = Math.floor(seconds % 60);
        const color = hour >= 4 ? 'red' : 'rgb(129,203,237)';
        const minutesLable = minutes > 0 ? `${minutes}分钟` : '';

        const labelDiv = (
          <div style={{ color: `${color}` }}>
            已发生{hour}小时{minutesLable}
          </div>
        );
        // 未响应，按钮是派单;响应了超过4个小时是督办
        // if (hour >= 4 || item.State == '0') {
        // }

        return {
          // href: 'http://ant.design',
          key,
          // title: `${item.PointName}`,
          avatar: <AlertTwoTone />,
          description: (
            <div>
              <div>
                {<Tag color={`${colorArray[item.AlarmTypeText]}`}>{item.AlarmTypeText}</Tag>}
              </div>
              <div style={{ marginTop: 10 }}>
                <div>{item.AlarmMsg}</div>
              </div>
            </div>
          ),
          content: '',
          extra: (
            <div style={{ marginTop: 30, marginRight: 70, textAlign: 'center' }}>{labelDiv}</div>
          ),
        };
      });
    }

    return (
      <List
        itemLayout="vertical"
        dataSource={listData}
        size="large"
        pagination={{
          pageSize: exceptionAlarm.pageSize,
        }}
        renderItem={(item, key) => (
          <List.Item key={key} actions={[]} extra={item.extra}>
            <List.Item.Meta
              title={<a href={item.href}>{item.title}</a>}
              description={item.description}
            />
            {item.content}
          </List.Item>
        )}
      />
    );
  };

  render() {
    const { selectpoint } = this.state;
    return (
      <div style={{ maxHeight: '70vh' }}>
        <Card bodyStyle={{ paddingTop: 0, paddingBottom: 0, marginBottom: 10 }} bordered={false}>
          <PdButton DGIMN={this.props.DGIMN} reloadData={() => this.reload()} />
        </Card>
        <Card
          style={{ marginBottom: 10, maxHeight: '65vh', overflowY: 'auto' }}
          bordered={false}
          className={styles.exceptionAlarm}
          loading={this.props.loadingExceptionAlarm}
        >
          {this.renderExceptionAlarmList()}
        </Card>
      </div>
    );
  }
}

export default ExceptionAlarm;
