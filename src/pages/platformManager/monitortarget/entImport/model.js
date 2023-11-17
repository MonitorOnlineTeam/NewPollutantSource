

import Model from '@/utils/model';
import {
  InsertImportEnt,
} from './service';
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'entImport',
  state: {

  },
  subscriptions: {},
  effects: {
    *insertImportEnt({ payload,callback }, { call, put, update, select }) {
      //列表
      const response = yield call(InsertImportEnt, { ...payload });
      if (response.IsSuccess) {
            message.success(response.Message)
            callback(response)
      }else{
        message.error(response.Message)
      } 
    }
    
  },
});
