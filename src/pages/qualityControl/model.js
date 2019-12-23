/*
 * @Create: Jiaqi
 * @Date: 2019-11-07 10:53:38
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-12-06 09:42:29
 * @desc: 智能质控model
 */

import moment from 'moment';
import { getentandpoint } from '@/services/baseTreeApi';
import Model from '@/utils/model';
import { router } from 'umi'
import { message } from 'antd';
import * as services from './service';
import _ from 'lodash'
// import { EnumRequstResult } from '../utils/enum';

export default Model.extend({
  namespace: 'qualityControl',
  state: {
    entAndPointList: [],
    standardGasList: [],
    qualityControlFormData: {},
    qualityControlTableData: [],
    QCAGasRelation: [],
    CEMSList: [],
    autoQCAInfo: [],
    entRate: {
      allResult: 0,
      noAllResult: 0,
      entName: [],
      entResult: [],
    },
    entStaticDataList: [],
    resultContrastData: {
      valueList: [],
      timeList: [],
      tableData: [],
      standValue: 0,
      errorStr: undefined,
    },
    resultContrastTimeList: [],
    paramsRecordForm: {
      current: 1,
      pageSize: 20,
      time: {
        value: [moment().add(-1, "hour"), moment()]
      },
      total: 0,
    },
    statusRecordForm: {
      current: 1,
      pageSize: 20,
      total: 0,
      BeginTime: moment().add(-1, "hour").format('YYYY-MM-DD HH:mm:ss'),
      EndTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      DataTempletCode: [],
    },
    QCAStatusList: [],
    QCAStatusNameList: [],
    total: 0,
    paramsList: [],
    paramsTableData: [],
    qCAAlarmMsgData: [],
    AlarmTypeList: [],
    // 质控报警记录
    paramsQCAAlarmMsgList: {
      QCAMN: '',
      AlarmType: '',
      BeginTime: moment().format('YYYY-MM-DD 00:00:00'),
      EndTime: moment().format('YYYY-MM-DD 23:59:59'),
      PageIndex: 1,
      PageSize: 10,
      total: 0,
    },
    paramsChartData: {
      TimeList: [],
      DataList: [],
      legendList: [],
    },
    // 质控仪流程图
    qualityControlName: null, // 质控仪名称
    gasData: {  // 气瓶信息
      N2Info: {},
      NOxInfo: {},
      SO2Info: {},
      O2Info: {},
    },
    cemsList: [{}, {}, {}, {}], // CEMS列表
    valveStatus: {}, // 阀门状态
    flowList: {}, // 气瓶流量
    p2Pressure: {},
    p1Pressure: {},
    QCStatus: undefined, // 质控仪状态
    standardValueUtin: null, // 单位
    realtimeStabilizationTime: {}
  },
  effects: {
    // 获取企业及排口
    *getEntAndPointList({ payload }, { call, update, select }) {
      const postData = {
        RunState: '',
        Status: [0, 1, 2, 3],
      }
      let global = yield select(state => state.global);
      if (!global.configInfo) {
        yield take('global/getSystemConfigInfo/@@end');
        global = yield select(state => state.global);
        postData.PollutantTypes = global.configInfo.SystemPollutantType
      } else {
        postData.PollutantTypes = global.configInfo.SystemPollutantType
      }

      const result = yield call(getentandpoint, postData);
      if (result.IsSuccess) {
        yield update({
          entAndPointList: result.Datas,
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取标气
    *getStandardGas({ payload, callback }, { call, put, update }) {
      const result = yield call(services.getStandardGas, payload);
      if (result.IsSuccess) {
        yield update({
          standardGasList: result.Datas,
          // currentPollutantCode: result.Datas.length ? result.Datas[0].PollutantCode : undefined
        })
        yield put({
          type: 'qualityControlModel/changeCurrentPollutantCode',
          payload: result.Datas.length ? result.Datas[0].PollutantCode : undefined,
        })
        callback && callback(result.Datas);
      }
    },
    // 添加质控仪
    *addQualityControl({ payload }, { call, put }) {
      const result = yield call(services.addQualityControl, payload);
      if (result.IsSuccess) {
        router.push('/qualityControl/instrumentManage')
        message.success('添加成功！')
      } else {
        message.error(result.Message)
      }
    },
    // 获取质控仪数据
    *getQualityControlData({ payload }, { call, put, update }) {
      const result = yield call(services.getQualityControlData, payload);
      if (result.IsSuccess) {
        let qualityControlTableData = [];
        let QCAGasRelation = [];
        if (result.Datas.Relation) {
          qualityControlTableData = result.Datas.Relation.map((item, index) => {
            let Component = [];
            Component = item.Component.map((itm, idx) => ({
              ...itm,
              key: `${index}${idx}`,
            }))
            return {
              ...item,
              DGIMNArr: item.DGIMN.split('/'),
              key: index,
              Component: [
                ...Component,
              ],
            }
          })
        }
        if (result.Datas.QCAGasRelation) {
          QCAGasRelation = result.Datas.QCAGasRelation.map((itm, idx) => ({
            ...itm,
            key: `${itm.ID}${idx}`,
            unit: itm.StandardGasCode === "s01" ? "%" : 'mg/m3',
          }))
        }
        console.log('qualityControlTableData=', qualityControlTableData)
        yield update({
          qualityControlFormData: result.Datas.Info,
          qualityControlTableData,
          QCAGasRelation,
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取CEMS列表
    *getCEMSList({ payload }, { call, put, update }) {
      const result = yield call(services.getCEMSList, payload);
      if (result.IsSuccess) {
        yield update({
          CEMSList: [
            ...result.Datas,
            // {
            //   DGIMN: "test1",
            //   PointName: "test1",
            //   MNHall: "test1",
            // }, {
            //   DGIMN: "test2",
            //   PointName: "test2",
            //   MNHall: "test2",
            // },
          ],
        })
      }
    },
    // 发送质控命令
    * SendQCACmd({ payload, success }, { call, put, update }) {
      // if (payload.QCType == "3") {
      //   yield update({
      //     sendQCACmd3Loading: true
      //   })
      // }
      // if (payload.QCType == "4") {
      //   yield update({
      //     sendQCACmd4Loading: true
      //   })
      // }
      // if (payload.QCType == "5") {
      //   yield update({
      //     sendQCACmd5Loading: true
      //   })
      // }
      const result = yield call(services.SendQCACmd, payload);
      if (result.IsSuccess) {
        message.success('操作成功')
        success && success()
        // yield update({
        //   sendQCACmd3Loading: false,
        //   sendQCACmd4Loading: false,
        //   sendQCACmd5Loading: false
        // })
      } else {
        message.error(result.Message)
        // yield update({
        //   sendQCACmd3Loading: false,
        //   sendQCACmd4Loading: false,
        //   sendQCACmd5Loading: false
        // })
      }
    },
    // 获取自动质控信息
    * getAutoQCAInfo({ payload }, { call, put, update }) {
      const result = yield call(services.getAutoQCAInfo, payload);
      if (result.IsSuccess) {
        yield update({
          autoQCAInfo: result.Datas,
        })
      } else {
        message.error(result.Message)
      }
    },
    // 取消自动质控计划
    * cancelPlan({ payload }, { call, put, update }) {
      const result = yield call(services.cancelPlan, payload);
      if (result.IsSuccess) {
        message.success('取消成功');
        yield put({
          type: 'qualityControl/getAutoQCAInfo',
          payload: {
            qcamn: payload.QCAMN,
          },
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取企业达标率
    * QCAResultStatic({ payload, callback, searchType }, { call, put, update }) {
      const result = yield call(services.QCAResultStatic, payload);
      if (result.IsSuccess) {
        const { entResult } = result.Datas;
        entResult.map((item, index) => {
          entResult[index] = (item * 100).toFixed(2);
        })
        yield update({
          entRate: {
            ...result.Datas,
            entResult,
          },
        })
        if (!searchType) {
          message.success('操作成功')
        }
        callback && callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    // 获取单个企业统计数据
    * QCAResultStaticByEntCode({ payload }, { call, put, update }) {
      const result = yield call(services.QCAResultStaticByEntCode, payload);
      if (result.IsSuccess) {
        yield update({
          // entRate: result.Datas
          entStaticDataList: result.Datas,
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取结果比对数据
    * QCAResultCheckByDGIMN({ payload, otherParams }, { call, put, update }) {
      const result = yield call(services.QCAResultCheckByDGIMN, payload);
      if (result.IsSuccess) {
        if (otherParams.isSearch) {
          message.success('结果比对完成！')
        }
        // 获取稳定时间
        yield put({
          type: "getStabilizationTime",
          payload: {
            DGIMN: payload.DGIMN,
            QCAMN: payload.QCAMN,
            StandardGasCode: payload.PollutantCode,
          },
          data: result.Datas.timeList && result.Datas.timeList
        })
        yield update({
          resultContrastData: result.Datas,
          chartMax: _.max(result.Datas.valueList) ? _.max(result.Datas.valueList) * 1 + 10 : undefined
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取结果比对时间下拉列表
    * QCAResultCheckSelectList({ payload, otherParams }, { call, put, update }) {
      const result = yield call(services.QCAResultCheckSelectList, payload);
      if (result.IsSuccess) {
        yield update({
          resultContrastTimeList: result.Datas,
        })
      } else {
        message.error(result.Message)
      }
    },
    /**
     * xpy
     * 获取质控仪状态列表
     */
    * QCAStatusByDGIMN({
      payload,
    }, {
      call,
      update,
      select,
    }) {
      const statusRecordForm = yield select(state => state.qualityControl.statusRecordForm);
      const result = yield call(services.QCAStatusByDGIMN, statusRecordForm);
      if (result.IsSuccess) {
        yield update({
          QCAStatusList: result.Datas,
          statusRecordForm: {
            ...statusRecordForm,
            total: result.Total,
          },
        })
      } else {
        message.error(result.Message)
      }
    },
    /**
     * xpy
     * 获取质控仪状态名称列表
    */
    * QCAStatusName({
      payload,
    }, {
      call,
      update,
    }) {
      const result = yield call(services.QCAStatusName, payload);
      if (result.IsSuccess) {
        yield update({
          QCAStatusNameList: result.Datas,
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取结果比对时间下拉列表
    * QCAResultCheckSelectList({ payload, otherParams }, { call, put, update }) {
      const result = yield call(services.QCAResultCheckSelectList, payload);
      if (result.IsSuccess) {
        yield update({
          resultContrastTimeList: result.Datas,
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取参数列表
    * getParamsList({ payload, otherParams }, { call, put, update }) {
      const result = yield call(services.getDataTempletList, payload);
      if (result.IsSuccess) {
        yield update({
          paramsList: result.Datas,
        })
      } else {
        message.error(result.Message)
      }
    },
    //  获取参数记录表格数据
    * getParamsTableData({ payload, otherParams }, { call, put, update, select }) {
      const paramsRecordForm = yield select(state => state.qualityControl.paramsRecordForm);
      const postData = {
        State: 1,
        pageIndex: paramsRecordForm.current,
        pageSize: paramsRecordForm.pageSize,
        Code: paramsRecordForm.DataTempletCode && paramsRecordForm.DataTempletCode.value.toString(),
        BeginTime: paramsRecordForm.time && paramsRecordForm.time.value[0] && moment(paramsRecordForm.time.value[0]).format('YYYY-MM-DD HH:mm:ss'),
        EndTime: paramsRecordForm.time && paramsRecordForm.time.value[1] && moment(paramsRecordForm.time.value[1]).format('YYYY-MM-DD HH:mm:ss'),
        status: paramsRecordForm.status && paramsRecordForm.status.value,
        ...payload,
      }
      console.log('postData=', postData)
      const result = yield call(services.getParamsTableData, postData);
      if (result.IsSuccess) {
        yield update({
          paramsTableData: [
            ...result.Datas.rtnVal,
          ],
          paramsRecordForm: {
            ...paramsRecordForm,
            total: result.Total,
          },
        })
      } else {
        message.error(result.Message)
      }
    },
    //  获取参数记录图表数据
    * getParamsChartData({ payload, otherParams }, { call, put, update, select }) {
      const paramsRecordForm = yield select(state => state.qualityControl.paramsRecordForm);
      const postData = {
        State: 0,
        BeginTime: paramsRecordForm.time && paramsRecordForm.time.value[0] && moment(paramsRecordForm.time.value[0]).format('YYYY-MM-DD HH:mm:ss'),
        EndTime: paramsRecordForm.time && paramsRecordForm.time.value[1] && moment(paramsRecordForm.time.value[1]).format('YYYY-MM-DD HH:mm:ss'),
        Code: paramsRecordForm.DataTempletCode && paramsRecordForm.DataTempletCode.value.toString(),
        ...payload,
      }
      // console.log("postData123213=", postData)
      // return;
      const result = yield call(services.getParamsChartData, postData);
      if (result.IsSuccess) {
        // 处理图例
        const legendList = [];
        result.Datas.dataList.map(item => {
          legendList.push(item.name)
        })
        yield update({
          paramsChartData: {
            // ...result.Datas,
            TimeList: result.Datas.timeList,
            DataList: result.Datas.dataList,
            legendList,
          },
        })
      } else {
        message.error(result.Message)
      }
    },

    //  获取质控报警列表
    * GetQCAAlarmMsgList({ payload, otherParams }, { call, put, update, select }) {
      const paramsQCAAlarmMsgList = yield select(state => state.qualityControl.paramsQCAAlarmMsgList);
      debugger
      const result = yield call(services.GetQCAAlarmMsgList, paramsQCAAlarmMsgList);
      if (result.IsSuccess) {
        yield update({
          qCAAlarmMsgData: result.Datas,
          paramsQCAAlarmMsgList: {
            ...paramsQCAAlarmMsgList,
            total: result.Total,
          },
        })
      } else {
        message.error(result.Message)
      }
    },
    //  获取质控报警类型列表
    * getAlarmType({ payload, otherParams }, { call, put, update, select }) {
      const result = yield call(services.getAlarmType, {});
      if (result.IsSuccess) {
        yield update({
          AlarmTypeList: result.Datas,
        })
      } else {
        message.error(result.Message)
      }
    },

    // 获取稳定时间
    * getStabilizationTime({ payload, data, form }, { call, put, update, select }) {
      const result = yield call(services.getStabilizationTime, payload);
      // console.log('123123123123=', aaa)
      if (result.IsSuccess) {
        if (form === "realtime") {
          // 实时
          yield update({
            realtimeStabilizationTime: result.Datas || {},
          })
        } else {
          // 历史
          let timeData = [...data];
          if (timeData) {
            let n = moment(timeData[0]).add(result.Datas.StabilizationTime, "minutes").valueOf()
            timeData.sort(function (a, b) {
              return Math.abs(moment(a).valueOf() - n) - Math.abs(moment(b).valueOf() - n);
            })[0];
          }
          yield update({
            stabilizationTime: timeData[0],
          })
        }
      } else {
        message.error(result.Message)
      }
    },
    // 获取质控流程图基础数据
    *getCemsAndStandGasState({ payload }, { call, put, update }) {
      const result = yield call(services.getCemsAndStandGasState, payload);
      if (result.IsSuccess) {
        let gasData = {};
        let cemsList = [{}, {}, {}, {}];
        if (result.Datas) {
          // 处理标气数据
          if (result.Datas.GasList) {
            let n2 = result.Datas.GasList.find(item => item.StandardGasCode === "065")
            let NOx = result.Datas.GasList.find(item => item.StandardGasCode === "03")
            let SO2 = result.Datas.GasList.find(item => item.StandardGasCode === "02")
            let O2 = result.Datas.GasList.find(item => item.StandardGasCode === "s01")
            gasData = {
              N2Info: n2 || {},
              NOxInfo: NOx || {},
              SO2Info: SO2 || {},
              O2Info: O2 || {},
            }
            console.log("gasData=", gasData)
          }
          // 处理CEMS数据
          if (result.Datas.CemsList) {
            result.Datas.CemsList.map(item => {
              cemsList[item.MNHall - 1] = item
            })
          }
          if (result.Datas.CemsList.length === 1) {
            yield put({
              type: "qualityControlModel/updateState",
              payload: {
                currentDGIMN: result.Datas.CemsList[0].DGIMN
              }
            })
          }
        }
        yield update({
          gasData: gasData,
          cemsList: cemsList,
          qualityControlName: result.Datas.Center,
          DeviceStatus: result.Datas.DeviceStatus
        })
      } else {
        message.error(result.Message)
      }
    }
  },
  reducers: {
    // 质控仪流程图 - 状态
    changeQCState(state, { payload }) {
      if (state.currentQCAMN) {
        if (payload.DataGatherCode === state.currentQCAMN) {
          console.log("payload=", payload)
          let ValveStatus = state.valveStatus;
          let code = payload.Code.replace("i", "")
          const value = payload.Value ? payload.Value * 1 : 0;
          if (code === "32002") {
            // 门状态
            ValveStatus.door = payload.Value
          }
          if (code === "32006") {
            // O2配气阀门
            ValveStatus.O2 = value
          }
          if (code === "32004") {
            // SO2配气阀门
            ValveStatus.SO2 = value
          }
          if (code === "32005") {
            // NOx配气阀门
            ValveStatus.NOx = value
          }
          if (code === "32007") {
            // N2配气阀门
            ValveStatus.N2 = value
          }
          if (code === "32008") {
            // 吹扫阀门
            ValveStatus.purge = value
          }



          // p1/p2 压力
          let p2Pressure = state.p2Pressure;
          let p1Pressure = state.p1Pressure;
          if (code === "33502") {
            // p2气瓶压力
            p2Pressure = {
              value: payload.Value + "",
              isException: payload.IsException,
              pollutantCode: payload.PollutantCode
            };

          }
          if (code === "33503") {
            // p1气瓶压力
            p1Pressure = {
              value: payload.Value + "",
              isException: payload.IsException,
              pollutantCode: payload.PollutantCode
            };
          }

          let flowList = state.flowList;
          // 气瓶流量
          if (code === "33513") {
            flowList[payload.PollutantCode] = payload.Value
          }
          // N2流量
          if (code === "33515") {
            flowList["N2"] = payload.Value
          }
          // 标气浓度
          let standardValue = state.standardValue;
          let standardValueUtin = state.standardValueUtin;
          if (code === "33510") {
            if (payload.PollutantCode === "03" || payload.PollutantCode === "02") {
              standardValueUtin = "mg/m3"
            }
            if (payload.PollutantCode === "s01") {
              standardValueUtin = "%"
            }
            standardValue = payload.Value;
          }

          return {
            ...state,
            flowList: flowList,
            valveStatus: ValveStatus,
            p2Pressure: p2Pressure || state.p2Pressure,
            p1Pressure: p1Pressure || state.p1Pressure,
            standardValue: standardValue,
            standardValueUtin: standardValueUtin
          }
        }
      }
      if (state.cemsList.length) {
        let code = payload.Code.replace("i", "")
        // CEMS阀门状态
        if (code === "32009" || code === "32013") {
          let cemsList = state.cemsList.map(item => {
            if (item.DGIMN == payload.DataGatherCode) {
              console.log("payload12312312=", payload)
              if (code === "32013") {
                return {
                  ...item,
                  isException: payload.IsException
                }
              }
              return {
                ...item,
                valve: payload.Value
              }
            } else {
              return { ...item }
            }
          })
          return {
            ...state,
            cemsList
          }
        }
      }
      return { ...state }
    },
    // 质控仪状态
    changeQCStatus(state, { payload }) {
      if (state.currentQCAMN) {
        let filterQC = payload.filter(item => item.DataGatherCode === state.currentQCAMN);
        return {
          ...state,
          QCStatus: filterQC[0].Status
        }
      }
      return { ...state }
    },
    // 质控仪浓度
    changeCEMSMonitorValue(state, { payload }) {
      if (state.cemsList.length) {
        let cemsList = state.cemsList.map(item => {
          if (item.DGIMN == payload.DGIMN) {
            return {
              ...item,
              monitorValue: payload.MonitorValue
            }
          }
          return { ...item }
        })
        return {
          ...state,
          cemsList
        }
      }
      return { ...state }
    },
    // 余量报警
    volumeWarning(state, { payload }) {
      let gasData = state.gasData;
      let { N2Info, NOxInfo, SO2Info, O2Info } = gasData;
      payload.map(item => {
        if (item.Type === "7") {
          if (item.Code === "02") {
            SO2Info.msg = item.Msg;
          }
          if (item.Code === "03") {
            NOxInfo.msg = item.Msg
          }
          if (item.Code === "065") {
            N2Info.msg = item.Msg
          }
          if (item.Code === "s01") {
            O2Info.msg = item.Msg
          }
        }
      })
      return {
        ...state,
        gasData: {
          N2Info, NOxInfo, SO2Info, O2Info
        }
      }
    },
    // 重置质控仪流程图state
    resetState(state, { payload }) {
      return {
        ...state,
        qualityControlName: null, // 质控仪名称
        gasData: {  // 气瓶信息
          N2Info: {},
          NOxInfo: {},
          SO2Info: {},
          O2Info: {},
        },
        cemsList: [{}, {}, {}, {}], // CEMS列表
        valveStatus: {}, // 阀门状态
        flowList: {}, // 气瓶流量
        p2Pressure: {},
        p1Pressure: {},
        QCStatus: undefined,  // 质控仪状态}
        ...payload
      }
    }
  }
});
