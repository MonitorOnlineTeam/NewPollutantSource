/*
 * @Author: outman0611
 * @Date: 2024-06-11 14:29:31
 * @LastEditors: outman0611
 * @LastEditTime: 2024-10-29 15:12:10
 */

import Model from '@/utils/model';
import {
  GetDefectModel,
  GetEntByRegion,
  GetAttentionDegreeList,
  ExportGetAlarmDataList,
  DeleteOperationMaintenanceEnterpriseID,

} from './service';
import { requestPost } from '@/utils/utils';
import { API } from '@config/API'
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'operationUnit',
  state: {
    exloading: false,
    loading: false,
    queryPar: {
      beginTime: moment()
        .subtract(1, 'day')
        .format('YYYY-MM-DD 00:00:00'),
      endTime: moment().format('YYYY-MM-DD 23:59:59'),
      AttentionCode: '',
      EntCode: '',
      RegionCode: '',
      Atmosphere: '',
      PollutantType: '',
      PageSize: 20,
      PageIndex: 1,
      dataType: 'HourData',
      OperationPersonnel: ''
    },
    tableDatas: [],
    total: '',
    attentionList: [],
    priseList: [],
    operationUnitWhere: undefined
  },
  subscriptions: {},
  effects: {
    *getDefectModel({ payload, callback }, { call, put, update, select }) {
      //列表
      const response = yield call(GetDefectModel, { ...payload });
      if (response.IsSuccess) {
        yield update({
          tableDatas: response.Datas,
          total: response.Total,
        });
        callback(payload.dataType);
      }
    },

    *deleteOperationMaintenanceEnterpriseID({ payload, callback }, { call, put, update, select }) {
      //获取所有企业列表
      const response = yield call(DeleteOperationMaintenanceEnterpriseID, { ...payload });
      if (response.IsSuccess) {
        message.success(response.Message);
        callback(response)
      }
    },
    // 获取运维企业权限点位信息
    *GetOperationCompanyPointList({ payload, callback }, { call, select, update }) {
      const result = yield call(requestPost, API.AssetManagementApi.GetOperationCompanyPointList, payload);
        callback && callback(result?.Datas);
    },
    // 添加运维企业点位权限
    *AddSetOperationCompanyPoint({ payload, callback }, { call, select, update }) {
      const result = yield call(requestPost, API.AssetManagementApi.AddSetOperationCompanyPoint, payload);
      if (result.IsSuccess) {
        message.success(result.Message);
        callback && callback(result.Datas);
      }
    },
    // 注销运维公司
    *LogOffCompany({ payload, callback }, { call, select, update }) {
      const result = yield call(requestPost, API.AssetManagementApi.LogOffCompany, payload);
      if (result.IsSuccess) {
        message.success(result.Message);
        callback && callback(result);
      }
    },
  },
});

