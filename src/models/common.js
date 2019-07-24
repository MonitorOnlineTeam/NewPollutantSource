import { message } from 'antd';
import * as services from '../services/commonApi';
import Model from '@/utils/model';

export default Model.extend({
  namespace: 'common',
  state: {
    pollutantTypelist: [],
    defaultPollutantCode: null,
    enterpriseAndPointList: [],
    level: null,
  },

  effects: {
    // 获取污染物类型
    *getPollutantTypeList({ payload }, {
      update, call
    }) {
      const result = yield call(services.getPollutantTypeList, payload);
      if (result.requstresult === "1") {
        yield update({
          pollutantTypelist: result.data,
          defaultPollutantCode: result.data[0] && result.data[0]["pollutantTypeCode"]
        })
      }
    },
    // 获取省市区/企业/排口
    * getEnterpriseAndPoint({
      payload,
    }, { call, update, select }) {
      const level = yield select(state => state.common.level);
      const result = yield call(services.getEnterpriseAndPoint, payload);
      if (result.IsSuccess) {
        if (level !== result.Datas.level) {
          yield update({ level: result.Datas.level });
        }
        yield update({ enterpriseAndPointList: result.Datas.list });
      }
    },
  },
});
