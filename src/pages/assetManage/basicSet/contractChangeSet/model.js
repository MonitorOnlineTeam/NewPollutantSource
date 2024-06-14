import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'contractChangeSet',
  state: {
    tableDatas:[],
    tableLoading:false,
    tableTotal:0,
  },
  effects: {
    *getOperationUserList({ payload,callback }, { call, put, update }) { //列表
      const result = yield call(services.GetOperationUserList, payload);
      if (result.IsSuccess) {
        yield update({
          tableTotal:result.Total,
          tableDatas:result.Datas?result.Datas : [],
          tableLoading:false,
        })
      }else{
        message.error(result.Message)
      }
    },
    *updateOperationUser({ payload,callback }, { call, put, update }) { //添加
      const result = yield call(services.UpdateOperationUser, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    },  
    *deleteOperationUser({ payload,callback }, { call, put, update }) { //删除
      const result = yield call(services.DeleteOperationUser, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    },

  },
})