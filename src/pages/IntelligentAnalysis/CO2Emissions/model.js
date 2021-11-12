import Model from '@/utils/model';
import * as services from './service';
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'CO2Emissions',
  state: {
    cementDictionaries: {},
    cementCO2Sum: [],
  },
  effects: {
    // 获取缺省值码表
    *getCO2EnergyType({ payload, callback }, { call, put, update, select }) {
      const response = yield call(services.getCO2EnergyType, payload);
      if (response.IsSuccess) {
        yield update({
          cementDictionaries: response.Datas
        })
      } else {
        yield update({
          cementDictionaries: {}
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
    // 计算排放量
    *countEmissions({ payload, callback }, { call, put, update, select }) {
      const response = yield call(services.countEmissions, payload);
      if (response.IsSuccess) {
        callback && callback(response.Datas)
      } else {
        message.error(response.Message)
      }
    },
  },
});
