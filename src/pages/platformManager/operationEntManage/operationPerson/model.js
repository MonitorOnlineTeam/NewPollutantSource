/**
 * 功  能：运维人员列表
 * 创建人：贾安波
 * 创建时间：2021.05.14
 */

import Model from '@/utils/model';
import {
  SelectOperationMaintenancePersonnel,
  DeleteOperationMaintenancePersonnel
} from './service';
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'operationPerson',
  state: {
    exloading: false,
    loading: false,
    queryPar: {
      Company: '',
      PersonnelName:'',
      type : '1,1',
      col1: '1',
    },
    tableDatas: [],
    total: '',
    attentionList:[],
    priseList: [],
  },
  subscriptions: {},
  effects: {
    *selectOperationMaintenancePersonnel({ payload,callback }, { call, put, update, select }) {
      //列表
      const response = yield call(SelectOperationMaintenancePersonnel, { ...payload });
      if (response.IsSuccess) {
        yield update({
          tableDatas: response.Datas,
          total: response.Total,
        });
      }
    },
    *deleteOperationMaintenancePersonnel({ payload,callback }, { call, put, update, select }) {
      //删除
      const response = yield call(DeleteOperationMaintenancePersonnel, { ...payload });
      if (response.IsSuccess) {
        message.success(response.Message);
        callback(response.IsSuccess)
      }
    },


  },
});
