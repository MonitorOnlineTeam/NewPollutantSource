

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
    *insertImportEnt({ payload }, { call, put, update, select }) {
      //列表
      const response = yield call(InsertImportEnt, { ...payload });
      if (response.IsSuccess) {
            message.success(response.Message)
      }else{
        message.error(response.Message)
      } 
    }
    
  },
});
