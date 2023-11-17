import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'operationBasConfig',
  state: {
    tableDatas:[],
 
  },
  effects: {
    *getSystemExceptionList({ payload,callback }, { call, put, update }) { //异常日志 列表
      const result = yield call(services.GetSystemExceptionList, payload);
      if (result.IsSuccess) {
        yield update({
          tableTotal:result.Total,
          tableDatas:result.Datas?result.Datas : [],
          queryPar:payload,
        })
      }else{
        message.error(result.Message)
      }
    },
    *deleteSystemException({ payload,callback }, { call, put, update }) { //异常日志 删除
      const result = yield call(services.DeleteSystemException, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    }
  },
   
})