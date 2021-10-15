
import * as services from '@/services/qcaCheckApi';
import { getPollutantListByDgimn } from "@/services/commonApi"
import Model from '@/utils/model';
import { message } from 'antd';


export default Model.extend({
  namespace: 'qcaCheck',
  state: {
    // 公共
    keyParameterList: [], //关键参数
    qcaLogDataList: [], //质控日志
    valueList: [], // 测量东都
    standValList: [], // 配比标气浓度
    checkModalVisible: false,
    // 响应时间核查
    resTimeCheckTableData: [],
    pollutantList: [],
    // 零点核查
    zeroCheckTableData: [],
    zeroCheck24TableData: [],
    zeroCheckChartAllData: [],
    zeroChartData: {
      PollutantCode: "",
      dataList: [],
      standard: { top: 0, lower: 0 },
      timeList: [],
    },
    rangeChartData: {
      PollutantCode: "",
      dataList: [],
      standard: { top: 0, lower: 0 },
      timeList: [],
    },
    zeroModalVisible: false,
    // 线性核查
    linearCheckChartData: {
      coordMax: [],
      coordMin: [],
      data: [],
      formatter: ""
    }

  },

  effects: {
    // 获取响应时间核查数据
    *getResTimeCheckTableData({ payload, }, { call, update, put, take, select }) {
      const result = yield call(services.getResTimeCheckTableData, payload);
      if (result.IsSuccess) {
        yield update({ resTimeCheckTableData: result.Datas })
      } else {
        message.error(result.Message)
      }
    },
    // 获取污染物类型
    *getPollutantListByDgimn({ payload, }, { call, update, put, take, select }) {
      const result = yield call(getPollutantListByDgimn, { ...payload, dataType: "qca" });
      if (result.IsSuccess) {
        yield update({ pollutantList: result.Datas })
      } else {
        message.error(result.Message)
      }
    },
    // 获取零点核查数据
    *getZeroCheckTableData({ payload, }, { call, update, put, take, select }) {
      const result = yield call(services.getZeroCheckTableData, payload);
      if (result.IsSuccess) {
        yield update({
          zeroCheckTableData: result.Datas.rtnData,
          zeroCheck24TableData: result.Datas.rtnData24,
          zeroCheckChartAllData: result.Datas.codeList,
          zeroChartData: result.Datas.codeList[0] ? result.Datas.codeList[0] : {
            PollutantCode: "",
            dataList: [],
            standard: { top: 0, lower: 0 },
            timeList: [],
          }
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取污染物类型
    *getKeyParameterList({ payload, }, { call, update, put, take, select }) {
      const result = yield call(services.getKeyParameterList, payload);
      if (result.IsSuccess) {
        yield update({ keyParameterList: result.Datas })
      } else {
        message.error(result.Message)
      }
    },
    // 获取质控日志和质控过程
    *getqcaLogAndProcess({ payload, }, { call, update, put, take, select }) {
      const result = yield call(services.getqcaLogAndProcess, payload);
      if (result.IsSuccess) {
        yield update({
          qcaLogDataList: result.Datas.recordList,
          valueList: result.Datas.concent,
          standValList: result.Datas.ratio,
          timeList: result.Datas.timeList,
          linearCheckChartData: {
            coordMax: result.Datas.coordMax,
            coordMin: result.Datas.coordMin,
            formatter: result.Datas.formula,
            data: result.Datas.linearData,
          }
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取量程核查数据
    *getRangeDataList({ payload, }, { call, update, put, take, select }) {
      const result = yield call(services.getRangeDataList, payload);
      if (result.IsSuccess) {
        yield update({
          rangeCheckTableData: result.Datas.rtnData,
          rangeCheck24TableData: result.Datas.rtnData24,
          rangeCheckChartAllData: result.Datas.codeList,
          rangeChartData: result.Datas.codeList[0] ? result.Datas.codeList[0] : {
            PollutantCode: "",
            dataList: [],
            standard: { top: 0, lower: 0 },
            timeList: [],
          }
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取盲样核查数据
    *getBlindDataList({ payload, }, { call, update, put, take, select }) {
      const result = yield call(services.getBlindDataList, payload);
      if (result.IsSuccess) {
        yield update({
          blindCheckTableData: result.Datas.rtnData,
          blindCheckChartAllData: result.Datas.codeList,
          blindChartData: result.Datas.codeList[0] ? result.Datas.codeList[0] : {
            PollutantCode: "",
            dataList: [],
            standard: { top: 0, lower: 0 },
            timeList: [],
          }
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取示值误差核查数据
    *getErrorValueDataList({ payload, }, { call, update, put, take, select }) {
      const result = yield call(services.getErrorValueDataList, payload);
      if (result.IsSuccess) {
        yield update({
          errorValueCheckTableData: result.Datas.rtnData,
          errorValueCheckChartAllData:result.Datas.codeList,
          errorValueChartData: result.Datas.codeList[0] ? result.Datas.codeList[0] : {
            PollutantCode: "",
            dataList: [],
            standard: { top: 0, lower: 0 },
            timeList: [],
          }
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取线性核查数据
    *getLinearDataList({ payload, }, { call, update, put, take, select }) {
      const result = yield call(services.getLinearDataList, payload);
      if (result.IsSuccess) {
        yield update({
          linearCheckTableData: result.Datas.rtnData,
          // linearCheckChartAllData: result.Datas.codeList,
          // linearChartData: result.Datas.codeList[0] ? result.Datas.codeList[0] : {
          //   PollutantCode: "",
          //   dataList: [],
          //   standard: { top: 0, lower: 0 },
          //   timeList: [],
          // }
        })
      } else {
        message.error(result.Message)
      }
    },
    // 核查导出
    *qcaCheckExport({ payload, }, { call, update, put, take, select }) {
      const result = yield call(services[payload.exportType], payload);
      if (result.IsSuccess) {
        window.open(result.Datas)
      } else {
        message.error(result.Message)
      }
    },

  },
  reducers: {
    // 更新chartData
    updateCheckChartData(state, { payload }) {
      let key = payload.type + "CheckChartAllData";
      let checkChartAllData = state[key];
      let chartData = checkChartAllData.find(item => item.PollutantCode === payload.code)
      return {
        ...state,
        [payload.type + "ChartData"]: chartData
      };
    },
  }
});
