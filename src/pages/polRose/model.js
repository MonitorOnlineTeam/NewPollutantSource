import * as services from './service';
import Model from '@/utils/model';
import { message } from 'antd';

export default Model.extend({
  namespace: 'polRose',
  state: {
    PollutantList: [],
    RoleData: {},
  },
  effects: {
    /*获取污染因子**/
    * GetPollutantAQI({
      payload,
      callback
    }, {
      call,
      update,
    }) {
      const result = yield call(services.GetPollutantAQI, { ...payload });
      if (result.IsSuccess) {
        callback(result.Datas)
        yield update({
          PollutantList: result.Datas,
        });
      } else {
        message.error(result.Message)
      }
    },
    /*获取玫瑰图**/
    * GetRoleData({
    payload
  }, {
    call,
    update,
  }) {
    const result = yield call(services.GetRoleData, { ...payload });
    if (result.IsSuccess) {
      yield update({
        RoleData: result.Datas,
      });
    } else {
      message.error(result.Message)
    }
  }
  }
})
