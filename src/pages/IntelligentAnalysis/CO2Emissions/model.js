import Model from '@/utils/model';
import * as services from './service';
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'CO2Emissions',
  state: {
    Dictionaries: {},
    cementCO2Sum: [],
    cementTableCO2Sum: 0,
    steelCO2Sum: [],
    unitInfoList: [],
  },
  effects: {
    // 获取缺省值码表
    *getCO2EnergyType({ payload, callback }, { call, put, update, select }) {
      const response = yield call(services.getCO2EnergyType, payload);
      if (response.IsSuccess) {
        yield update({
          Dictionaries: response.Datas
        })
      } else {
        yield update({
          Dictionaries: {}
        })
        message.error(response.Message)
      }
    },
    // 水泥排放量汇总
    *getCementCO2Sum({ payload, callback }, { call, put, update, select }) {
      const response = yield call(services.getCementCO2Sum, payload);
      if (response.IsSuccess) {
        yield update({
          cementCO2Sum: response.Datas
        })
      } else {
        message.error(response.Message)
      }
    },
    // 钢铁排放量汇总
    *getSteelCO2Sum({ payload, callback }, { call, put, update, select }) {
      const response = yield call(services.getSteelCO2Sum, payload);
      if (response.IsSuccess) {
        yield update({
          steelCO2Sum: response.Datas
        })
      } else {
        message.error(response.Message)
      }
    },
    // 计算排放量
    *countEmissions({ payload, callback }, { call, put, update, select }) {
      const response = yield call(services.countEmissions, payload);
      if (response.IsSuccess) {
        callback && callback(response.Datas)
      } else {
        // message.error(response.Message)
      }
    },
    // 下载导入模板
    *downloadTemp({ payload, callback }, { call, put, update, select }) {
      const response = yield call(services.downloadTemp, payload);
      if (response.IsSuccess) {
        window.open('/upload' + response.Datas)
      } else {
        message.error(response.Message)
      }
    },
    // 获取排放量合计
    *getCO2TableSum({ payload, callback }, { call, put, update, select }) {
      const response = yield call(services.getCO2TableSum, payload);
      if (response.IsSuccess) {
        yield update({
          cementTableCO2Sum: response.Datas || 0
        })
      } else {
        message.error(response.Message)
      }
    },
    // 判断是否重复 - 是否可添加
    *JudgeIsRepeat({ payload, callback }, { call, put, update, select }) {
      const response = yield call(services.JudgeIsRepeat, payload);
      if (response.IsSuccess) {
        callback && callback(response.Datas)
      } else {
        message.error(response.Message)
      }
    },
    // 获取不确定性默认数据
    *getUnceratianData({ payload, callback }, { call, put, update, select }) {
      const response = yield call(services.getUnceratianData, payload);
      if (response.IsSuccess) {
        callback && callback(response.Datas)
      } else {
        message.error(response.Message)
      }
    },
    // 不确定性计算公式
    *calUnceratianData({ payload, callback }, { call, put, update, select }) {
      debugger
      const response = yield call(services.calUnceratianData, payload);
      if (response.IsSuccess) {
        callback && callback(response.Datas)
      } else {
        message.error(response.Message)
      }
    },
    // 获取机组列表
    *getUnitList({ payload }, { call, put, update, select }) {
      const result = yield call(services.getUnitList, payload);
      if (result.IsSuccess) {
        yield update({ unitInfoList: result.Datas })
      } else {
        message.error(result.Message);
      }
    },
  },
});
