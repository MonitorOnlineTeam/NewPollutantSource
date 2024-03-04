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
  },
  effects: {
    *updOperationSetting({ payload, callback }, { call, put, update }) { //设置
      const result = yield call(services.UpdOperationSetting, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback&&callback()
      } else {
        message.error(result.Message)
      }
    }
  },

})