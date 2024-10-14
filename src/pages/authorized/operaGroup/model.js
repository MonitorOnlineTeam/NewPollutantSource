/*
 * @Description: 
 * @Author: outman0611
 * @Date: 2024-09-29 17:13:21
 * @LastEditors: outman0611
 * @LastEditTime: 2024-10-09 11:28:01
 */
import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { API } from '@config/API'
import { requestPost, downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'operaGroup',
  state: {
    tableDatas: [],
    tableLoading: false,
    tableTotal: 0,
  },
  effects: {
    // 列表
    *GetOperationTeamList({ payload, callback }, { call, select, update }) {
      const result = yield call(requestPost, API.AssetManagementApi.GetOperationTeamList, payload);
      if (result.IsSuccess) {
        yield update({
          tableDatas: result.Datas || [],
        });
      }
    },
    // 添加编辑运维小组
    *AddOrUpdOperationTeam({ payload, callback }, { call, select, update }) {
      const result = yield call(requestPost, API.AssetManagementApi.AddOrUpdOperationTeam, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      }
    },
    // 删除运维公司
    *DelOperationTeam({ payload, callback }, { call, select, update }) {
      const result = yield call(requestPost, API.AssetManagementApi.DelOperationTeam, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback && callback(result.Datas);
      }
    },
    // 获取运维小组人员
    *GetOperationTeamUser({ payload, callback }, { call, select, update }) {
      const result = yield call(requestPost, API.AssetManagementApi.GetOperationTeamUser, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      }
    },
    // 设置运维小组人员
    *AddSetOperationTeamUser({ payload, callback }, { call, select, update }) {
      const result = yield call(requestPost, API.AssetManagementApi.AddSetOperationTeamUser, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback && callback(result.Datas);
      }
    },
    // 获取运维小组权限点位信息
    *GetOperationTeamPoint({ payload, callback }, { call, select, update }) {
      const result = yield call(requestPost, API.AssetManagementApi.GetOperationTeamPoint, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      }
    },
    // 添加运维小组权限点位信息
    *AddSetOperationTeamPoint({ payload, callback }, { call, select, update }) {
      const result = yield call(requestPost, API.AssetManagementApi.AddSetOperationTeamPoint, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      }
    },




  }
})