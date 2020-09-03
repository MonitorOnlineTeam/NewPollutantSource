//运维任务列表
import * as services from './service';
import Model from '@/utils/model';
import { message } from 'antd';

export default Model.extend({
  namespace: 'offStream',
  state: {

  },

  effects: {
    *saveOutputStop({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.saveOutputStop, payload);
      if (result.IsSuccess) {
        message.success("添加成功")
        callback && callback()
      } else {
        message.error(result.Message)
      }
    },
    *deleteStop({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.deleteStop, payload);
      if (result.IsSuccess) {
        message.success("删除成功")
        callback && callback()
      } else {
        message.error(result.Message)
      }
    },
  }
});
