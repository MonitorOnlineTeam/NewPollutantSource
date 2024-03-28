import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'pollutantMold',
  state: {

  },
  effects: {
    *addAnomalyModle({ payload,callback }, { call, put, update }) { //生成模型需要的Excl
      const result = yield call(services.AddAnomalyModle, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    }, 

    *createFeatureLibrary({ payload,callback }, { call, put, update }) { //生成特征库
      const result = yield call(services.CreateFeatureLibrary, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback&&callback()
      }else{
        message.error(result.Message)
      }
    },
    
  },
})