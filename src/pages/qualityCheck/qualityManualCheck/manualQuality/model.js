
import * as services from '../services';
import { getPollutantListByDgimn } from "@/services/commonApi"
import Model from '@/utils/model';
import { message } from 'antd';
import moment from 'moment';

export default Model.extend({
  namespace: 'qcManual',
  state: {
    currentDGIMN: "",
    currentPollutantCode: "",
    bottleDataList: [],
    qcImageVisible: false,
    // qcImageVisible: true,
    // 质控仪流程图
    qualityControlName: null, // 质控仪名称
    gasData: {  // 气瓶信息
      N2Info: {},
      NOxInfo: {},
      SO2Info: {},
      O2Info: {},
    },
    CEMSOpen: undefined,// CEMS阀门状态
    CEMSStatus: undefined, // CEMS通信状态
    valveStatus: {}, // 阀门状态
    p2Pressure: {},
    p1Pressure: {},
    p3Pressure: {},
    p4Pressure: {},
    p1Exception: '0',
    p2Exception: '0',
    p3Exception: '0',
    p4Exception: '0',
    QCStatus: '0', // 质控仪状态
    standardValueUtin: null, // 单位
    pollutantValueListInfo: [],
    realtimeStabilizationTime: {},
    QCAResultLoading: false, // 质控结果loading
    QCLogsStart: {},
    QCLogsAnswer: {},
    QCLogsResult: {
      Data: {},
    },
    timeList: [],
    valueList: [],
    standardValueList: [],
    marginData: {},
  },
  effects: {
    // 获取气瓶数据
    *getBottleDataList({ payload, }, { call, update, put, take, select }) {
      const result = yield call(services.getBottleDataList, { ...payload, State: 1 });
      if (result.IsSuccess) {
        let gasData = {};
        result.Datas.map(item => {
          if (item.GasCode === "a21026") {
            gasData.SO2Info = {
              Concentration: item.Value,
              ExpirationDate: item.LoseDate ? moment(item.LoseDate).format("YYYY-MM-DD") : "",
              VolumeValue: item.Volume,
            }
          }
          if (item.GasCode === "a21002") {
            gasData.NOxInfo = {
              Concentration: item.Value,
              ExpirationDate: item.LoseDate ? moment(item.LoseDate).format("YYYY-MM-DD") : "",
              VolumeValue: item.Volume,
            }
          }
          if (item.GasCode === "n00000") {
            gasData.N2Info = {
              Concentration: item.Value,
              ExpirationDate: item.LoseDate ? moment(item.LoseDate).format("YYYY-MM-DD") : "",
              VolumeValue: item.Volume,
            }
          }
          if (item.GasCode === "a19001") {
            gasData.O2Info = {
              Concentration: item.Value,
              ExpirationDate: item.LoseDate ? moment(item.LoseDate).format("YYYY-MM-DD") : "",
              VolumeValue: item.Volume,
            }
          }
        })
        console.log("gasData=", gasData)
        yield update({
          bottleDataList: result.Datas, gasData: {
            N2Info: {},
            NOxInfo: {},
            SO2Info: {},
            O2Info: {},
            ...gasData
          }
        })
      } else {
        message.error(result.Message)
      }
    },
    // 发送核查命令
    *sendQCACheckCMD({ payload, callback }, { call, update, put, take, select }) {
      yield update({ QCAResultLoading: true })
      const result = yield call(services.sendQCACheckCMD, payload);
      if (result.IsSuccess) {
        yield update({
          // 质控仪流程图
          qualityControlName: null, // 质控仪名称
          CEMSOpen: undefined,// CEMS阀门状态
          CEMSStatus: undefined,
          valveStatus: {}, // 阀门状态
          p2Pressure: {},
          p1Pressure: {},
          p3Pressure: {},
          p4Pressure: {},
          QCStatus: undefined, // 质控仪状态
          standardValue: undefined,
          standardValueUtin: null, // 单位
          totalFlow: undefined,
          pollutantValueListInfo: [],
          realtimeStabilizationTime: {},
          QCAResultLoading: false, // 质控结果loading
          // QCLogsStart: {},
          QCLogsAnswer: {},
          QCLogsResult: {
            Data: {},
          },
          timeList: [],
          valueList: [],
          standardValueList: [],
        })
        callback && callback()
        message.success("命令发送成功");
        yield update({ QCAResultLoading: true })
      } else {
        yield update({ QCAResultLoading: false })
        message.error(result.Message)
      }
    },
    // 获取状态和质控记录信息
    *getStateAndRecord({ payload }, { call, update, put, take, select }) {
      const result = yield call(services.getStateAndRecord, payload);
      if (result.IsSuccess) {
        let marginData = {};
        marginData["a19001"] = result.Datas[0].o2
        marginData["a21002"] = result.Datas[0].nox
        marginData["a21026"] = result.Datas[0].so2
        marginData["n00000"] = result.Datas[0].n2
        let updateObj = {};
        updateObj.QCStatus = result.Datas[0].State + "";
        // 判断是否正在质控中
        if (updateObj.QCStatus == "1") {
          updateObj.QCAResultLoading = true;
        }
        if (result.Datas[1]) {
          updateObj.QCLogsStart = result.Datas[1];
          updateObj.currentPollutantCode = result.Datas[1].PollutantCode;
          updateObj.currentDGIMN = result.Datas[1].DGIMN;
        }
        if (result.Datas[2]) {
          updateObj.QCLogsAnswer = result.Datas[2];
          updateObj.currentPollutantCode = result.Datas[2].PollutantCode;
          updateObj.currentDGIMN = result.Datas[2].DGIMN;
        }
        if (result.Datas[3]) {
          updateObj.QCLogsResult = result.Datas[3];
          updateObj.currentDGIMN = result.Datas[3].DGIMN;
        }
        yield update({ ...updateObj, marginData })
      } else {
        message.error(result.Message)
      }
    },
    // 获取余量
    *getMargin({ payload }, { call, update, put, take, select }) {
      const result = yield call(services.getStateAndRecord, payload);
      if (result.IsSuccess) {
        let marginData = {};
        marginData["a19001"] = result.Datas[0].o2
        marginData["a21002"] = result.Datas[0].nox
        marginData["a21026"] = result.Datas[0].so2
        marginData["n00000"] = result.Datas[0].n2
        yield update({ marginData: marginData })
      } else {
        message.error(result.Message)
      }
    },
    // 获取盲样核查浓度范围
    *getSampleRangeFlow({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.getSampleRangeFlow, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    // *resetModalState({ payload, callback }, { call, update, put, take, select }) {
    //   yeild put({
    //     type: "resetState",
    //   })
    // }
  },
  reducers: {
    // 质控仪流程图 - 状态
    changeQCState(state, { payload }) {
      // console.log('currentDGIMN=', thi)
      if (state.currentDGIMN) {
        if (payload.DataGatherCode === state.currentDGIMN) {
          console.log("changeQCState=", payload)
          let ValveStatus = state.valveStatus;
          let totalFlow = state.totalFlow;
          let CEMSOpen = state.CEMSOpen;
          let code = payload.Code.replace("i", "")
          const value = payload.Value ? payload.Value * 1 : 0;
          if (code === "32002") {
            // 门状态
            ValveStatus.door = payload.Value
          }
          if (code === "33066") {
            // O2配气阀门
            ValveStatus.O2 = value
          }
          if (code === "33064") {
            // SO2配气阀门
            ValveStatus.SO2 = value
          }
          if (code === "33065") {
            // NOx配气阀门
            ValveStatus.NOx = value
          }
          if (code === "33067") {
            // N2配气阀门
            ValveStatus.N2 = value
          }
          if (code === "33069") {
            // 吹扫阀门
            ValveStatus.purge = value
          }

          if (code === "33068") {
            // CEMS阀门
            CEMSOpen = value
          }

          if (code === "32009") {
            // CEMS通信状态
            CEMSStatus = value
          }

          // if (code === "32018") {
          //   // 泵配气阀状态
          //   ValveStatus.Air = value
          // }

          // if (code === "32019") {
          //   // 泵通电状态
          //   ValveStatus.Pump = value
          // }

          // 配气流量
          if (code === "33042") {
            totalFlow = payload.Value
          }

          // p1/p2 压力
          let p2Pressure = state.p2Pressure;
          let p1Pressure = state.p1Pressure;
          let p3Pressure = state.p3Pressure;
          let p4Pressure = state.p4Pressure;
          if (code === "33043") {
            // p2气瓶压力
            p2Pressure = {
              value: payload.Value + "",
              // isException: payload.IsException,
              pollutantCode: payload.PollutantCode
            };
          }
          if (code === "33046") {
            // p1气瓶压力
            p1Pressure = {
              value: payload.Value + "",
              // isException: payload.IsException,
              pollutantCode: payload.PollutantCode
            };
          }

          if (code === "33044") {
            // p3气瓶压力
            p3Pressure = {
              value: payload.Value + "",
              // isException: payload.IsException,
              pollutantCode: payload.PollutantCode
            };
          }

          if (code === "33045") {
            // p4气瓶压力
            p4Pressure = {
              value: payload.Value + "",
              // isException: payload.IsException,
              pollutantCode: payload.PollutantCode
            };
          }


          // 标气浓度
          let standardValue = state.standardValue;
          let standardValueUtin = state.standardValueUtin;
          let newStandardValueList = [...state.standardValueList];
          if (code === "33040") {
            if (payload.PollutantCode === "a21026" || payload.PollutantCode === "a21002") {
              standardValueUtin = "mg/m3"
            }
            if (payload.PollutantCode === "a19001") {
              standardValueUtin = "%"
            }
            standardValue = payload.Value;
            newStandardValueList.push(payload.Value)
          }

          return {
            ...state,
            valveStatus: ValveStatus,
            CEMSOpen: CEMSOpen,
            p2Pressure: p2Pressure || state.p2Pressure,
            p1Pressure: p1Pressure || state.p1Pressure,
            p3Pressure: p3Pressure || state.p3Pressure,
            p4Pressure: p4Pressure || state.p4Pressure,
            standardValue: standardValue,
            standardValueUtin: standardValueUtin,
            totalFlow: totalFlow,
            standardValueList: newStandardValueList
          }
        }
      }
      // if (state.cemsList.length) {
      //   let code = payload.Code.replace("i", "")
      //   // CEMS阀门状态
      //   if (code === "32009" || code === "32013") {
      //     let cemsList = state.cemsList.map(item => {
      //       if (item.DGIMN == payload.DataGatherCode) {
      //         if (code === "32013") {
      //           return {
      //             ...item,
      //             isException: payload.IsException
      //           }
      //         }

      //         return {
      //           ...item,
      //           valve: payload.Value
      //         }
      //       } else {
      //         return { ...item }
      //       }
      //     })
      //     return {
      //       ...state,
      //       cemsList
      //     }
      //   }
      // }
      return { ...state }
    },
    // 更新污染物值
    changePollutantValueListInfo(state, { payload }) {
      if (payload.message[0].DGIMN === state.currentDGIMN) {
        console.log('changePollutantValueListInfo=', payload.message)
        return {
          ...state,
          pollutantValueListInfo: payload.message
        }
      }
      return { ...state }
    },
    // 质控仪状态
    changeQCStatus(state, { payload }) {
      if (payload.DataGatherCode === state.currentDGIMN) {
        let QCAResultLoading = state.QCAResultLoading;
        let QCStatus = state.QCStatus;
        if (payload.Code === "i32002") {
          QCStatus = payload.Value;
          if (payload.Value == 1) {
            QCAResultLoading = true
          } else {
            QCAResultLoading = false
          }
        }
        // 压力异常
        let p2Exception = state.p2Exception;
        let p1Exception = state.p1Exception;
        let p3Exception = state.p3Exception;
        let p4Exception = state.p4Exception;
        if (payload.Code === "i32003") {
          console.log('32003=', payload)
          // p2气瓶压力
          p2Exception = payload.Value
        }
        if (payload.Code === "i32006") {
          console.log('32006=', payload)
          // p1气瓶压力
          p1Exception = payload.Value
        }

        if (payload.Code === "i32004") {
          console.log('32004=', payload)
          // p3气瓶压力
          p3Exception = payload.Value
        }

        if (payload.Code === "i32005") {
          console.log('32005=', payload)
          // p4气瓶压力
          p4Exception = payload.Value
        }

        return {
          ...state,
          QCStatus: QCStatus,
          QCAResultLoading: QCAResultLoading,
          p2Exception,
          p1Exception,
          p3Exception,
          p4Exception,
        }
      }
      return { ...state }
    },
    // log - start
    updateQCLogStart(state, { payload }) {
      let QCLogsStart = state.QCLogsStart;
      let QCLogsResult = state.QCLogsResult;
      debugger
      console.log("updateQCLogStart=", payload)
      if (payload.DGIMN === state.currentDGIMN) {
        QCLogsStart = payload;
        QCLogsResult = { Data: {} };
      }
      // 收到开始消息后情况结果数据
      return { ...state, QCLogsStart: QCLogsStart, QCLogsResult: QCLogsResult }
    },
    // log - Answer
    updateQCLogAnswer(state, { payload }) {
      console.log("updateQCLogAnswer=", payload)
      let QCLogsAnswer = state.QCLogsAnswer;
      let QCAResultLoading = state.QCAResultLoading;
      debugger
      if (payload.Result === false) {
        QCAResultLoading = false;
      }
      if (payload.DGIMN === state.currentDGIMN) {
        QCLogsAnswer = payload
      }
      return { ...state, QCLogsAnswer: QCLogsAnswer, QCAResultLoading: QCAResultLoading }
    },
    // log - Result
    updateQCLogResult(state, { payload }) {
      console.log("updateQCLogResult=", payload)
      debugger
      if (payload.DGIMN === state.currentDGIMN) {
        let QCLogsResult = state.QCLogsResult;
        let QCAResultLoading = state.QCAResultLoading;
        QCLogsResult = payload
        QCAResultLoading = false;
        return { ...state, QCLogsResult: QCLogsResult, QCAResultLoading: false }
      }
      return { ...state }
    },
    // 图表数据
    updateRealChartData(state, { payload }) {
      let newTimeList = [...state.timeList];
      let newValueList = [...state.valueList];
      // let newStandardValueList = [...state.standardValueList];
      let realtimeData = payload.message;

      if (state.currentPollutantCode && state.currentDGIMN) {
        if (realtimeData[0].DGIMN === state.currentDGIMN) {
          const filterPollutantCode = realtimeData.find(item => item.PollutantCode === state.currentPollutantCode);
          // 污染物
          newValueList.push(filterPollutantCode.MonitorValue);
          newTimeList.push(filterPollutantCode.MonitorTime);
          // newStandardValueList.push(filterPollutantCode.QCAStandardValue)
        }
      }
      console.log("newValueList =", newValueList)
      console.log("newTimeList =", newTimeList)
      return {
        ...state,
        timeList: newTimeList,
        valueList: newValueList,
        // standardValueList: newStandardValueList
      }

      //   const filterDGIMNList = realtimeData.filter(item => item.DGIMN === state.currentDGIMN);
      //   DGIMNList = [
      //     ...DGIMNList,
      //     ...filterDGIMNList
      //   ]
      //   // if (DGIMNList.length > 40) {
      //   //   DGIMNList = DGIMNList.slice(payload.message.length)
      //   // }
      //   if (DGIMNList.length > 20) {
      //     start += payload.message.length
      //     end += payload.message.length;
      //   }
      //   // let filterChartData = DGIMNList.filter(item => item.PollutantCode === state.currentPollutantCode)
      //   let filterChartData = DGIMNList;
      //   // 污染物
      //   filterChartData.map(item => {
      //     newValueList.push(item.MonitorValue);
      //     newTimeList.push(item.MonitorTime);
      //     newStandardValueList.push(item.QCAStandardValue)
      //     newTableData.push(
      //       {
      //         Time: item.MonitorTime,
      //         Value: item.MonitorValue,
      //         StandValue: item.QCAStandardValue,
      //       }
      //     )
      //   })
      // }
      // return {
      //   ...state,
      //   timeList: [
      //     ...newTimeList
      //   ],
      //   valueList: [
      //     ...newValueList
      //   ],
      //   DGIMNList: [
      //     ...DGIMNList
      //   ],
      //   tableData: [
      //     ...newTableData
      //   ],
      //   standardValueList: newStandardValueList,
      //   // start, end
      // }
    },
    // // 余量报警
    // volumeWarning(state, { payload }) {
    //   let gasData = state.gasData;
    //   let { N2Info, NOxInfo, SO2Info, O2Info } = gasData;
    //   payload.map(item => {
    //     if (item.Type === "7") {
    //       if (item.Code === "02") {
    //         SO2Info.msg = item.Msg;
    //       }
    //       if (item.Code === "03") {
    //         NOxInfo.msg = item.Msg
    //       }
    //       if (item.Code === "065") {
    //         N2Info.msg = item.Msg
    //       }
    //       if (item.Code === "s01") {
    //         O2Info.msg = item.Msg
    //       }
    //     }
    //   })
    //   return {
    //     ...state,
    //     gasData: {
    //       N2Info, NOxInfo, SO2Info, O2Info
    //     }
    //   }
    // },
    // 重置质控仪流程图state
    resetModalState(state, { payload }) {
      return {
        ...state,
        // 质控仪流程图
        qualityControlName: null, // 质控仪名称
        // gasData: {  // 气瓶信息
        //   N2Info: {},
        //   NOxInfo: {},
        //   SO2Info: {},
        //   O2Info: {},
        // },
        CEMSOpen: undefined,// CEMS阀门状态
        CEMSStatus: undefined,
        valveStatus: {}, // 阀门状态
        p2Pressure: {},
        p1Pressure: {},
        p3Pressure: {},
        p4Pressure: {},
        QCStatus: undefined, // 质控仪状态
        standardValue: undefined,
        standardValueUtin: null, // 单位
        totalFlow: undefined,
        pollutantValueListInfo: [],
        realtimeStabilizationTime: {},
        QCAResultLoading: false, // 质控结果loading
        QCLogsStart: {},
        QCLogsAnswer: {},
        QCLogsResult: {
          Data: {},
        },
        timeList: [],
        valueList: [],
        standardValueList: [],
      }
    }
  }
});
