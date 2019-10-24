import { queryNotices } from '@/services/user';
import { getBtnAuthority } from '../services/baseapi';
import * as services from '@/services/commonApi';
import Model from '@/utils/model';
import * as mywebsocket from '../utils/mywebsocket';
import { getTimeDistance } from '../utils/utils';
import { getAlarmNotices, mymessagelist } from '@/services/globalApi';
import { EnumPropellingAlarmSourceType } from '../utils/enum';
import moment from 'moment';
import { array } from 'prop-types';

/**
 * 功  能：报警消息和推送相关model
 * 创建人：
 * 修改人：dongxiaoyun
 * 创建时间：2019.08.9
 */

export default Model.extend({
  namespace: 'global',
  state: {
    collapsed: false,
    notices: [],
    btnsAuthority: [],
    changePwdVisible: false,
    configInfo: null,
    currentUserNoticeCnt: {
      notifyCount: 0,
      unreadCount: 0,
    },
    getAlarmNoticesParameters: {
      BeginTime: moment().format('YYYY-MM-DD 00:00:00'),
      EndTime: moment().format('YYYY-MM-DD 23:59:59'),
      DGIMN: "",
    },
  },
  effects: {
    *fetchNotices({ payload }, { call, select, update }) {
      // 报警消息
      const { getAlarmNoticesParameters } = yield select(a => a.global);
      const result = yield call(getAlarmNotices, { ...getAlarmNoticesParameters });
      //返回数据
      let notices = [];
      if (result.IsSuccess) {
        notices = notices.concat(
          result.Datas.map((item, index) => {
            return {
              id: item.ID,
              key: item.ID,
              pointname: item.PointName,
              DGIMN: item.DGIMN,
              pollutantnames: item.PollutantNames, //超标显示时用到此字段
              firsttime: item.FirstAlarmTime,
              lasttime: item.LastAlarmTime,
              alarmcount: item.AlarmCount,
              sontype: item.PushType, //推送类型（1.超标 over;2.预警 warn；3.异常 exception ）
              type: 'alarm',
              title: <span>{item.Title}<br /><span style={{ fontSize: 11 }}>{item.TargetName}</span></span>,
              description: item.Description,
              exceptiontypes: item.AlarmTypeDescription,//右侧标签用到，可多个
              orderby: item.PushType === "over" ? 1 : item.PushType === "exception" ? 2 : 3 //排序
            };
          }),
        );
      }
      yield update({
        notices,
        currentUserNoticeCnt: {
          notifyCount: result.Datas.length,
          unreadCount: result.Datas.length,
        },
      })
    },

    // 获取按钮权限
    *getBtnAuthority({ payload }, { call, put, select }) {
      const result = yield call(getBtnAuthority, payload);
      if (result.IsSuccess) {
        const btnsAuthority = result.Datas.map(item => item.Code);
        yield put({
          type: 'updateState',
          payload: {
            btnsAuthority,
          },
        });
      }
    },
    // 获取按钮权限
    *changePwdModal({ payload }, { call, put, select }) {
      yield put({
        type: 'updateState',
        payload: {
          changePwdVisible: true,
        },
      });
    },
    *getSystemConfigInfo({ payload }, { call, put, select }) {
      const response = yield call(services.getSystemConfigInfo);
      if (response.IsSuccess) {
        console.log('ConfigInfo=', response.Datas);
        yield put({
          type: 'setConfigInfo',
          payload: response.Datas,
        });
        yield put({
          type: 'settings/getSetting',
          payload: response.Datas,
        });
      }
    },
  },
  reducers: {
    changeLayoutCollapsed(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return { ...state, collapsed: payload };
    },
    //消息推送更改内存
    changeNotices(state, { payload }) {
      //不要用超级管理员测试，否则会出问题**********************
      const { message } = payload;
      const { Message: data } = message;
      const { notices } = state;
      let count = state.currentUserNoticeCnt.unreadCount;
      let { key, newnotices } = { key: '', newnotices: [] };
      data.AlarmType = parseInt(data.AlarmType);
      let over = [
        EnumPropellingAlarmSourceType.DataOver
      ];
      let exception = [
        EnumPropellingAlarmSourceType.DataException,
        EnumPropellingAlarmSourceType.DYPARAMETER,
        EnumPropellingAlarmSourceType.DataLogicErr,
        EnumPropellingAlarmSourceType.DYSTATEALARM
      ];
      let warnover = [
        EnumPropellingAlarmSourceType.DataOverWarning
      ];
      let getAlarmExceptions = [
        {
          id: 0,
          description: "数据异常"
        },
        {
          id: 1,
          description: "参数异常"
        },
        {
          id: 2,
          description: "数据超标"
        },
        {
          id: 3,
          description: "逻辑异常"
        },
        {
          id: 4,
          description: "状态异常"
        },
        {
          id: 5,
          description: "超标预警"
        },
      ];
      //如果推送是超标并且之前没有数据
      if (!notices.find(t => t.id.includes(`over_${data.DGIMN}`)) &&
        over.includes(data.AlarmType)) {
        newnotices = notices;
        count += 1;
        newnotices.push({
          id: `over_${data.DGIMN}`,
          key: `over_${data.DGIMN}`,
          pointname: data.PointName,
          pollutantnames: data.PollutantName,
          firsttime: data.FirstOverTime,
          lasttime: data.AlarmTime,
          alarmcount: data.AlarmCount,
          sontype: 'over',
          type: 'alarm',
          orderby: 1,
          title: <span>{`${data.PointName}报警${data.AlarmCount}次`}<br /><span style={{ fontSize: 11 }}>{data.ParentName}</span></span>,
          description: `${data.PollutantName}从${data.FirstOverTime}发生了${data.AlarmCount}次超标报警`,
          exceptiontypes: getAlarmExceptions.find(n => n.id === data.AlarmType).description,
        });
      } else if (
        !notices.find(t => t.id.includes(`warn_${data.DGIMN}`)) &&
        warnover.includes(data.AlarmType)
      ) {
        newnotices = notices;
        count += 1;
        newnotices.push({
          id: `warn_${data.DGIMN}`,
          key: `warn_${data.DGIMN}`,
          pointname: data.PointName,
          pollutantnames: data.PollutantName,
          firsttime: data.FirstOverTime,
          lasttime: data.AlarmTime,
          alarmcount: data.AlarmCount,
          sontype: 'warn',
          type: 'alarm',
          orderby: 3,
          title: <span>{`${data.PointName}发生了预警`}<br /><span style={{ fontSize: 11 }}>{data.ParentName}</span></span>,
          description: `${data.PollutantName}${data.FirstOverTime}发生预警，建议浓度降到${data.SuggestValue}以下;`,
          exceptiontypes: getAlarmExceptions.find(n => n.id === data.AlarmType).description,
        });
      } else if (
        !notices.find(t => t.id.includes(`exception_${data.DGIMN}`)) &&
        exception.includes(data.AlarmType)
      ) {
        newnotices = notices;
        const minOrderby = Math.min(
          ...notices.filter(t => t.sontype === 'exception').map(o => o.orderby),
        );
        count += 1;
        newnotices.push({
          id: `exception_${data.DGIMN}`,
          key: `exception_${data.DGIMN}`,
          pointname: data.PointName,
          pollutantnames: data.PollutantName,
          firsttime: data.FirstOverTime,
          lasttime: data.AlarmTime,
          alarmcount: data.AlarmCount,
          sontype: 'exception',
          type: 'alarm',
          orderby: 2,
          title: <span>{`${data.PointName}报警${data.AlarmCount}次`}<br /><span style={{ fontSize: 11 }}>{data.ParentName}</span></span>,
          description: `从${data.FirstOverTime}至${data.AlarmTime}发生了${data.AlarmCount}次异常报警`,
          exceptiontypes: getAlarmExceptions.find(n => n.id === data.AlarmType).description,
        });
      } else {
        // 证明之前有数据，在之前的数据上叠加
        newnotices = notices.map(notice => {
          if (over.includes(data.AlarmType)) {
            key = `over_${data.DGIMN}`;
            if (notice.id === key) {
              notice.lasttime = data.AlarmTime;
              notice.alarmcount += 1;
              notice.title = <span>{`${data.PointName}报警${notice.alarmcount}次`}<br /><span style={{ fontSize: 11 }}>{data.ParentName}</span></span> ,
                notice.description = `${notice.pollutantnames}从${notice.firsttime}发生了${notice.alarmcount}次超标报警`;
            }
          } else if (warnover.includes(data.AlarmType)) {
            key = `warn_${data.DGIMN}`;
            if (notice.id === key) {
              notice.alarmcount += 1;
              notice.title = <span>{`${data.PointName}发生了预警`}<br /><span style={{ fontSize: 11 }}>{data.ParentName}</span></span> ,
                notice.description = `${data.PollutantName}${data.FirstOverTime}发生预警，建议浓度降到${data.SuggestValue}以下;`;
            }
          }
          else if (exception.includes(data.AlarmType)) {
            debugger
            key = `exception_${data.DGIMN}`;
            if (notice.id === key) {
              notice.lasttime = data.AlarmTime;
              notice.alarmcount += 1;
              notice.title = <span>{`${data.PointName}报警${notice.alarmcount}次`}<br /><span style={{ fontSize: 11 }}>{data.ParentName}</span></span> ,
                notice.description = `从${notice.firsttime}至${notice.lasttime}发生了${notice.alarmcount}次异常报警`;
            }
          }
          return notice;
        });
      }
      return {
        ...state,
        notices: newnotices,
        currentUserNoticeCnt: {
          notifyCount: count,
          unreadCount: count,
        },
      };
    },
    changeAdvises(state, { payload }) {
      const { message } = payload;
      const { Message: item } = message;
      const { notices } = state;
      const count = state.currentUserNoticeCnt.unreadCount;
      const newnotices = notices;
      const minOrderby = Math.min(...notices.filter(t => t.type === 'advise').map(o => o.orderby));
      newnotices.push({
        id: `advise_${item.DGIMN}`,
        pointname: `${item.PointName}`,
        DGIMN: `${item.DGIMN}`,
        pushid: `${item.PushID}`,
        msgtitle: item.Title,
        msg: item.Message,
        isview: item.IsView,
        sontype: `advise_${item.NoticeType}`,
        params: item.Col1,
        // 组件里根据这个分组
        type: 'advise',
        // 排序从10000到19999
        orderby: minOrderby - 1,
        key: `advise_${item.DGIMN}_${item.PushID}`,
        title: `${item.Title}`,
        description: `${item.Message}`,
      });
      return {
        ...state,
        notices: newnotices,
        currentUserNoticeCnt: {
          notifyCount: count,
          unreadCount: count,
        },
      };
    },
    saveClearedNotices(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return {
        collapsed: false,
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    setConfigInfo(state, { payload }) {
      return { ...state, configInfo: { ...payload } };
    },

    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  subscriptions: {
    socket({ dispatch }) {
      // socket相关
      return mywebsocket.listen(data => {
        // 实时数据："{"MessageType":"RealTimeData","Message":[{"DGIMN":"201809071401","PollutantCode":"s01","MonitorTime":"2018-11-21 01:22:41","MonitorValue":36.630,"MinStrength":null,"MaxStrength":null,"CouStrength":null,"IsOver":-1,"IsException":0,"Flag":"","ExceptionType":"","AlarmLevel":"身份验证失败","AlarmType":"无报警","Upperpollutant":"0","Lowerpollutant":"0","PollutantResult":"","AlarmTypeCode":0,"StandardColor":"red","StandardValue":"-","OverStandValue":"","DecimalReserved":3}]}"
        const obj = JSON.parse(data);
        switch (obj.MessageType) {
          case 'RealTimeData':
            // // 跳转到对应的effect，把实体带过去更新state达到页面刷新的目的
            dispatch({
              type: 'realtimeserver/updateRealTimeData',
              payload: {
                data: obj.Message
              },
            });
            break;
          case 'MinuteData':
            break;
          case 'HourData':
            break;
          case 'DynamicControlParam':
            break;
          case 'DynamicControlState':
            break;
          //推送报警数据
          case 'Alarm':
            dispatch({
              type: 'changeNotices',
              payload: { message: obj.Message },
            });
            //异常推送消息 例： {"message":{"ID":null,"ToUserID":null,"FromUserID":null,"UserName":"系统报警","Message":{"alarmValue":0,"ID":"9d89f0fb-0fab-4e3f-b4a1-33298eebf748","PointName":"废水出口","PollutantName":"pH值","AlarmTime":"2019-10-24T09:00:00","StandardValue":null,"AlarmCount":2,"AlarmLevel":null,"DGIMN":"51052216080301","PollutantCode":"001","PollutantTypeCode":1,"FirstOverTime":"2019-10-24T09:00:00","AlarmType":"0","AlarmMessage":"[广东瑞明电力-废水出口]在2019/10/24 9:00:00 pH值发生[超限异常]:。异常次数：2。首次异常时间：2019/10/24 9:00:00","DataType":"HourData","Level":null,"ExceptionType":"","MessageModel":null,"Start":null,"End":null,"PCUrl":null,"AppUrl":null,"MaxMultiple":0,"SuggestValue":0,"MsgType":0,"ParentCode":"0051264","ParentName":"广东瑞明电力股份有限公司","Abbreviation":"广东瑞明电力","Col1":null,"Col2":null,"Col3":null,"Col4":null,"Col5":null},"MessageTime":"2019-10-24T09:36:37","Cate":"Alarm","State":null,"Dgimn":null}}
            //超标推送消息 例： {"message":{"ID":null,"ToUserID":null,"FromUserID":null,"UserName":"系统报警","Message":{"alarmValue":0,"ID":"898e996a-0cc4-459b-9d30-3fbb6eec68be","PointName":"废水出口","PollutantName":"pH值","AlarmTime":"2019-10-24T09:00:00","StandardValue":null,"AlarmCount":2,"AlarmLevel":null,"DGIMN":"51052216080301","PollutantCode":"001","PollutantTypeCode":1,"FirstOverTime":"2019-10-24T09:00:00","AlarmType":"0","AlarmMessage":"[广东瑞明电力-废水出口]在2019/10/24 9:00:00 pH值发生[连续值异常]:。异常次数：2。首次异常时间：2019/10/24 9:00:00","DataType":"HourData","Level":null,"ExceptionType":"","MessageModel":null,"Start":null,"End":null,"PCUrl":null,"AppUrl":null,"MaxMultiple":0,"SuggestValue":0,"MsgType":0,"ParentCode":"0051264","ParentName":"广东瑞明电力股份有限公司","Abbreviation":"广东瑞明电力","Col1":null,"Col2":null,"Col3":null,"Col4":null,"Col5":null},"MessageTime":"2019-10-24T09:49:43","Cate":"Alarm","State":null,"Dgimn":null}}
            break;
          case 'Notice':
            dispatch({
              type: 'changeAdvises',
              payload: { message: obj.Message },
            });
            break;
          default:
            break;
        }
      });
    },
    setup({ history }) {
      history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
});
