import { message } from 'antd';
import * as services from '../services/components';
import Model from '@/utils/model';
import _ from 'lodash'

export default Model.extend({
  namespace: 'components',
  state: {
    // 站点详情
    siteData: {},
    pointInstrumentList: [],
    pollutantByDgimnList: [],
  },
  effects: {
    // 获取站点详情
    *getSiteInfo({ payload }, { call, update, put, select }) {
      const result = yield call(services.getSiteInfo, payload);
      if (result.IsSuccess) {
        yield update({
          siteData: result.Datas,
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取仪器信息table数据
    *getPointInstrument({ payload }, { call, put, update, select }) {
      const result = yield call(services.getPointInstrument, payload);
      if (result.IsSuccess) {
        yield update({ pointInstrumentList: result.Datas })
      } else {
        message.error(result.Message);
      }
    },
    // 获取污染物信息
    *getPollutantByDgimn({ payload }, { call, put, update, select }) {
      const result = yield call(services.getPollutantByDgimn, payload);
      if (result.IsSuccess) {
        yield update({ pollutantByDgimnList: result.Datas.filter(item => item.IsUse === "1") })
      } else {
        message.error(result.Message);
      }
    },
  },
});
