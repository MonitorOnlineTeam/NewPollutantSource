import React, { PureComponent } from 'react';
import { Spin, Tag, Menu, Icon, Avatar, Tooltip, Popover, Button, Modal } from 'antd';
import { connect } from 'dva';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import SelectLang from '../SelectLang';
import styles from './index.less';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import NoticeIcon from '../NoticeIcon';
import { asc } from '../../utils/utils';
import AlarmRecord from '../../pages/monitoring/alarmrecord/components/AlarmRecord';
import RecordEchartTable from '@/components/recordEchartTable'
import RealTimeWarning from '../RealTimeWarning/RealTimeWarning';
import ExceptionAlarm from '../ExceptionAlarm/ExceptionAlarm';
import RecordEchartTableOver from '@/components/recordEchartTableOver'
import RealTimeWarningModal from '@/components/RealTimeWarning/RealTimeWarningModal';

@connect(({ loading, global }) => ({
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,//数据要用固定格式
  currentUserNoticeCnt: global.currentUserNoticeCnt,
}))

/**
 * 功  能：头部右侧报警消息和用户信息页面
 * 创建人：
 * 修改人：dongxiaoyun
 * 创建时间：2019.08.9
 */

export default class GlobalHeaderRight extends PureComponent {
  constructor(props) {
    super(props);
    const _this = this;
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/fetchNotices',
      payload: {},
    });
  }

  //格式化添加标签和标识icon
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length !== 0) {
      //排序
      const noticesAsc = notices.sort(asc);
      const newNotices = noticesAsc.map(notice => {
        const newNotice = { ...notice };
        //消息右侧异常类型
        if (newNotice.exceptiontypes) {
          const exceptiontypes = newNotice.exceptiontypes.split(',');
          const color = {
            warn: 'blue',
            over: 'red',
            exception: 'gold',
          }[newNotice.sontype];
          newNotice.extra = exceptiontypes.map(item => (
            <Tag key={`${newNotice.key}${item}`} color={color} style={{ marginRight: 0 }}>
              {item}
            </Tag>
          ));
        }
        //左侧图标
        if (!newNotice.avatar) {
          if (newNotice.sontype === 'over') {
            newNotice.avatar = (
              <Avatar style={{ verticalAlign: 'middle' }} src="/over.png">
              </Avatar>

            );
          } else if (newNotice.sontype === 'warn') {
            newNotice.avatar = (
              <Avatar style={{ verticalAlign: 'middle' }} src="/earlywarning.png">
              </Avatar>
            );
          } else if (newNotice.sontype === 'exception') {
            newNotice.avatar = (
              <Avatar style={{ verticalAlign: 'middle' }} src="/exception.png">
              </Avatar>
            );
          }
        }
        return newNotice;
      });
      return groupBy(newNotices, 'type');
    }
    else {
      return {};
    }
  }

  //报警总次数
  getUnreadData = advisesData => {
    const unreadMsg = {};
    Object.entries(advisesData).forEach(([key, value]) => {
      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }
      if (Array.isArray(value)) {
        const arr = value;
        let result = 0;
        arr.forEach(element => {
          if (element.alarmcount) result += element.alarmcount;
          else result += 1;
        });
        unreadMsg[key] = result;
      }
    });
    return unreadMsg;
  };

  // 取消Model
  onCancel = () => {
    this.setState({
      visible: false,
    });
  }

  render() {
    const { fetchingNotices, currentUserNoticeCnt, dispatch, } = this.props;
    const noticeData = this.getNoticeData();
    const unreadMsg = this.getUnreadData(noticeData);
    let className = styles.right;

    return (
      <div className={`${styles.action} ${styles.account}`}>
        <NoticeIcon
          count={currentUserNoticeCnt.unreadCount}
          onItemClick={(item, tabProps) => {
            this.setState({
              visible: true,
              // firsttime: moment(moment().format('YYYY-MM-DD 00:00:00')),
              // lasttime: moment(moment().format('YYYY-MM-DD 23:59:59')),
              DGIMN: item.DGIMN,
              pointname: item.pointname,
            });
            // 报警
            if (item.type === 'alarm') {
              switch (item.sontype) {
                case 'warn':
                  this.setState({
                    title: '实时预警-' + item.pointname,
                    flag: 'warn',
                  });
                  break;
                case 'over':
                  this.setState({
                    title: '超标记录-' + item.pointname,
                    flag: 'over',
                  });
                  break;
                case 'exception':
                  this.setState({
                    title: '异常报警-' + item.pointname,
                    flag: 'exception',
                  });
                  break;
              }
            }
          }}
          loading={fetchingNotices}
        >
          <NoticeIcon.Tab
            count={unreadMsg.alarm}
            list={noticeData.alarm}
            title={formatMessage({ id: 'component.globalHeader.notification' })}
            name="alarm"
            // emptyText={formatMessage({ id: 'component.globalHeader.notification.empty' })}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
          />
        </NoticeIcon>
        <Modal
          destroyOnClose="true"
          visible={this.state.visible}
          title={this.state.title}
          width="70%"
          footer={null}
          onCancel={this.onCancel}
        >
          {
            this.state.flag === 'over' ?
              <RecordEchartTableOver
                initLoadData
                style={{ maxHeight: '70vh' }}
                DGIMN={this.state.DGIMN}
                firsttime={moment(moment().format('YYYY-MM-DD 00:00:00'))}
                lasttime={moment(moment().format('YYYY-MM-DD 23:59:59'))}
                noticeState={0}
                maxHeight={200}
              />
              : this.state.flag === 'exception' ?
                <ExceptionAlarm
                  initLoadData DGIMN={this.state.DGIMN} />
                :
                <RealTimeWarningModal
                  style={{ maxHeight: '70vh' }}
                  DGIMN={this.state.DGIMN}
                  firsttime={moment(moment().format('YYYY-MM-DD 00:00:00'))}
                  lasttime={moment(moment().format('YYYY-MM-DD 23:59:59'))}
                />
          }
        </Modal>
      </div>
    );
  }
}
