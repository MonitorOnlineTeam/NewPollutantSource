import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'checkInfo',
  state: {
    data:[],
  },
  effects: {
    *getData({ payload,callback }, { call, put, update }) { //获取
      const result = yield call(services.GetData, payload);
      if (result.IsSuccess) {
        callback(result.Datas)
      }else{
        message.error(result.Message)
      }
    },
    *saveData({ payload,callback }, { call, put, update }) { //保存
      const result = yield call(services.SaveData, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    }, 

  },
})