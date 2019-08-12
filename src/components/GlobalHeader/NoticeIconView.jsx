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
import ExceptionModal from './ExceptionModal';
// import EmergencyDetailInfoModal from './EmergencyDetailInfoModal';
import RecordEchartTable from '@/components/recordEchartTable'

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
      payload:{}
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
              <Avatar style={{ verticalAlign: 'middle' }} src='/over.png'>
              </Avatar>
              
            );
          } else if (newNotice.sontype === 'warn') {
            newNotice.avatar = (
              <Avatar style={{ verticalAlign: 'middle' }} src='/earlywarning.png'>
              </Avatar>
            );
          } else if (newNotice.sontype === 'exception') {
            newNotice.avatar = (
              <Avatar style={{verticalAlign: 'middle' }} src='/exception.png'>
              </Avatar>
            );
          }
        }
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
  onRefException = ref => {
    this.childException = ref;
  };
  // onRefEmergencyDetailInfo = (ref) => {
  //   this.childEmergencyDetailInfo = ref;
  // }

  render() {
    const {
      fetchingNotices,
      currentUserNoticeCnt,
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
                this.childException.showModal(
                  // item.firsttime,
                  // item.lasttime,
                  item.DGIMN,
                  // item.pointname,
                );
              }
            }
            //修改通知的已读状态
            //   this.changeReadState(item, tabProps);
          }}
          loading={fetchingNotices}
          onViewMore={() => message.info('Click on view more')}
        >
          <NoticeIcon.Tab
            count={unreadMsg.alarm}
            list={noticeData.alarm}
            title={formatMessage({ id: 'component.globalHeader.notification' })}
            name="alarm"
            emptyText={formatMessage({ id: 'component.globalHeader.notification.empty' })}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
          />
        </NoticeIcon>
        {/* 预警 */}
        {/* <RealTimeWarningModal {...this.props} onRef={this.onRefWarning} /> */}
        {/* 超标 */}
        <AlarmRecordModal {...this.props} onRef={this.onRefAlarm} />
        {/* 异常 */}
        <ExceptionModal {...this.props} onRef={this.onRefException} />
        {/* 消息 */}
        {/* <EmergencyDetailInfoModal  {...this.props} onRef={this.onRefEmergencyDetailInfo} /> */}
      </div>
    );
  }
}