import React, { PureComponent } from 'react';
import { Spin, Tag, Menu, Icon, Avatar, Tooltip, Popover, Button } from 'antd';
import { connect } from 'dva';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import SelectLang from '../SelectLang';
import styles from './index.less';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import NoticeIcon from '../NoticeIcon';
import { asc } from '../../utils/utils';
// import RealTimeWarningModal from '../../components/SpecialWorkbench/RealTimeWarningModal';
import AlarmRecordModal from './AlarmRecordModal';
// import EmergencyDetailInfoModal from './EmergencyDetailInfoModal';
import PdButton from '../../components/OverView/PdButton';

@connect(({ loading, global }) => ({
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
  currentUserNoticeCnt: global.currentUserNoticeCnt,
}))
export default class GlobalHeaderRight extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/fetchNotices',
    });
  }

  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const noticesAsc = notices.sort(asc);
    const newNotices = noticesAsc.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.exceptiontypes) {
        let exceptiontypes = newNotice.exceptiontypes.split(',');
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
      if (!newNotice.avatar) {
        if (newNotice.type === 'alarm') {
          if (newNotice.sontype === 'over') {
            newNotice.avatar = (
              <Avatar style={{ backgroundColor: 'red', verticalAlign: 'middle' }} size="large">
                超
              </Avatar>
            );
          } else if (newNotice.sontype === 'warn') {
            newNotice.avatar = (
              <Avatar style={{ backgroundColor: 'blue', verticalAlign: 'middle' }} size="large">
                预
              </Avatar>
            );
          } else if (newNotice.sontype === 'exception') {
            newNotice.avatar = (
              <Avatar style={{ backgroundColor: 'gold', verticalAlign: 'middle' }} size="large">
                异
              </Avatar>
            );
          }
        } else if (newNotice.type === 'advise') {
          newNotice.avatar = !newNotice.isview ? (
            <Avatar style={{ backgroundColor: 'red', verticalAlign: 'middle' }} size="large">
              通
            </Avatar>
          ) : (
            <Avatar style={{ backgroundColor: 'gray', verticalAlign: 'middle' }} size="large">
              通
            </Avatar>
          );
        }
      }
      //如果是异常特殊处理，让其点击弹出
      if (newNotice.sontype === 'exception') {
        newNotice.title = (
          <Popover
            trigger="click"
            content={
              <div>
                <PdButton sendpush={true} DGIMN={newNotice.DGIMN} viewType="datalist" />
              </div>
            }
          >
            <span style={{ cursor: 'pointer' }}>{newNotice.title}</span>
          </Popover>
        );
        newNotice.description = (
          <Popover
            trigger="click"
            content={
              <div>
                <PdButton sendpush={true} DGIMN={newNotice.DGIMN} viewType="datalist" />
              </div>
            }
          >
            <span style={{ cursor: 'pointer' }}>{newNotice.description}</span>
          </Popover>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  getUnreadData = advisesData => {
    const unreadMsg = {};
    Object.entries(advisesData).forEach(([key, value]) => {
      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }
      if (Array.isArray(value)) {
        if (key === 'advise') unreadMsg[key] = value.filter(item => !item.isview).length;
        else {
          const arr = value;
          let result = 0;
          arr.forEach(element => {
            if (element.alarmcount) result += element.alarmcount;
            else result += 1;
          });
          unreadMsg[key] = result;
        }
      }
    });
    return unreadMsg;
  };

  changeReadState = clickedItem => {
    const { id } = clickedItem;
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeNoticeReadState',
      payload: id,
    });
  };

  onRefWarning = ref => {
    this.childWarning = ref;
  };

  onRefAlarm = ref => {
    this.childAlarm = ref;
  };

  // onRefEmergencyDetailInfo = (ref) => {
  //   this.childEmergencyDetailInfo = ref;
  // }

  render() {
    const {
      fetchingNotices,
      currentUserNoticeCnt,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      theme,
      dispatch,
    } = this.props;
    const noticeData = this.getNoticeData();
    const unreadMsg = this.getUnreadData(noticeData);
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={`${styles.action} ${styles.account}`}>
        <NoticeIcon
          count={currentUserNoticeCnt.unreadCount}
          onItemClick={(item, tabProps) => {
            console.log(item, tabProps); // eslint-disable-line
            //报警
            if (item.type === 'alarm') {
              if (item.sontype === 'warn') {
                this.childAlarm.showModal(
                  item.firsttime,
                  item.lasttime,
                  item.DGIMN,
                  item.pointname,
                );
                // this.childWarning.showModal(item.pointname, item.DGIMN, item.overwarnings[0].PollutantCode, item.overwarnings[0].PollutantName, item.overwarnings[0].SuggestValue);
              } else if (item.sontype === 'over') {
                // dispatch(routerRedux.push(`/pointdetail/${item.DGIMN}/alarmrecord/alarmrecord`));
                this.childAlarm.showModal(
                  item.firsttime,
                  item.lasttime,
                  item.DGIMN,
                  item.pointname,
                );
              } else if (item.sontype === 'exception') {
                // this.props.dispatch({
                //   type: 'urgentdispatch/queryoperationInfo',
                //   payload: {
                //     dgimn: item.DGIMN
                //   }
                // });
                this.childAlarm.showModal(
                  item.firsttime,
                  item.lasttime,
                  item.DGIMN,
                  item.pointname,
                );
              }
            } else if (item.type === 'advise') {
              if (item.params) {
                const params = JSON.parse(JSON.parse(item.params));
                // this.props.dispatch(routerRedux.push(`/workbench`));
                // this.props.dispatch(routerRedux.push(`/TaskDetail/emergencydetailinfo/null/ywdsjlist/${params.TaskId}/${item.DGIMN}`));
                this.childEmergencyDetailInfo.showModal(item.DGIMN, params.TaskId, item.pointname);
              }
            }
            //修改通知的已读状态
            //   this.changeReadState(item, tabProps);
          }}
          locale={{
            emptyText: formatMessage({ id: 'component.noticeIcon.empty' }),
            clear: formatMessage({ id: 'component.noticeIcon.clear' }),
          }}
          onClear={onNoticeClear}
          onPopupVisibleChange={onNoticeVisibleChange}
          loading={fetchingNotices}
          clearClose={false}
          showClear={false}
        >
          <NoticeIcon.Tab
            count={unreadMsg.alarm}
            list={noticeData.alarm}
            title={formatMessage({ id: 'component.globalHeader.notification' })}
            name="alarm"
            emptyText={formatMessage({ id: 'component.globalHeader.notification.empty' })}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
          />
          <NoticeIcon.Tab
            count={unreadMsg.advise}
            list={noticeData.advise}
            title={formatMessage({ id: 'component.globalHeader.message' })}
            name="advise"
            emptyText={formatMessage({ id: 'component.globalHeader.message.empty' })}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
          />
        </NoticeIcon>
        {/* 预警 */}
        {/* <RealTimeWarningModal {...this.props} onRef={this.onRefWarning} /> */}
        {/* 超标 */}
        <AlarmRecordModal {...this.props} onRef={this.onRefAlarm} />
        {/* 消息 */}
        {/* <EmergencyDetailInfoModal  {...this.props} onRef={this.onRefEmergencyDetailInfo} /> */}
      </div>
    );
  }
}
