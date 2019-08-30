import { queryNotices } from '@/services/user';
import { getBtnAuthority } from '../services/baseapi';
import * as services from '@/services/commonApi';
import Model from '@/utils/model';
import * as mywebsocket from '../utils/mywebsocket';
import { getTimeDistance } from '../utils/utils';
import { getAlarmNotices, mymessagelist } from '@/services/globalApi';
import { EnumPropellingAlarmSourceType } from '../utils/enum';
import moment from 'moment';

export default Model.extend({
  namespace: 'global',
  state: {
    collapsed: false,
    notices: [],
    btnsAuthority: [],
    changePwdVisible: false,
    configInfo: null,
    fetchingNotices: false,
    currentUserNoticeCnt: {
      notifyCount: 0,
      unreadCount: 0,
    },
    getAlarmNoticesParameters: {
      beginTime: moment().format('YYYY-MM-DD 00:00:00'),
      endTime: moment().format('YYYY-MM-DD 23:59:59'),
      DGIMN: "",
    },
  },
  effects: {
    *fetchNotices({ payload }, { call, select, update }) {
      // debugger
      // yield put({
      //   type: 'changeNoticeLoading',
      //   payload: true,
      // });
      yield update({
        fetchingNotices: true,
      })
      // 报警消息
      const { getAlarmNoticesParameters } = yield select(a => a.global);
      // debugger
      const result = yield call(getAlarmNotices, { ...getAlarmNoticesParameters });
      let notices = [];
      let count = 0;
      if (result.IsSuccess) {
        const { overs, warns, exceptions } = result.Datas;
        const dataovers = overs;
        const datawarns = warns;
        const dataexceptions = exceptions;
        notices = notices.concat(
          dataovers.map((item, index) => {
            count += item.AlarmCount;
            return {
              id: `over_${item.DGIMNs}`,
              pointname: item.PointName,
              DGIMN: `${item.DGIMNs}`,
              pollutantnames: item.PollutantNames,
              firsttime: item.FirstTime,
              lasttime: item.LastTime,
              alarmcount: item.AlarmCount,
              sontype: 'over',
              // 组件里根据这个分组
              type: 'alarm',
              // 排序从0到2999
              orderby: 1000 + index,
              key: `over_${item.DGIMNs}`,
              title: `${item.PointName}报警${item.AlarmCount}次`,
              description: `${item.PollutantNames}从${item.FirstTime}发生了${item.AlarmCount}次超标报警`,
            };
          }),
        );
        notices = notices.concat(
          datawarns.map((item, index) => {
            let discription = '';
            discription = discription.concat(
              item.OverWarnings.map(
                sonitem =>
                  `${sonitem.PollutantName}${sonitem.AlarmOverTime}发生预警，建议浓度降到${sonitem.SuggestValue}以下;`,
              ),
            );
            count += 1;
            return {
              id: `warn_${item.DGIMNs}`,
              pointname: item.PointName,
              DGIMN: `${item.DGIMNs}`,
              discription,
              overwarnings: item.OverWarnings,
              sontype: 'warn',
              // 组件里根据这个分组
              type: 'alarm',
              // 排序从3000到4999
              orderby: 4000 + index,
              key: `warn_${item.DGIMNs}`,
              title: `${item.PointName}发生了预警`,
              description: `${discription}`,
            };
          }),
        );
        notices = notices.concat(
          dataexceptions.map((item, index) => {
            count += item.AlarmCount;
            return {
              id: `exception_${item.DGIMNs}`,
              pointname: item.PointName,
              DGIMN: `${item.DGIMNs}`,
              exceptiontypes: item.ExceptionTypes,
              firsttime: item.FirstAlarmTime,
              lasttime: item.LastAlarmTime,
              alarmcount: item.AlarmCount,
              sontype: 'exception',
              // 组件里根据这个分组
              type: 'alarm',
              // 排序从5000到9999
              orderby: 6000 + index,
              key: `exception_${item.DGIMNs}`,
              title: `${item.PointName}报警${item.AlarmCount}次`,
              description: `从${item.FirstAlarmTime}至${item.LastAlarmTime}发生了${item.AlarmCount}次异常报警`,
              descriptionbak: `从${item.FirstAlarmTime}至${item.LastAlarmTime}发生了${item.AlarmCount}次异常报警`,
            };
          }),
        );
      }
      yield update({
        notices,
        currentUserNoticeCnt: {
          notifyCount: count,
          unreadCount: count,
        },
        fetchingNotices: false,
      })
    },

    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },

    *changeNoticeReadState({ payload }, { put, select }) {
      const notices = yield select(state =>
        state.global.notices.map(item => {
          const notice = { ...item };

          if (notice.id === payload) {
            notice.read = true;
          }

          return notice;
        }),
      );
      yield put({
        type: 'saveNotices',
        payload: notices,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter(item => !item.read).length,
        },
      });
    },
    // 获取按钮权限
    *getBtnAuthority({ payload }, { call, put, select }) {
      // const menuCode = yield select(state => state.menu.menuCode);
      const result = yield call(getBtnAuthority, payload);
      // debugger;
      if (result.IsSuccess) {
        const btnsAuthority = result.Datas.map(item => item.Code);
        // console.log('btnsAuthority=', btnsAuthority);
        yield put({
          type: 'updateState',
          payload: {
            btnsAuthority,
          },
        });
        // yield update({
        //   btnsAuthority
        // })
      }
    },
    // 获取按钮权限
    *changePwdModal({ payload }, { call, put, select }) {
      // const menuCode = yield select(state => state.menu.menuCode);
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
      // const { configInfo } = yield select(m => m.login);
      // console.log("setConfigInfo=", configInfo);
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
    // saveNotices(state, { payload }) {
    //   return {
    //     ...state,
    //     notices: payload.notices,
    //     currentUserNoticeCnt: {
    //       notifyCount: payload.notifyCount,
    //       unreadCount: payload.unreadCount,
    //     },
    //     fetchingNotices: false,
    //   };
    // },
    // changeNoticeLoading(state, { payload }) {
    //   return {
    //     ...state,
    //     fetchingNotices: payload,
    //   };
    // },
    changeNotices(state, { payload }) {
      const { message } = payload;
      const { Message: data } = message;
      const { notices } = state;
      let count = state.currentUserNoticeCnt.unreadCount;
      let { key, newnotices } = { key: '', newnotices: [] };
      data.AlarmType = parseInt(data.AlarmType);
      if (
        !notices.find(t => t.id.includes(`over_${data.DGIMN}`)) &&
        data.AlarmType === EnumPropellingAlarmSourceType.DataOver
      ) {
        newnotices = notices;
        const minOrderby = Math.min(...notices.filter(t => t.sontype === 'over').map(o => o.orderby));
        count += data.AlarmCount; // 董晓云添加
        newnotices.push({
          id: `over_${data.DGIMN}`,
          pointname: data.PointName,
          pollutantnames: data.PollutantName,
          firsttime: data.FirstOverTime,
          lasttime: data.AlarmTime,
          alarmcount: data.AlarmCount,
          sontype: 'over',
          // 组件里根据这个分组
          type: 'alarm',
          // 排序从0到2999
          orderby: minOrderby - 1,
          key: `over_${data.DGIMN}`,
          title: `${data.PointName}报警${data.AlarmCount}次`,
          description: `${data.PollutantName}从${data.FirstOverTime}发生了${data.AlarmCount}次超标报警`,
        });
      } else if (
        !notices.find(t => t.id.includes(`warn_${data.DGIMN}`)) &&
        data.AlarmType === EnumPropellingAlarmSourceType.DataOverWarning
      ) {
        newnotices = notices;
        const minOrderby = Math.min(...notices.filter(t => t.sontype === 'warn').map(o => o.orderby));
        count += 1; // 董晓云添加
        newnotices.push({
          id: `warn_${data.DGIMN}`,
          pointname: data.PointName,
          discription: '',
          overwarnings: '',
          sontype: 'warn',
          // 组件里根据这个分组
          type: 'alarm',
          // 排序从3000到4999
          orderby: minOrderby - 1,
          key: `warn_${data.DGIMN}`,
          title: `${data.PointName}发生了预警`,
          description: '',
        });
      } else if (
        !notices.find(t => t.id.includes(`exception_${data.DGIMN}`)) &&
        (data.AlarmType === EnumPropellingAlarmSourceType.DataException ||
          data.AlarmType === EnumPropellingAlarmSourceType.DYPARAMETER ||
          data.AlarmType === EnumPropellingAlarmSourceType.DataLogicErr ||
          data.AlarmType === EnumPropellingAlarmSourceType.DYSTATEALARM)
      ) {
        newnotices = notices;
        const minOrderby = Math.min(
          ...notices.filter(t => t.sontype === 'exception').map(o => o.orderby),
        );
        count += data.AlarmCount; // 董晓云添加
        newnotices.push({
          id: `exception_${data.DGIMN}`,
          pointname: data.PointName,
          pollutantnames: data.PollutantName,
          firsttime: data.FirstOverTime,
          lasttime: data.AlarmTime,
          alarmcount: data.AlarmCount,
          sontype: 'exception',
          // 组件里根据这个分组
          type: 'alarm',
          // 排序从5000到9999
          orderby: minOrderby - 1,
          key: `exception_${data.DGIMN}`,
          title: `${data.PointName}报警${data.AlarmCount}次`,
          description: `从${data.FirstOverTime}至${data.AlarmTime}发生了${data.AlarmCount}次异常报警`,
        });
      } else {
        // 证明之前有数据，在之前的数据上叠加
        newnotices = notices.map(notice => {
          // let newnotice = { ...notice };
          if (data.AlarmType === EnumPropellingAlarmSourceType.DataOver) {
            key = `over_${data.DGIMN}`;
            if (notice.id === key) {
              notice.lasttime = data.AlarmTime;
              notice.alarmcount += 1;
              count += 1;
              notice.title = `${notice.pointname}报警${notice.alarmcount}次`;
              notice.description = `${notice.pollutantnames}从${notice.firsttime}发生了${notice.alarmcount}次超标报警`;
            }
          } else if (data.AlarmType === EnumPropellingAlarmSourceType.DataOverWarning) {
            key = `warn_${data.DGIMN}`;
            if (notice.id === key) {
              notice.OverWarnings = [];
              notice.OverWarnings.push({
                PollutantName: data.PollutantName,
                PollutantCode: data.PollutantCode,
                AlarmOverTime: data.FirstOverTime,
                AlarmValue: data.AlarmValue,
                SuggestValue: data.SuggestValue,
              });
              let discription = '';
              discription = discription.concat(
                notice.OverWarnings.map(
                  sonitem =>
                    `${sonitem.PollutantName}${sonitem.AlarmOverTime}发生预警，建议浓度降到${sonitem.SuggestValue}以下;`,
                ),
              );
              notice.discription = discription;
              count += 1;
            }
          } else if (
            data.AlarmType === EnumPropellingAlarmSourceType.DataException ||
            data.AlarmType === EnumPropellingAlarmSourceType.DYPARAMETER ||
            data.AlarmType === EnumPropellingAlarmSourceType.DataLogicErr ||
            data.AlarmType === EnumPropellingAlarmSourceType.DYSTATEALARM
          ) {
            key = `exception_${data.DGIMN}`;
            if (notice.id === key) {
              notice.lasttime = data.AlarmTime;
              notice.alarmcount += 1;
              count += 1;
              notice.title = `${notice.pointname}报警${notice.alarmcount}次`;
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
      // debugger;
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
            // dispatch({
            //   type: 'points/updateRealTimeData',
            //   payload: {
            //     array: obj.Message
            //   },
            // });
            // dispatch({
            //   type: 'workbenchmodel/updateRealTimeData',
            //   payload: {
            //     array: obj.Message
            //   },
            // });
            // dispatch({
            //   type: 'videolist/changeRealTimeData',
            //   payload: {
            //     array: obj.Message
            //   },
            // });
            break;
          case 'MinuteData':
            // dispatch({
            //     type: 'welcome'
            // });
            break;
          case 'HourData':
            // dispatch({
            //     type: 'welcome'
            // });
            break;
          case 'DynamicControlParam':
            // dispatch({
            //   type: 'points/updateDynamicControlParam',
            //   payload: {
            //     array: obj.Message
            //   },
            // });
            break;
          case 'DynamicControlState':
            // dispatch({
            //   type: 'points/updateDynamicControlState',
            //   payload: {
            //     array: obj.Message
            //   },
            // });
            break;
          case 'Alarm':
            dispatch({
              type: 'changeNotices',
              payload: { message: obj.Message },
            });
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
