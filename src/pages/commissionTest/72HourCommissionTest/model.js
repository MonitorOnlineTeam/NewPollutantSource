import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'hourCommissionTest',
  state: {
    tableDatas:[],
    tableTotal:0,
  },
  effects: {
    *getSystemModelList({ payload,callback }, { call, put, update }) { //列表
      yield update({ tableLoading:true})
      const result = yield call(services.GetSystemModelList, payload);
      if (result.IsSuccess) {
        yield update({
          tableTotal:result.Total,
          tableDatas:result.Datas? result.Datas.rtnlist : [],
          tableLoading:false,
          maxNum:result.Datas.MaxNum,
        })
      }else{
        message.error(result.Message)
        yield update({ tableLoading:false})
      }
    },
    
  },
})