import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'

export default Model.extend({
  namespace: 'projectManager',
  state: {
    tableDatas:[],
    parametersList:[],
  },
  effects: {
    *getEquipmentParametersInfo({ payload,callback }, { call, put, update }) { //参数列表
      const result = yield call(services.GetEquipmentParametersInfo, payload);
      if (result.IsSuccess) {
        yield update({
          tableDatas:result.Datas
        })
        callback(result.Datas)
      }

    },

  },
})