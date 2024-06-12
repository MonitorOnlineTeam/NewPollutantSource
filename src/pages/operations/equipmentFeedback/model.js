import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'equipmentFeedback',
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
  //导出
  *exportFaultFeedback({   payload,callback }, { call, update, select, put }) {
    const result = yield call(services.ExportFaultFeedback, { ... payload });
    if (result.IsSuccess) {
      downloadFile(result.Datas);
      message.success(result.Message)
    } else {
      message.error(result.Message)
    }
  }, 

    //企业下拉列表
    *getFaultFeedbackEntPoint({   payload,callback }, { call, update, select, put }) {
      const result = yield call(services.GetFaultFeedbackEntPoint, { ... payload });
      if (result.IsSuccess) {
        yield update({entList: result.Datas?result.Datas.entList :[] });
      } else {
        message.error(result.Message)
      }
    },
  }
  
})