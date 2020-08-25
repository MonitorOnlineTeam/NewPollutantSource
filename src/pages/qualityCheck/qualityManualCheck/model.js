
import * as services from './services';
import { getPollutantListByDgimn } from "@/services/commonApi"
import Model from '@/utils/model';
import { message } from 'antd';


export default Model.extend({
  namespace: 'qcManualCheck',
  state: {
    bottleDataList: [],
  },
  effects: {
    // 获取气瓶数据
    *getBottleDataList({ payload, }, { call, update, put, take, select }) {
      const result = yield call(services.getBottleDataList, payload);
      if (result.IsSuccess) {
        yield update({ bottleDataList: result.Datas })
      } else {
        message.error(result.Message)
      }
    },
  },
  reducers: {
    
  }
});
