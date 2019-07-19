//行政区划/部門
import { message } from 'antd';
import * as services from '../services/regionApi';
import Model from '@/utils/model';

export default Model.extend({
  namespace: 'region',
  state: {
    enterpriseAndPointList: [],
    level: null,
  },

  effects: {
    * getEnterpriseAndPoint({
      payload,
    }, { call, update, select }) {
      const level = yield select(state => state.region.level);
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
