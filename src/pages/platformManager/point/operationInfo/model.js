/**
 * 功  能：监测点下的运维信息
 * 创建人：贾安波
 * 创建时间：2021.05.27
 */

import Model from '@/utils/model';
import {
  GetOperationPointList,
  AddOrUpdateOperationPoint,
  DeleteOperationPoint,
  ListOperationMaintenanceEnterprise
} from './service';
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'operationInfo',
  state: {
    exloading: false,
    loading: false,
    confirmLoading:false,
    queryPar: {
      Company: '',
      PersonnelName:'',
      type : '',
      col1: '',
    },
    tableDatas: [],
    total: '',
    operationList: [],
  },
  subscriptions: {},
  effects: {
    *getOperationPointList({ payload,callback }, { call, put, update, select }) {
      //列表
      const response = yield call(GetOperationPointList, { ...payload });
      if (response.IsSuccess) {
        yield update({
          tableDatas: response.Datas,
          total: response.Total,
        });
      }
    },
    *addOrUpdateOperationPoint({ payload,callback }, { call, put, update, select }) {
      //编辑或添加
      const response = yield call(AddOrUpdateOperationPoint, { ...payload });
      if (response.IsSuccess) {
        message.success(response.Message);
      }else{
        message.error(response.Message);
      }
    },
    *deleteOperationPoint({ payload,callback }, { call, put, update, select }) {
      //删除
      const response = yield call(DeleteOperationPoint, { ...payload });
      if (response.IsSuccess) {
        message.success(response.Message); 
      }else{
        message.error(response.Message);
      }
      callback(response.IsSuccess)
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
