import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'remoteSupervision',
  state: {
    faultFeedbackList:[],
    tableTotal:1,
    entList:[],
  },
  effects: {
   //列表
    *getFaultFeedbackList({   payload, }, { call, update, select, put }) {
      const result = yield call(services.GetFaultFeedbackList, { ... payload });
      if (result.IsSuccess) {
        yield update({faultFeedbackList: result.Datas,tableTotal:result.Total });
      } else {
        message.error(result.Message)
      }
    },
   //编辑
   *updateFaultFeedbackIsSolve({   payload,callback }, { call, update, select, put }) {
    const result = yield call(services.UpdateFaultFeedbackIsSolve, { ... payload });
    if (result.IsSuccess) {
      message.success(result.Message)
      callback()
    } else {
      message.error(result.Message)
    }
  },

    // 根据企业获取排口
    *getPointByEntCode({ payload,callback}, { call, update }) {
      const result = yield call(services.getPointByEntCode, payload);
      if (result.IsSuccess) {
         callback(result.Datas)
      }
    },

  }
  
})