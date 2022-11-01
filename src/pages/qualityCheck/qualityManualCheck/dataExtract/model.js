
import * as services from '../services';
import { getPollutantListByDgimn } from "@/services/commonApi"
import Model from '@/utils/model';
import { message } from 'antd';

export default Model.extend({
  namespace: 'dataExtract',
  state: {
    currentDGIMN: "",
    QCLogsStart: {},
    QCLogsAnswer: {},
    QCLogsResult: {},
  },
  effects: {
    // 数据提取
    *sendDataExtract({ payload, callback }, { call, update, put, take, select }) {
      let serviceName = 'sendDataExtract';
      if (payload.Type === 'mins' || payload.Type === 'hour' || payload.Type === 'day') {
        serviceName = 'SendSupplementMsg';
      }
      const result = yield call(services[serviceName], payload);
      if (result.IsSuccess) {
        message.success("操作成功, 请查看提取日志")
        callback && callback()
        // yield update({ bottleDataList: result.Datas, gasData: gasData })
      } else {
        message.error(result.Message)
      }
    },
  },
  reducers: {
    // log - start
    updateQCLogStart(state, { payload }) {
      let QCLogsStart = state.QCLogsStart;
      console.log("start=", payload)
      console.log("state=", state)
      if (payload.DGIMN === state.currentDGIMN) {
        QCLogsStart = payload
      }
      return { ...state, QCLogsStart: QCLogsStart }
    },
    // log - Answer
    updateQCLogAnswer(state, { payload }) {
      console.log("answer=", payload)
      let QCLogsAnswer = state.QCLogsAnswer;
      if (payload.DGIMN === state.currentDGIMN) {
        QCLogsAnswer = payload
      }
      return { ...state, QCLogsAnswer: QCLogsAnswer }
    },
    // log - Result
    updateQCLogResult(state, { payload }) {
      console.log("result=", payload)
      if (payload.DGIMN === state.currentDGIMN) {
        let QCLogsResult = state.QCLogsResult;
        QCLogsResult = payload
        return { ...state, QCLogsResult: QCLogsResult }
      }
      return { ...state }
    },

    // 重置质控仪流程图state
    resetModalState(state, { payload }) {
      return {
        ...state,
        QCLogsStart: {},
        QCLogsAnswer: {},
        QCLogsResult: {},
      }
    }
  }
});
