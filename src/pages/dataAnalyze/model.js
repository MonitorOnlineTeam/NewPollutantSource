//运维任务列表
import moment from 'moment';
import * as services from './service';
import Model from '@/utils/model';
import { message } from 'antd';

export default Model.extend({
  namespace: 'dataAnalyze',
  state: {
    pollutantList: [],
    defaultPollutant: [],
    siteParamsData: {
      timeList: [],
      tableList: [],
      chartList: [],
    },
    multiSiteParamsData: {
      timeList: [],
      tableList: [],
      chartList: [],
    },
    pollutantTypeList: [],
    enterpriseList: [],
    dataGainRateColumn: [],
    dataGainRateTableData: []
  },

  effects: {
    // 获取污染物
    *getPollutantList({ payload }, { call, put, update }) {
      const result = yield call(services.getPollutantList, payload);
      if (result.IsSuccess) {
        let defaultValue = [];
        if (result.Datas.length) {
          defaultValue = result.Datas.length >= 2 ? [result.Datas[0].PollutantCode, result.Datas[1].PollutantCode] : [result.Datas[0].PollutantCode]
        }
        yield update({
          pollutantList: result.Datas,
          defaultPollutant: defaultValue
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取图表及表格数据
    *getChartAndTableData({ payload }, { call, put, update }) {
      const result = yield call(services.getChartAndTableData, payload);
      if (result.IsSuccess) {
        if (payload.Type === "0") {
          // 单站多参
          yield update({
            siteParamsData: {
              ...result.Datas
            }
          })
        } else {
          // 多站多参
          yield update({
            multiSiteParamsData: {
              ...result.Datas
            }
          })
        }
      } else {
        message.error(result.Message)
      }
    },
    // 导出
    *export({ payload }, { call, put, update }) {
      const result = yield call(services.exportData, payload);
      if (result.IsSuccess) {
        window.open(result.Datas);
        message.success("导出成功")
      } else {
        message.error(result.Message)
      }
    },
    // 获取系统污染物
    * getPollutantTypeList({
      payload, callback
    }, { call, update, select }) {
      const result = yield call(services.getPollutantTypeList, payload);
      if (result.IsSuccess) {
        yield update({
          pollutantTypeList: result.Datas,
        })
        callback && callback(result)
      }
    },
    // 获取企业
    * getEnterpriseList({
      payload
    }, { call, update, select }) {
      const result = yield call(services.getEnterpriseList, payload);
      if (result.IsSuccess) {
        yield update({
          enterpriseList: result.Datas,
        })
        payload.callback && payload.callback(result)
      }
    },
    // 获取数据获取率 - 表头
    * getDataGainRateColumn({
      payload
    }, { call, update, select }) {
      const result = yield call(services.getDataGainRateColumn, payload);
      if (result.IsSuccess) {
        yield update({
          dataGainRateColumn: result.Datas
        })
      } else {
        message.error(result.Datas)
      }
    },
    // 获取数据获取率 - table数据
    * getDataGainRateTableData({
      payload, callback
    }, { call, update, select }) {
      const result = yield call(services.getDataGainRateTableData, payload);
      if (result.IsSuccess) {
        yield update({
          dataGainRateTableData: result.Datas
        })
        callback && callback()
      } else {
        message.error(result.Datas)
      }
    },

  }
});
