import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'equiptmentHandManager',
  state: {
  },
  effects: {
    *getProjectInfoList({ payload,callback }, { call, put, update }) { //项目信息列表
      yield update({ tableLoading:true})
      const result = yield call(services.GetProjectInfoList, payload);
      if (result.IsSuccess) {
        yield update({
          tableTotal:result.Total,
          tableDatas:result.Datas,
          tableLoading:false
        })
      }else{
        message.error(result.Message)
        yield update({ tableLoading:false})
      }
    },
    
    
  },
})