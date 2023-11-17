/**
 * 功  能：运维人员列表
 * 创建人：jab
 * 创建时间：2021.05.14
 */

import Model from '@/utils/model';
import {
  SelectOperationMaintenancePersonnel,
  DeleteOperationMaintenancePersonnel,
  ListOperationMaintenanceEnterprise
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
      type : '',
      col1: '',
    },
    tableDatas: [],
    total: '',
    operationList: [],
    duplicateList:[]
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
          duplicateList:response.Datas
        });
      }else{
        message.error(response.Message);
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
    *listOperationMaintenanceEnterprise({ payload,callback }, { call, put, update, select }) {
      // 运维列表
      const response = yield call(ListOperationMaintenanceEnterprise, { ...payload });
      if (response.IsSuccess) {
        yield update({
          operationList: response.Datas,
        });
        // callback(response.IsSuccess)
      }
    },
    

  },
});
