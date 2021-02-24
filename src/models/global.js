import { queryNotices } from '@/services/user';
import { getBtnAuthority } from '../services/baseapi';
import * as services from '@/services/commonApi';
import Model from '@/utils/model';
import * as mywebsocket from '../utils/mywebsocket';
import { getTimeDistance } from '../utils/utils';
import { getAlarmNotices, mymessagelist, getSysPollutantTypeList } from '@/services/globalApi';
import { EnumPropellingAlarmSourceType } from '../utils/enum';
import moment from 'moment';
import { array } from 'prop-types';
import Cookie from 'js-cookie';
import config from '@/config';
import { message } from 'antd';


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
    configInfo: {},
    currentUserNoticeCnt: {
      notifyCount: 0,
      unreadCount: 0,
    },
    getAlarmNoticesParameters: {
      BeginTime: moment().format('YYYY-MM-DD 00:00:00'),
      EndTime: moment().format('YYYY-MM-DD 23:59:59'),
      DGIMN: '',
    },
    clientHeight: null,
    sysPollutantTypeList: [],
  },
  effects: {
    // 首次加载获取当天报警消息
    *fetchNotices({ payload }, { call, update, select }) {
      const { getAlarmNoticesParameters } = yield select(a => a.global);
      const result = yield call(getAlarmNotices, { ...getAlarmNoticesParameters });
      let notices = [];
      if (result.IsSuccess) {
        notices = notices.concat(
          result.Datas.map((item, index) => ({
            ...item,
            id: item.ID,
            key: item.ID,
            pointname: item.PointName,
            DGIMN: item.DGIMN,
            pollutantnames: item.PollutantNames, // 超标显示时用到此字段
            firsttime: item.FirstAlarmTime,
            lasttime: item.LastAlarmTime,
            alarmcount: item.AlarmCount,
            sontype: item.PushType, // 推送类型（1.超标 over;2.预警 warn；3.异常 exception ）
            type: 'alarm',
            title: <span>{item.Title}<br /><span style={{ fontSize: 11 }}>{item.TargetName}</span></span>,
            description: item.Description,
            exceptiontypes: item.AlarmTypeDescription, // 右侧标签用到，可多个
            orderby: item.PushType === 'over' ? 1 : item.PushType === 'exception' ? 2 : 3, // 排序
          })),
        );
      }
      yield update({
        notices,
        currentUserNoticeCnt: {
          notifyCount: result.Datas ? result.Datas.length : 0,
          unreadCount: result.Datas ? result.Datas.length : 0,
        },
      })
    },
    // 获取系统入口
    *getSysPollutantTypeList({ payload }, { call, update, select }) {
      const result = yield call(getSysPollutantTypeList);
      if (result.IsSuccess) {
        yield update({
          sysPollutantTypeList: result.Datas,
        })
      } else {
        message.error(result.Message)
      }
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
        // console.log('ConfigInfo=', response.Datas);
        try {
          mywebsocket.InitWebsocket(response.Datas.WebSocketAddress);

          payload.listen();
        } catch (e) {
          console.log('WebSocketAddress获取失败');
        }

        yield put({
          type: 'setConfigInfo',
          payload: {
            GroupRegionState: 0,
            ...response.Datas,
          },
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
    // 接收消息推送更改Model内存
    changeNotices(state, { payload }) {
      try {
        // 不要用超级管理员测试，否则会出问题**********************
        const { message } = payload;
        const { Message: data } = message;
        const { notices } = state;
        let count = state.currentUserNoticeCnt.unreadCount;
        let { key, newnotices } = { key: '', newnotices: [] };
        let flagAlarm = ''; // 报警类型标识（1.超标 over;2.预警 warn;2.异常 exception
        let orderby = 0; // 排序标识根据类型排序
        data.AlarmType = parseInt(data.AlarmType);
        // 标识判断（用于设置id及主键等标识）
        switch (data.AlarmType) {
          case EnumPropellingAlarmSourceType.DataOver:
            flagAlarm = 'over';
            orderby = 1;
            break;
          case EnumPropellingAlarmSourceType.DataException:
          case EnumPropellingAlarmSourceType.DYPARAMETER:
          case EnumPropellingAlarmSourceType.DataLogicErr:
          case EnumPropellingAlarmSourceType.DYSTATEALARM:
            flagAlarm = 'exception';
            orderby = 2;
            break;
          case EnumPropellingAlarmSourceType.DataOverWarning:
            flagAlarm = 'warn';
            orderby = 3;
          case EnumPropellingAlarmSourceType.ExpirationTimeAlarm:
            flagAlarm = 'exception';
            orderby = 2;
            break;
          case EnumPropellingAlarmSourceType.InsufficientMarginAlarm:
            flagAlarm = 'exception';
            orderby = 2;
            break;
        }
        // 超标枚举
        const over = [
          EnumPropellingAlarmSourceType.DataOver,
        ];
        // 异常枚举
        const exception = [
          EnumPropellingAlarmSourceType.DataException,
          EnumPropellingAlarmSourceType.DYPARAMETER,
          EnumPropellingAlarmSourceType.DataLogicErr,
          EnumPropellingAlarmSourceType.DYSTATEALARM,
        ];
        // 预警枚举
        const warnover = [
          EnumPropellingAlarmSourceType.DataOverWarning,
        ];
        // 报警描述
        const getAlarmExceptions = [
          {
            id: 0,
            description: '数据异常',
          },
          {
            id: 1,
            description: '参数异常',
          },
          {
            id: 2,
            description: '数据超标',
          },
          {
            id: 3,
            description: '逻辑异常',
          },
          {
            id: 4,
            description: '状态异常',
          },
          {
            id: 5,
            description: '超标预警',
          },
          {
            id: 6,
            description: '过期时间报警',
          },
          {
            id: 7,
            description: '余量不足报警',
          },
        ];
        // 如果推送是超标并且之前没有数据
        if ((!notices.find(t => t.id.includes(`over_${data.DGIMN}`)) && over.includes(data.AlarmType)) ||
          (!notices.find(t => t.id.includes(`warn_${data.DGIMN}`)) && warnover.includes(data.AlarmType)) ||
          (!notices.find(t => t.id.includes(`exception_${data.DGIMN}`)) && exception.includes(data.AlarmType))
        ) {
          newnotices = notices;
          count += 1;
          newnotices.push({
            id: `${flagAlarm}_${data.DGIMN}`,
            key: `${flagAlarm}_${data.DGIMN}`,
            pointname: data.PointName,
            pollutantnames: data.PollutantName,
            firsttime: data.FirstOverTime,
            lasttime: data.AlarmTime,
            alarmcount: data.AlarmCount,
            sontype: flagAlarm,
            type: 'alarm',
            orderby,
            title: flagAlarm === 'warn' ?
              <span>{`${data.PointName}发生了预警`}<br /><span style={{ fontSize: 11 }}>{data.ParentName}</span></span> :
              <span>{`${data.PointName}报警${data.AlarmCount}次`}<br /><span style={{ fontSize: 11 }}>{data.ParentName}</span></span>,
            description:
              flagAlarm === 'over' ?
                `${data.PollutantName}从${data.FirstOverTime}发生了${data.AlarmCount}次超标报警` :
                flagAlarm === 'exception' ?
                  `从${data.FirstOverTime}至${data.AlarmTime}发生了${data.AlarmCount}次异常报警` :
                  `${data.PollutantName}${data.FirstOverTime}发生预警，建议浓度降到${data.SuggestValue};`,
            exceptiontypes: getAlarmExceptions.find(n => n.id === data.AlarmType).description,
          });
        }
        // 证明之前有数据，在之前的数据上叠加
        else {
          newnotices = notices.map(notice => {
            // 判断类型是否包含
            if (over.includes(data.AlarmType) ||
              warnover.includes(data.AlarmType) ||
              exception.includes(data.AlarmType)
            ) {
              key = `${flagAlarm}_${data.DGIMN}`;
              if (notice.id === key) {
                notice.lasttime = data.AlarmTime;
                notice.alarmcount += 1;
                notice.title =
                  flagAlarm === 'warn' ?
                    <span>{`${notice.PointName}发生了预警`}<br /><span style={{ fontSize: 11 }}>{notice.ParentName}</span></span> :
                    <span>{`${notice.PointName}报警${notice.alarmcount}次`}<br /><span style={{ fontSize: 11 }}>{notice.ParentName}</span></span>,
                  notice.description =
                  flagAlarm === 'over' ?
                    `${notice.pollutantnames}从${notice.firsttime}发生了${notice.alarmcount}次超标报警` :
                    flagAlarm === 'exception' ?
                      `从${notice.firsttime}至${notice.lasttime}发生了${notice.alarmcount}次异常报警` :
                      `${notice.PollutantName}${notice.FirstOverTime}发生预警，建议浓度降到${notice.SuggestValue};`
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
      } catch (e) {
        console.log(e)
        return {
          ...state,
        };
      }
    },
    // 接收消息推送更改Model内存
    changeQCANotices(state, { payload }) {
      const notices = [...state.notices];
      // console.log('error=',notices)
      // console.log('payload=',payload)
      // 67: 余量、过期时间报警; 89: 工作状态异常、压力异常报警
      const changeType = payload.find(t => t.Type == 6 || t.Type == 7) ? 67 : 89;
      payload.map(item => {
        // 6 过期时间报警 7 余量不足报警  8工作状态异常报警  9压力异常报警
        // 判断过滤条件
        let filterDataIndex = notices.findIndex(notice => item.DataGatherCode === notice.DGIMN && notice.AlarmType == item.Type && item.Code == 0)
        // console.log('index=',filterDataIndex)
        let PollutantName = item.TypeName;
        if (changeType === 67) {
          filterDataIndex = notices.findIndex(notice => item.DataGatherCode === notice.DGIMN && notice.AlarmType == item.Type && notice.PollutantCodes == item.Code)
          PollutantName = item.PollutantName;
        }

        // 有相同数据，每次接收推送消息后数量加1
        if (filterDataIndex >= 0) {
          const filterObj = notices[filterDataIndex];
          notices[filterDataIndex] = {
            ...notices[filterDataIndex],
            alarmcount: filterObj.alarmcount + 1,
            LastAlarmTime: item.Time,
            title: <span>{`${filterObj.pointname}，${PollutantName}报警${filterObj.alarmcount + 1}次`}<br /><span style={{ fontSize: 11 }}>{filterObj.TargetName}</span></span>,
            description: `从${filterObj.FirstAlarmTime}至${item.Time},${PollutantName}发生了${filterObj.alarmcount + 1}次${filterObj.exceptiontypes}`, // 右侧标签用到，可多个
          }
        } else {
          // 无相同数据，追加推送的新数据
          const name = changeType === 67 ? item.PollutantName : item.TypeName;
          notices.push({
            FirstAlarmTime: item.Time,
            DGIMN: item.DataGatherCode,
            PointName: item.PointName,
            TargetName: item.PointName,
            AlarmType: item.Type,
            PollutantCodes: item.Code,
            alarmcount: 1,
            LastAlarmTime: item.Time,
            sontype: 'exception',
            type: 'alarm',
            exceptiontypes: `${item.TypeName}报警`,
            title: <span>{`${item.PointName}，${name}报警1次`}<br /><span style={{ fontSize: 11 }}>{item.PointName}</span></span>,
            // description: item.Description,
            description: `从${item.Time}至${item.Time}，${name}发生了1次报警`, // 右侧标签用到，可多个
          })
        }
      })
      return {
        ...state,
        notices,
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
      console.log('initsocket1');
      dispatch({
        type: 'getSystemConfigInfo', payload: {
          listen: function () {
            console.log('initsocket2');
            return mywebsocket.listen(data => {
              // 实时数据："{"MessageType":"RealTimeData","Message":[{"DGIMN":"201809071401","PollutantCode":"s01","MonitorTime":"2018-11-21 01:22:41","MonitorValue":36.630,"MinStrength":null,"MaxStrength":null,"CouStrength":null,"IsOver":-1,"IsException":0,"Flag":"","ExceptionType":"","AlarmLevel":"身份验证失败","AlarmType":"无报警","Upperpollutant":"0","Lowerpollutant":"0","PollutantResult":"","AlarmTypeCode":0,"StandardColor":"red","StandardValue":"-","OverStandValue":"","DecimalReserved":3}]}"
              const obj = JSON.parse(data);

              // console.log('real=', obj)
              switch (obj.MessageType) {
                case 'RealTimeData':
                  // 跳转到对应的effect，把实体带过去更新state达到页面刷新的目的
                  dispatch({
                    type: 'realtimeserver/updateRealTimeDatas',
                    payload: {
                      data: obj.Message,
                    },
                  });
                  dispatch({
                    type: 'realtimeserver/updateRealTimeCharts',
                    payload: {
                      data: obj.Message,
                    },
                  });
                  // 实时数据一览
                  dispatch({
                    type: 'overview/updateRealTimeDataView',
                    payload: {
                      type: 'RealTimeData',
                      message: obj.Message,
                    },
                  })
                  break;
                case 'MinuteData':
                  // 实时数据一览 - 分钟
                  dispatch({
                    type: 'overview/updateRealTimeDataView',
                    payload: {
                      type: 'MinuteData',
                      message: obj.Message,
                    },
                  })
                  break;
                case 'HourData':
                  // 实时数据一览 - 小时
                  // dispatch({
                  //   type: "overview/updateRealTimeDataView",
                  //   payload: {
                  //     type: "HourData",
                  //     message: obj.Message
                  //   }
                  // })
                  break;

                // 工艺流程图动态参数数据
                case 'DynamicControlParam':
                case 'DynamicControlState':
                  dispatch({
                    type: 'realtimeserver/updateDynamicControl',
                    payload: {
                      data: obj,
                    },
                  });
                  break;
                // 推送报警数据
                case 'Alarm':
                  dispatch({
                    type: 'changeNotices',
                    payload: { message: obj.Message },
                  });
                  // 异常推送消息 例： {"message":{"ID":null,"ToUserID":null,"FromUserID":null,"UserName":"系统报警","Message":{"alarmValue":0,"ID":"9d89f0fb-0fab-4e3f-b4a1-33298eebf748","PointName":"废水出口","PollutantName":"pH值","AlarmTime":"2019-10-24T09:00:00","StandardValue":null,"AlarmCount":2,"AlarmLevel":null,"DGIMN":"51052216080301","PollutantCode":"001","PollutantTypeCode":1,"FirstOverTime":"2019-10-24T09:00:00","AlarmType":"0","AlarmMessage":"[广东瑞明电力-废水出口]在2019/10/24 9:00:00 pH值发生[超限异常]:。异常次数：2。首次异常时间：2019/10/24 9:00:00","DataType":"HourData","Level":null,"ExceptionType":"","MessageModel":null,"Start":null,"End":null,"PCUrl":null,"AppUrl":null,"MaxMultiple":0,"SuggestValue":0,"MsgType":0,"ParentCode":"0051264","ParentName":"广东瑞明电力股份有限公司","Abbreviation":"广东瑞明电力","Col1":null,"Col2":null,"Col3":null,"Col4":null,"Col5":null},"MessageTime":"2019-10-24T09:36:37","Cate":"Alarm","State":null,"Dgimn":null}}
                  // 超标推送消息 例： {"message":{"ID":"5ca35487-873e-4af4-9d9f-b766d964400e","ToUserID":null,"FromUserID":null,"UserName":"系统报警","Message":{"alarmValue":0,"ID":"5ca35487-873e-4af4-9d9f-b766d964400e","PointName":"废水出口","PollutantName":"pH值","AlarmTime":"2019-10-24T09:00:00","StandardValue":null,"AlarmCount":1,"AlarmLevel":null,"DGIMN":"51052216080301","PollutantCode":"001","PollutantTypeCode":1,"FirstOverTime":"2019-10-24T09:00:00","AlarmType":2,"AlarmMessage":"[广东瑞明电力-废水出口]于2019-10-24 09:00:00 pH值数据超标[1]次，首次超标时间2019-10-24 09:00:00，超标值158.303[9为正常值]","DataType":"HourData","Level":null,"ExceptionType":"","MessageModel":null,"Start":null,"End":null,"PCUrl":null,"AppUrl":null,"MaxMultiple":0,"SuggestValue":0,"MsgType":0,"ParentCode":"0051264","ParentName":"广东瑞明电力股份有限公司","Abbreviation":"广东瑞明电力","Col1":null,"Col2":null,"Col3":null,"Col4":null,"Col5":null},"MessageTime":"2019-10-24T10:37:27","Cate":"Alarm","State":null,"Dgimn":null}}
                  // 预警推送消息  例：{"Message":{"ID":"171f862f-0d5a-4c34-a62b-174ed9d47d6a","ToUserID":null,"FromUserID":null,"UserName":"系统报警","Message":{"alarmValue":6017.819,"ID":"171f862f-0d5a-4c34-a62b-174ed9d47d6a","PointName":"废水出口","PollutantName":"pH值","AlarmTime":"2019-10-24T10:50:00","StandardValue":null,"AlarmCount":7,"AlarmLevel":null,"DGIMN":"51052216080301","PollutantCode":"001","PollutantTypeCode":1,"FirstOverTime":"2019-10-24T10:40:00","AlarmType":"5","AlarmMessage":"[广东瑞明电力-废水出口]于2019-10-24 10:50:00 pH值由于数据超标倍数过大，已经超标，请注意！","DataType":"MinuteData","Level":null,"ExceptionType":"-1","MessageModel":null,"Start":null,"End":null,"PCUrl":null,"AppUrl":null,"MaxMultiple":0.0,"SuggestValue":0.0,"MsgType":0,"ParentCode":"0051264","ParentName":"广东瑞明电力股份有限公司","Abbreviation":"广东瑞明电力","Col1":null,"Col2":null,"Col3":null,"Col4":null,"Col5":null},"MessageTime":"2019-10-24T10:52:23","Cate":"Alarm","State":null,"Dgimn":null}}
                  break;
                case 'Notice':
                  dispatch({
                    type: 'changeAdvises',
                    payload: { message: obj.Message },
                  });
                  break;
                case 'QCACheckBack':
                  // console.log("QCACheckBack=", obj.Message)
                  // 数据提取 - 提取日志
                  dispatch({
                    type: 'dataExtract/updateQCLogResult',
                    payload: obj.Message,
                  });
                  break;
                case 'QCARealTimeData':
                  // console.log("QCARealTimeData=", obj.Message);
                  // CEMS污染物数据
                  dispatch({
                    type: 'qcManual/changePollutantValueListInfo',
                    payload: { message: obj.Message },
                  });
                  // 质控图表数据
                  dispatch({
                    type: 'qcManual/updateRealChartData',
                    payload: { message: obj.Message },
                  });
                  break;
                // 阀门状态
                case 'ControlData':
                  // console.log("ControlData=", obj.Message[0])
                  dispatch({
                    type: 'qcManual/changeQCState',
                    payload: obj.Message[0],
                  })
                  break;
                case 'ControlState':
                  dispatch({
                    type: 'qualityControl/changeQCState',
                    payload: obj.Message[0],
                  })
                  break;
                case 'State':
                  // 质控仪状态
                  dispatch({
                    type: 'qcManual/changeQCStatus',
                    payload: obj.Message[0],
                  })
                  break;
                case 'QCAAlarmMsg':
                  // console.log('msg=',obj)
                  dispatch({
                    type: 'qualityControl/volumeWarning',
                    payload: obj.Message,
                  })
                  dispatch({
                    type: 'changeQCANotices',
                    payload: obj.Message,
                  });
                  break;
                case 'QCARtn': //下发
                  // console.log('msg=',obj)
                  dispatch({
                    type: 'qualitySet/issueData',//同步更新数据
                    payload: obj.Message,
                  })
                  break;
                default:
                  break;
              }
            });
          }
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
