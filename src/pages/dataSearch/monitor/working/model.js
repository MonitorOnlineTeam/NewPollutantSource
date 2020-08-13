//运维任务列表
import moment from 'moment';
import * as services from './service';
import Model from '@/utils/model';
import { message } from 'antd';

export default Model.extend({
  namespace: 'working',
  state: {
    flowTableData: []
  },

  effects: {
    *getFlowTableData({ payload, }, { call, update, put, take, select }) {
      const result = yield call(services.getFlowTableData, payload);
      if (result.IsSuccess) {
        yield update({ flowTableData: result.Datas })
      } else {
        message.error(result.Message)
      }
    },
  }
});
