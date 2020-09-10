import React, { PureComponent } from 'react';
import { Spin, Tag, Menu, Avatar, Tooltip, Popover, Button, Modal } from 'antd';
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
  notices: global.notices, // 数据要用固定格式
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

  // 格式化添加标签和标识icon
  getNoticeData() { 
    const { notices = [] } = this.props;
     
    if (notices.length !== 0) { //获取到 并经过处理的返回的数据  notices
      //排序
      const noticesAsc = notices.sort(asc);
      const newNotices = noticesAsc.map(notice => {
        const newNotice = { ...notice };
        //消息右侧异常类型
        // if (newNotice.exceptiontypes) {
        //   const exceptiontypes = newNotice.exceptiontypes.split(',');
        //   const color = {
        //     warn: 'blue',
        //     over: 'red',
        //     exception: 'gold',
        //   }[newNotice.sontype];
        //   newNotice.extra = exceptiontypes.map(item => (
        //     <Tag key={`${newNotice.key}${item}`} color={color} style={{ marginRight: 0 }}>
        //       {item}
        //     </Tag>
        //   ));
        // }
          const color = {
            warn: 'blue',
            over: 'red',
            exception: 'gold',
          }["warn"];

        newNotice.extra = <Tag key={`${newNotice.key}`} color={color} style={{ marginRight: 0 }}>
                              {newNotice.AlarmTypeName}
                             </Tag>
        //左侧图标
        if (!newNotice.avatar) {
          if (newNotice.AlarmType === '2') { //超标
            newNotice.avatar = (
              <Avatar style={{ verticalAlign: 'top' }} src="/over.png">
              </Avatar>

            );
          } else if (newNotice.AlarmType === '5'||newNotice.AlarmType === '6'||newNotice.AlarmType === '7' ||newNotice.AlarmType === '12'
          || newNotice.AlarmType === '13' |newNotice.AlarmType === '14') { //报警
            newNotice.avatar = (
              <Avatar style={{ verticalAlign: 'top' }} src="/earlywarning.png">
              </Avatar>
            );
          } else  { //异常
            newNotice.avatar = ( 
              <Avatar style={{ verticalAlign: 'top' }} src="/exception.png">
              </Avatar>
            );
          }
        }
        return newNotice;
      });
      return groupBy(newNotices, 'type');
    }
    
      return {};
    
  }

  // 报警总次数
  // getUnreadData = advisesData => {
  //   const unreadMsg = {};
  //   Object.entries(advisesData).forEach(([key, value]) => {
  //     if (!unreadMsg[key]) {
  //       unreadMsg[key] = 0;
  //     }
  //     if (Array.isArray(value)) {
  //       const arr = value;
  //       let result = 0;
  //       arr.forEach(element => {
  //         if (element.alarmcount) result += element.alarmcount;
  //         else result += 1;
  //       });
  //       unreadMsg[key] = result;
  //     }
  //   });
  //   return unreadMsg;
  // };

  // 取消Model
  // onCancel = () => {
   
  //   this.setState({
  //     visible: false,
  //   });

  // }

  render() {
    const { fetchingNotices, currentUserNoticeCnt, dispatch, notices } = this.props;
    const noticeData = this.getNoticeData();
    // const unreadMsg = this.getUnreadData(noticeData);
    const className = styles.right;

    console.log(noticeData)
    return (
      <div className={`${styles.action} ${styles.account}`}  id='noticeIcon'> 
        <NoticeIcon  
          // count={currentUserNoticeCnt.unreadCount}
          count={notices.length} //小铃铛右上角 小红点 
          onItemClick={(item, tabProps) => { //点击列表项的回调

            // // 6 过期时间报警 7 余量不足报警  8工作状态异常报警  9压力异常报警 - 不弹窗
            // if (item.AlarmType == 6 || item.AlarmType == 7 || item.AlarmType == 8 || item.AlarmType == 9) {
            //   return;
            // }
            // this.setState({
            //   visible: true,
            //   DGIMN: item.DGIMN,
            //   PointName: item.PointName,
            // });
            // // 报警
            // if (item.type === 'alarm') {
            //   switch (item.sontype) {
            //     case 'warn':
            //       this.setState({
            //         title: `实时预警-${  item.PointName}`,
            //         flag: 'warn',
            //       });
            //       break;
            //     case 'over':
            //       this.setState({
            //         title: `超标记录-${  item.PointName}`,
            //         flag: 'over',
            //       });
            //       break;
            //     case 'exception':
            //       this.setState({
            //         title: `异常报警-${  item.PointName}`,
            //         flag: 'exception',
            //       });
            //       break;
            //   }
            // }
          }}
          loading={fetchingNotices}
        >
          <NoticeIcon.Tab  //点击展开 每个tab栏  列表内容 
            // count={unreadMsg.alarm}
            list={noticeData.alarm}
            // title={formatMessage({ id: 'component.globalHeader.notification' })}
            name="alarm" 
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
          />  
        </NoticeIcon>

        {/* 报警列表点击事件  弹出层Model   新版本不需要*/}
        {/* <Modal 
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
                // initLoadData
                style={{ maxHeight: '70vh' }}
                DGIMN={this.state.DGIMN}
               //按理来说时间段按照之前定好的逻辑应该是当天一点到第二天零点，但是联网判断逻辑是将当天零点数据计算到当天次数中了，为了不动联网将此处时间段改成当天零点到当天23:59:59
               firsttime={moment(moment().format('YYYY-MM-DD 00:00:00'))}
               lasttime={moment(moment().format('YYYY-MM-DD 23:59:59'))}
                noticeState={1}
                noticeState={0}
                maxHeight={200}
              />
              : this.state.flag === 'exception' ?
                <ExceptionAlarm
                  initLoadData DGIMN={this.state.DGIMN} Types=""/>
                :
                <RealTimeWarningModal
                  style={{ maxHeight: '70vh' }}
                  DGIMN={this.state.DGIMN}
                  firsttime={moment(moment().format('YYYY-MM-DD 00:00:01'))}
                  lasttime={moment(moment().add('day',1).format('YYYY-MM-DD 00:00:00'))}
                />
          }
        </Modal> */}
      </div>
    );
  }
}
