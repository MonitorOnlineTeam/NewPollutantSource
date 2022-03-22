import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'

export default Model.extend({
  namespace: 'deviceParam',
  state: {
    tableDatas:[],
  },
  effects: {
    *getEquipmentParametersInfo({ payload,callback }, { call, put, update }) { //参数列表
      const result = yield call(services.GetEquipmentParametersInfo, payload);
      if (result.IsSuccess) {
        yield update({
          tableDatas:result.Datas
        })
      }

    },
    *getEquipmentParameters({ payload,callback }, { call, put, update }) { //设定 参数列表
      const result = yield call(services.GetEquipmentParameters, payload);
      if (result.IsSuccess) {
        callback(result.Datas[0])
      }
    }
    
  },
})